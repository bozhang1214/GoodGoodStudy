package com.edu.primary.repository;

import android.content.Context;
import android.content.SharedPreferences;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.AppDatabase;
import com.edu.primary.database.entity.ChatMessageEntity;
import com.edu.primary.network.ApiClient;
import com.edu.primary.network.DeepseekApiService;
import com.edu.primary.network.model.DeepseekRequest;
import com.edu.primary.network.model.DeepseekResponse;
import io.reactivex.Single;
import io.reactivex.schedulers.Schedulers;

import java.util.ArrayList;
import java.util.List;

public class AIRepository {

    private AppDatabase database;
    private SharedPreferences prefs;
    private DeepseekApiService apiService;
    private Context context;

    public AIRepository(Context context) {
        this.context = context;
        database = AppDatabase.getInstance(context);
        prefs = context.getSharedPreferences(AppConstants.PREFS_AI, Context.MODE_PRIVATE);
        apiService = ApiClient.getDeepseekApiService();
    }

    public void setApiKey(String apiKey) {
        prefs.edit().putString(AppConstants.KEY_API_KEY, apiKey).apply();
    }

    public String getApiKey() {
        return prefs.getString(AppConstants.KEY_API_KEY, "");
    }

    public Single<String> sendMessage(long userId, String message) {
        return Single.fromCallable(() -> {
            ChatMessageEntity userMessage = new ChatMessageEntity(userId, AppConstants.ROLE_USER, message);
            database.chatMessageDao().insertMessage(userMessage);

            List<ChatMessageEntity> history = database.chatMessageDao().getMessagesByUser(userId);
            
            if (history.size() > AppConstants.MAX_HISTORY_MESSAGES) {
                List<ChatMessageEntity> recentHistory = new ArrayList<>();
                for (int i = history.size() - AppConstants.MAX_HISTORY_MESSAGES; i < history.size(); i++) {
                    recentHistory.add(history.get(i));
                }
                history = recentHistory;
            }

            DeepseekRequest request = new DeepseekRequest();
            List<DeepseekRequest.Message> messages = new ArrayList<>();
            
            messages.add(new DeepseekRequest.Message(AppConstants.ROLE_SYSTEM, 
                context.getString(com.edu.primary.R.string.ai_system_prompt)));
            
            for (ChatMessageEntity msg : history) {
                messages.add(new DeepseekRequest.Message(msg.role, msg.content));
            }
            
            request.setMessages(messages);

            String apiKey = getApiKey();
            if (apiKey.isEmpty()) {
                throw new Exception(AppConstants.ERROR_API_KEY_NOT_SET);
            }

            DeepseekResponse response = apiService.chat(
                AppConstants.BEARER_PREFIX + apiKey,
                AppConstants.CONTENT_TYPE_JSON,
                request
            ).blockingGet();

            String assistantMessage = response.getContent();
            
            ChatMessageEntity assistantMsg = new ChatMessageEntity(userId, AppConstants.ROLE_ASSISTANT, assistantMessage);
            database.chatMessageDao().insertMessage(assistantMsg);

            return assistantMessage;
        }).subscribeOn(Schedulers.io());
    }

    public Single<List<ChatMessageEntity>> getChatHistory(long userId) {
        return Single.fromCallable(() ->
            database.chatMessageDao().getMessagesByUser(userId)
        ).subscribeOn(Schedulers.io());
    }

    public void clearChatHistory(long userId) {
        new Thread(() -> {
            database.chatMessageDao().clearMessages(userId);
        }).start();
    }
}
