package com.edu.primary.ui.aiassistant

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edu.primary.data.local.entity.ChatMessageEntity
import com.edu.primary.data.repository.AIRepository
import com.edu.primary.data.repository.UserRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** AI 助手页 UI 状态：消息列表、发送中加载、错误信息。 */
data class AIAssistantUiState(
    val messages: List<ChatMessageEntity> = emptyList(),
    val loading: Boolean = false,
    val error: String? = null
)

/**
 * AI 助手 ViewModel：加载聊天历史、发送消息并刷新列表、清空历史，依赖 [AIRepository]。
 */
class AIAssistantViewModel(
    private val userRepository: UserRepository,
    private val aiRepository: AIRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(AIAssistantUiState())
    val uiState: StateFlow<AIAssistantUiState> = _uiState.asStateFlow()

    fun loadHistory() {
        viewModelScope.launch {
            val userId = userRepository.getCurrentUserId()
            if (userId == -1L) return@launch
            kotlin.runCatching {
                aiRepository.getChatHistory(userId)
            }.onSuccess {
                _uiState.value = _uiState.value.copy(messages = it)
            }
        }
    }

    fun sendMessage(content: String, onResult: (String?) -> Unit) {
        val msg = content.trim()
        if (msg.isEmpty()) return
        val userId = userRepository.getCurrentUserId()
        if (userId == -1L) {
            _uiState.value = _uiState.value.copy(error = "请先登录")
            onResult(null)
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            aiRepository.sendMessage(userId, msg)
                .onSuccess { reply ->
                    loadHistory()
                    _uiState.value = _uiState.value.copy(loading = false)
                    onResult(reply)
                }
                .onFailure { e ->
                    _uiState.value = _uiState.value.copy(loading = false, error = e.message)
                    onResult(null)
                }
        }
    }

    fun clearHistory() {
        viewModelScope.launch {
            val userId = userRepository.getCurrentUserId()
            if (userId != -1L) {
                aiRepository.clearChatHistory(userId)
                _uiState.value = _uiState.value.copy(messages = emptyList())
            }
        }
    }
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
