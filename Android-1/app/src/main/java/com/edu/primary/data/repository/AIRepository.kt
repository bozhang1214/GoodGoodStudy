package com.edu.primary.data.repository

import android.content.Context
import com.edu.primary.ai.RuleBasedTextGenerator
import com.edu.primary.data.local.AppDatabase
import com.edu.primary.data.local.entity.ChatMessageEntity
import com.edu.primary.util.AppConstants
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * AI 助手数据层：聊天记录持久化，回复生成优先本地 TFLite（可扩展），无模型时使用 [RuleBasedTextGenerator] 规则回退。
 *
 * 参考 aiAssistant 的 LocalAiEngine + RuleBasedTextGenerator。消息存入 [ChatMessageDao]，历史条数受 [AppConstants.MAX_HISTORY_MESSAGES] 限制。
 *
 * @param context 用于获取 ApplicationContext 与 SharedPreferences
 */
class AIRepository(context: Context) {
    private val appContext = context.applicationContext
    private val db = AppDatabase.getInstance(appContext)
    private val prefs = appContext.getSharedPreferences(AppConstants.PREFS_AI, Context.MODE_PRIVATE)

    /** 保存 API Key（若将来接入云端接口时使用）。 */
    fun setApiKey(key: String) {
        prefs.edit().putString(AppConstants.KEY_API_KEY, key).apply()
    }
    /** 读取已保存的 API Key。 */
    fun getApiKey(): String = prefs.getString(AppConstants.KEY_API_KEY, "").orEmpty()

    /**
     * 发送用户消息并生成助手回复。先持久化用户消息，再根据历史调用 [RuleBasedTextGenerator.chat] 生成回复并持久化。
     * @param userId 当前用户 ID
     * @param content 用户输入内容
     * @return [Result.success] 为助手回复文本，[Result.failure] 为异常
     */
    suspend fun sendMessage(userId: Long, content: String): Result<String> = withContext(Dispatchers.IO) {
        val userMsg = ChatMessageEntity(userId = userId, role = AppConstants.ROLE_USER, content = content)
        db.chatMessageDao().insert(userMsg)
        val history = db.chatMessageDao().getByUser(userId)
        val trimmed = if (history.size > AppConstants.MAX_HISTORY_MESSAGES)
            history.takeLast(AppConstants.MAX_HISTORY_MESSAGES) else history
        val reply = RuleBasedTextGenerator.chat(content, trimmed.size)
        val assistantMsg = ChatMessageEntity(userId = userId, role = AppConstants.ROLE_ASSISTANT, content = reply)
        db.chatMessageDao().insert(assistantMsg)
        Result.success(reply)
    }

    /** 获取指定用户的聊天历史，按时间升序。 */
    suspend fun getChatHistory(userId: Long): List<ChatMessageEntity> = withContext(Dispatchers.IO) {
        db.chatMessageDao().getByUser(userId)
    }

    /** 清空指定用户的聊天记录。 */
    suspend fun clearChatHistory(userId: Long) = withContext(Dispatchers.IO) {
        db.chatMessageDao().clearByUser(userId)
    }
}
