package com.edu.primary.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.edu.primary.data.local.entity.ChatMessageEntity

@Dao
interface ChatMessageDao {
    @Insert
    suspend fun insert(message: ChatMessageEntity): Long

    @Query("SELECT * FROM chat_messages WHERE userId = :userId ORDER BY timestamp ASC")
    suspend fun getByUser(userId: Long): List<ChatMessageEntity>

    @Query("DELETE FROM chat_messages WHERE userId = :userId")
    suspend fun clearByUser(userId: Long)

    @Query("SELECT COUNT(*) FROM chat_messages WHERE userId = :userId")
    suspend fun getCount(userId: Long): Int
}
