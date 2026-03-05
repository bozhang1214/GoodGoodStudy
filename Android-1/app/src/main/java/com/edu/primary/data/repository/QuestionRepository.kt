package com.edu.primary.data.repository

import android.content.Context
import com.edu.primary.data.local.AppDatabase
import com.edu.primary.data.local.entity.AnswerEntity
import com.edu.primary.data.local.entity.QuestionEntity
import com.edu.primary.data.local.entity.WrongQuestionEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext

/**
 * 题目与练习相关数据仓库：题目查询、答题记录、错题本、进度统计。
 *
 * 所有 IO 操作在 [Dispatchers.IO] 上执行。通过 [AppDatabase] 的 questionDao、answerDao、wrongQuestionDao 访问本地数据。
 *
 * @param context 用于获取 ApplicationContext 创建数据库实例
 */
class QuestionRepository(context: Context) {
    private val db = AppDatabase.getInstance(context.applicationContext)

    /** 按学科与年级获取题目列表。 */
    suspend fun getQuestions(subjectId: Int, grade: Int): List<QuestionEntity> = withContext(Dispatchers.IO) {
        db.questionDao().getBySubjectAndGrade(subjectId, grade)
    }

    /** 按 ID 列表批量获取题目，用于错题重做等场景。 */
    suspend fun getQuestionsByIds(ids: List<Long>): List<QuestionEntity> = withContext(Dispatchers.IO) {
        db.questionDao().getByIds(ids)
    }

    /** 根据题目 ID 获取单道题目。 */
    suspend fun getQuestionById(id: Long): QuestionEntity? = withContext(Dispatchers.IO) {
        db.questionDao().getById(id)
    }

    /** 某学科某年级的题目总数。 */
    suspend fun getQuestionCount(subjectId: Int, grade: Int): Int = withContext(Dispatchers.IO) {
        db.questionDao().getCount(subjectId, grade)
    }

    /** 插入一条答题记录。 */
    suspend fun insertAnswer(answer: AnswerEntity) = withContext(Dispatchers.IO) {
        db.answerDao().insert(answer)
    }

    /** 将错题加入错题本；若已存在则更新用户答案与错题时间。 */
    suspend fun addWrongQuestion(userId: Long, questionId: Long, userAnswer: String) = withContext(Dispatchers.IO) {
        val existing = db.wrongQuestionDao().get(userId, questionId)
        if (existing == null) {
            db.wrongQuestionDao().insert(
                WrongQuestionEntity(userId = userId, questionId = questionId, userAnswer = userAnswer)
            )
        } else {
            db.wrongQuestionDao().update(
                existing.copy(userAnswer = userAnswer, wrongTime = System.currentTimeMillis())
            )
        }
    }

    /** 从错题本移除指定题目。 */
    suspend fun removeWrongQuestion(userId: Long, questionId: Long) = withContext(Dispatchers.IO) {
        db.wrongQuestionDao().get(userId, questionId)?.let { db.wrongQuestionDao().delete(it) }
    }

    /** 增加错题复习次数。 */
    suspend fun incrementReviewCount(userId: Long, questionId: Long) = withContext(Dispatchers.IO) {
        db.wrongQuestionDao().get(userId, questionId)?.let {
            db.wrongQuestionDao().update(it.copy(reviewCount = it.reviewCount + 1))
        }
    }

    /** 获取用户对某题的答题记录。 */
    suspend fun getAnswer(userId: Long, questionId: Long) = withContext(Dispatchers.IO) {
        db.answerDao().get(userId, questionId)
    }

    /** 获取用户所有错题记录，用于错题本列表。 */
    suspend fun getWrongQuestions(userId: Long): List<WrongQuestionEntity> = withContext(Dispatchers.IO) {
        db.wrongQuestionDao().getByUser(userId)
    }

    /** 进度统计：总答题数、正确数、正确率（0–100）。 */
    data class ProgressData(val total: Int, val correct: Int, val accuracy: Double)

    /** 获取当前用户的答题进度与正确率。 */
    suspend fun getProgressData(userId: Long): ProgressData = withContext(Dispatchers.IO) {
        val total = db.answerDao().getTotalCount(userId)
        val correct = db.answerDao().getCorrectCount(userId)
        val accuracy = if (total > 0) correct * 100.0 / total else 0.0
        ProgressData(total, correct, accuracy)
    }
}
