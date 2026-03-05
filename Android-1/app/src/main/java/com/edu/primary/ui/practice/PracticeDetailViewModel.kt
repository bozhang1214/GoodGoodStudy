package com.edu.primary.ui.practice

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edu.primary.data.local.entity.AnswerEntity
import com.edu.primary.data.local.entity.QuestionEntity
import com.edu.primary.data.repository.QuestionRepository
import com.edu.primary.data.repository.UserRepository
import com.edu.primary.util.AppConstants
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** 练习详情页 UI 状态：题目列表、当前索引、临时答案、提交结果弹窗等。 */
data class PracticeDetailUiState(
    val questions: List<QuestionEntity> = emptyList(),
    val currentIndex: Int = 0,
    val tempAnswers: Map<Long, String> = emptyMap(),
    val allSubmitted: Boolean = false,
    val loading: Boolean = false,
    val error: String? = null,
    val resultDialog: ResultDialog? = null
)

/** 提交结果弹窗数据：答题数、正确数、错题数及错题 ID 列表。 */
data class ResultDialog(
    val totalAnswered: Int,
    val correctCount: Int,
    val wrongCount: Int,
    val wrongQuestionIds: List<Long>
)

/**
 * 练习详情 ViewModel：加载题目（普通练习或错题复习）、暂存答案、提交判分并写入答题记录与错题本。
 */
class PracticeDetailViewModel(
    private val userRepository: UserRepository,
    private val questionRepository: QuestionRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(PracticeDetailUiState())
    val uiState: StateFlow<PracticeDetailUiState> = _uiState.asStateFlow()

    fun loadQuestions(subjectId: Int, grade: Int, wrongIds: List<Long>?) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true)
            if (wrongIds != null && wrongIds.isNotEmpty()) {
                questionRepository.getQuestionsByIds(wrongIds).let { list ->
                    _uiState.value = _uiState.value.copy(
                        questions = list,
                        loading = false,
                        currentIndex = 0
                    )
                }
            } else {
                questionRepository.getQuestions(subjectId, grade).let { list ->
                    val maxQ = if (com.edu.primary.BuildConfig.DEBUG)
                        AppConstants.DEBUG_QUESTIONS_PER_PRACTICE
                    else AppConstants.RELEASE_QUESTIONS_PER_PRACTICE
                    val trimmed = list.take(maxQ).shuffled()
                    _uiState.value = _uiState.value.copy(
                        questions = trimmed,
                        loading = false,
                        currentIndex = 0
                    )
                }
            }
        }
    }

    fun setAnswer(questionId: Long, answer: String) {
        val cur = _uiState.value.tempAnswers.toMutableMap()
        if (answer.isBlank()) cur.remove(questionId) else cur[questionId] = answer
        _uiState.value = _uiState.value.copy(tempAnswers = cur)
    }

    fun nextQuestion() {
        val q = _uiState.value.questions
        if (_uiState.value.currentIndex < q.size - 1)
            _uiState.value = _uiState.value.copy(currentIndex = _uiState.value.currentIndex + 1)
    }

    fun previousQuestion() {
        if (_uiState.value.currentIndex > 0)
            _uiState.value = _uiState.value.copy(currentIndex = _uiState.value.currentIndex - 1)
    }

    fun submitAll(isReviewMode: Boolean) {
        val s = _uiState.value
        if (s.allSubmitted || s.questions.isEmpty()) return
        val userId = userRepository.getCurrentUserId()
        if (userId == -1L) return
        viewModelScope.launch {
            var totalAnswered = 0
            var correctCount = 0
            val wrongIds = mutableListOf<Long>()
            for (q in s.questions) {
                val ans = s.tempAnswers[q.id]?.trim() ?: continue
                totalAnswered++
                val correct = checkAnswer(q, ans)
                questionRepository.insertAnswer(
                    AnswerEntity(
                        userId = userId,
                        questionId = q.id,
                        userAnswer = ans,
                        isCorrect = correct
                    )
                )
                if (correct) {
                    correctCount++
                    if (isReviewMode)
                        questionRepository.removeWrongQuestion(userId, q.id)
                } else {
                    wrongIds.add(q.id)
                    questionRepository.addWrongQuestion(userId, q.id, ans)
                    if (isReviewMode)
                        questionRepository.incrementReviewCount(userId, q.id)
                }
            }
            _uiState.value = _uiState.value.copy(
                allSubmitted = true,
                tempAnswers = emptyMap(),
                resultDialog = ResultDialog(totalAnswered, correctCount, totalAnswered - correctCount, wrongIds)
            )
        }
    }

    private fun checkAnswer(q: QuestionEntity, answer: String): Boolean {
        return when (q.type) {
            AppConstants.QUESTION_TYPE_JUDGMENT ->
                (answer == "正确") == (q.correctAnswer == "正确")
            else -> q.correctAnswer == answer
        }
    }

    fun dismissResultDialog() {
        _uiState.value = _uiState.value.copy(resultDialog = null)
    }

    fun getAnswer(questionId: Long): String? = _uiState.value.tempAnswers[questionId]
}
