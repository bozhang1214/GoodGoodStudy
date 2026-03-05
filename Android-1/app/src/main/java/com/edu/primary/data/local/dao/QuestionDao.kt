package com.edu.primary.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.edu.primary.data.local.entity.QuestionEntity

@Dao
interface QuestionDao {
    @Insert
    suspend fun insertAll(questions: List<QuestionEntity>)

    @Insert
    suspend fun insert(question: QuestionEntity): Long

    @Query("SELECT * FROM questions WHERE subjectId = :subjectId AND grade = :grade")
    suspend fun getBySubjectAndGrade(subjectId: Int, grade: Int): List<QuestionEntity>

    @Query("SELECT * FROM questions WHERE id IN (:ids)")
    suspend fun getByIds(ids: List<Long>): List<QuestionEntity>

    @Query("SELECT * FROM questions WHERE id = :id LIMIT 1")
    suspend fun getById(id: Long): QuestionEntity?

    @Query("SELECT COUNT(*) FROM questions WHERE subjectId = :subjectId AND grade = :grade")
    suspend fun getCount(subjectId: Int, grade: Int): Int
}
