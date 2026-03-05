package com.edu.primary.ui.practice

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edu.primary.data.local.entity.QuestionEntity
import com.edu.primary.data.repository.QuestionRepository
import com.edu.primary.util.AppConstants
import com.edu.primary.util.Logger
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** 练习入口页 UI 状态：题目数量、状态提示、加载与错误。 */
data class PracticeUiState(
    val subjectGradeCount: Int = 0,
    val statusMessage: String? = null,
    val loading: Boolean = false,
    val error: String? = null
)

/**
 * 练习入口 ViewModel：按学科与年级加载题目数量，供选择后进入 [PracticeDetailViewModel]。
 */
class PracticeViewModel(
    private val questionRepository: QuestionRepository,
    private val userRepository: com.edu.primary.data.repository.UserRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(PracticeUiState())
    val uiState: StateFlow<PracticeUiState> = _uiState.asStateFlow()

    fun loadQuestionCount(subjectId: Int, grade: Int) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            kotlin.runCatching {
                questionRepository.getQuestionCount(subjectId, grade)
            }.onSuccess { count ->
                val maxQ = if (com.edu.primary.BuildConfig.DEBUG)
                    AppConstants.DEBUG_QUESTIONS_PER_PRACTICE else AppConstants.RELEASE_QUESTIONS_PER_PRACTICE
                _uiState.value = _uiState.value.copy(
                    subjectGradeCount = count,
                    statusMessage = if (count > 0) "找到 ${minOf(count, maxQ)} 道题" else null,
                    loading = false
                )
            }.onFailure { e ->
                Logger.e("PracticeVM", e.message ?: "load failed", e)
                _uiState.value = _uiState.value.copy(loading = false, error = e.message)
            }
        }
    }

    fun setStatus(msg: String?) {
        _uiState.value = _uiState.value.copy(statusMessage = msg)
    }
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
