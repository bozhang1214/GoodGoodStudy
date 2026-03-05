package com.edu.primary.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import com.edu.primary.data.local.entity.WrongQuestionEntity

@Dao
interface WrongQuestionDao {
    @Insert
    suspend fun insert(wrong: WrongQuestionEntity): Long

    @Update
    suspend fun update(wrong: WrongQuestionEntity)

    @Delete
    suspend fun delete(wrong: WrongQuestionEntity)

    @Query("SELECT * FROM wrong_questions WHERE userId = :userId ORDER BY wrongTime DESC")
    suspend fun getByUser(userId: Long): List<WrongQuestionEntity>

    @Query("SELECT * FROM wrong_questions WHERE userId = :userId AND questionId = :questionId")
    suspend fun get(userId: Long, questionId: Long): WrongQuestionEntity?
}
