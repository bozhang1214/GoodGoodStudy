package com.edu.primary.ui.aiassistant;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.edu.primary.R;
import com.edu.primary.database.entity.ChatMessageEntity;
import com.edu.primary.repository.AIRepository;
import com.edu.primary.repository.UserRepository;
import com.edu.primary.utils.Logger;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

import java.util.ArrayList;
import java.util.List;

public class AIAssistantFragment extends Fragment {
    private RecyclerView recyclerView;
    private EditText etMessage;
    private Button btnSend;
    private ChatAdapter adapter;
    private AIRepository aiRepository;
    private UserRepository userRepository;
    private CompositeDisposable disposables = new CompositeDisposable();
    private List<ChatMessageEntity> messages = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_ai_assistant, container, false);

        // 使用ApplicationContext防止内存泄漏
        aiRepository = new AIRepository(requireContext().getApplicationContext());
        userRepository = new UserRepository(requireContext().getApplicationContext());

        recyclerView = view.findViewById(R.id.recycler_view);
        etMessage = view.findViewById(R.id.et_message);
        btnSend = view.findViewById(R.id.btn_send);

        adapter = new ChatAdapter(messages);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerView.setAdapter(adapter);

        btnSend.setOnClickListener(v -> sendMessage());

        if (aiRepository.getApiKey().isEmpty()) {
            Toast.makeText(requireContext(), getString(R.string.please_config_api_key_in_settings), Toast.LENGTH_LONG).show();
        }

        loadChatHistory();

        return view;
    }

    /**
     * 加载聊天历史
     */
    private void loadChatHistory() {
        long userId = userRepository.getCurrentUserId();
        if (userId == -1) {
            Logger.w("AIAssistantFragment", "User not logged in");
            return;
        }

        Logger.d("AIAssistantFragment", "Loading chat history for user: " + userId);
        disposables.add(aiRepository.getChatHistory(userId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                history -> {
                    Logger.d("AIAssistantFragment", "Loaded " + history.size() + " messages");
                    messages.clear();
                    messages.addAll(history);
                    adapter.notifyDataSetChanged();
                    scrollToBottom();
                },
                error -> {
                    Logger.e("AIAssistantFragment", "Failed to load chat history", error);
                    // Ignore error, may be first time use
                }
            ));
    }

    private void sendMessage() {
        String message = etMessage.getText().toString().trim();
        if (message.isEmpty()) {
            return;
        }

        long userId = userRepository.getCurrentUserId();
        if (userId == -1) {
            Toast.makeText(requireContext(), getString(R.string.please_login), Toast.LENGTH_SHORT).show();
            return;
        }

        if (aiRepository.getApiKey().isEmpty()) {
            Toast.makeText(requireContext(), getString(R.string.please_config_api_key), Toast.LENGTH_SHORT).show();
            return;
        }

        etMessage.setText("");
        btnSend.setEnabled(false);
        btnSend.setText(R.string.thinking);

        disposables.add(aiRepository.sendMessage(userId, message)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                response -> {
                    btnSend.setEnabled(true);
                    btnSend.setText(R.string.send);
                    loadChatHistory();
                },
                error -> {
                    btnSend.setEnabled(true);
                    btnSend.setText(R.string.send);
                    Toast.makeText(requireContext(), getString(R.string.send_failed, error.getMessage()), Toast.LENGTH_SHORT).show();
                }
            ));
    }

    private void scrollToBottom() {
        if (recyclerView != null && adapter.getItemCount() > 0) {
            recyclerView.post(() -> recyclerView.smoothScrollToPosition(adapter.getItemCount() - 1));
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (disposables != null && !disposables.isDisposed()) {
            disposables.clear();
        }
        if (messages != null) {
            messages.clear();
        }
    }
}
