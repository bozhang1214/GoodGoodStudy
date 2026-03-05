package com.edu.primary.util

import android.content.Context
import com.edu.primary.data.local.AppDatabase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * 数据库初始化：若数学题表为空，则调用 [QuestionDataGenerator] 生成并插入各年级题目。
 * 题目数量由 DEBUG/RELEASE 与 [AppConstants] 决定。
 */
object DatabaseInitializer {
    private val questionsPerGrade
        get() = if (com.edu.primary.BuildConfig.DEBUG)
            AppConstants.DEBUG_QUESTIONS_PER_PRACTICE
        else
            AppConstants.RELEASE_QUESTIONS_PER_PRACTICE

    /** 若各年级数学题总数为 0，则生成并插入默认数学题。 */
    suspend fun initializeMathQuestions(context: Context) = withContext(Dispatchers.IO) {
        val db = AppDatabase.getInstance(context)
        val total = (AppConstants.MIN_GRADE..AppConstants.MAX_GRADE).sumOf { grade ->
            db.questionDao().getCount(AppConstants.SUBJECT_MATH, grade)
        }
        if (total == 0) {
            val list = QuestionDataGenerator.generateAllMathQuestions(questionsPerGrade)
            db.questionDao().insertAll(list)
        }
    }

    /** 为指定年级生成并插入 [count] 道数学题。 */
    suspend fun generateMathForGrade(context: Context, grade: Int, count: Int) = withContext(Dispatchers.IO) {
        val db = AppDatabase.getInstance(context)
        val list = QuestionDataGenerator.generateMathQuestions(grade, count)
        db.questionDao().insertAll(list)
    }
}
