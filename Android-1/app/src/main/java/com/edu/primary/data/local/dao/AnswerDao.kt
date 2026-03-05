package com.edu.primary.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.edu.primary.data.local.entity.AnswerEntity

@Dao
interface AnswerDao {
    @Insert
    suspend fun insert(answer: AnswerEntity): Long

    @Query("SELECT * FROM answers WHERE userId = :userId")
    suspend fun getByUser(userId: Long): List<AnswerEntity>

    @Query("SELECT * FROM answers WHERE userId = :userId AND questionId = :questionId")
    suspend fun get(userId: Long, questionId: Long): AnswerEntity?

    @Query("SELECT COUNT(*) FROM answers WHERE userId = :userId AND isCorrect = 1")
    suspend fun getCorrectCount(userId: Long): Int

    @Query("SELECT COUNT(*) FROM answers WHERE userId = :userId")
    suspend fun getTotalCount(userId: Long): Int
}
