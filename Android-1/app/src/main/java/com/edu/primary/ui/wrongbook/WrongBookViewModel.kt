package com.edu.primary.ui.wrongbook

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edu.primary.data.local.entity.WrongQuestionEntity
import com.edu.primary.data.repository.QuestionRepository
import com.edu.primary.data.repository.UserRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** 错题本页 UI 状态：错题列表、加载与错误。 */
data class WrongBookUiState(
    val items: List<WrongQuestionEntity> = emptyList(),
    val loading: Boolean = false,
    val error: String? = null
)

/**
 * 错题本 ViewModel：加载当前用户错题列表，供进入错题复习或移除错题使用。
 */
class WrongBookViewModel(
    private val userRepository: UserRepository,
    private val questionRepository: QuestionRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(WrongBookUiState())
    val uiState: StateFlow<WrongBookUiState> = _uiState.asStateFlow()

    fun loadWrongQuestions() {
        viewModelScope.launch {
            val userId = userRepository.getCurrentUserId()
            if (userId == -1L) {
                _uiState.value = _uiState.value.copy(error = "请先登录")
                return@launch
            }
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            kotlin.runCatching {
                questionRepository.getWrongQuestions(userId)
            }.onSuccess { list ->
                _uiState.value = _uiState.value.copy(items = list, loading = false)
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(loading = false, error = e.message)
            }
        }
    }
}
