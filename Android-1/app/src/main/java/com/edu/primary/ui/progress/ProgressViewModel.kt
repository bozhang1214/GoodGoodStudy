package com.edu.primary.ui.progress

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edu.primary.data.repository.QuestionRepository
import com.edu.primary.data.repository.UserRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** 进度页 UI 状态：总答题数、正确数、正确率、加载与错误。 */
data class ProgressUiState(
    val total: Int = 0,
    val correct: Int = 0,
    val accuracy: Double = 0.0,
    val loading: Boolean = false,
    val error: String? = null
)

/**
 * 进度页 ViewModel：从 [QuestionRepository.getProgressData] 拉取当前用户答题统计并暴露给 UI。
 */
class ProgressViewModel(
    private val userRepository: UserRepository,
    private val questionRepository: QuestionRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(ProgressUiState())
    val uiState: StateFlow<ProgressUiState> = _uiState.asStateFlow()

    fun loadProgress() {
        viewModelScope.launch {
            val userId = userRepository.getCurrentUserId()
            if (userId == -1L) {
                _uiState.value = _uiState.value.copy(error = "请先登录")
                return@launch
            }
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            kotlin.runCatching {
                questionRepository.getProgressData(userId)
            }.onSuccess { data ->
                _uiState.value = _uiState.value.copy(
                    total = data.total,
                    correct = data.correct,
                    accuracy = data.accuracy,
                    loading = false
                )
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(loading = false, error = e.message)
            }
        }
    }
}
