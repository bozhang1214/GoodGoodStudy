package com.edu.primary.database.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import com.edu.primary.database.entity.ChatMessageEntity;

import java.util.List;

@Dao
public interface ChatMessageDao {
    @Insert
    long insertMessage(ChatMessageEntity message);

    @Query("SELECT * FROM chat_messages WHERE userId = :userId ORDER BY timestamp ASC")
    List<ChatMessageEntity> getMessagesByUser(long userId);

    @Query("DELETE FROM chat_messages WHERE userId = :userId")
    void clearMessages(long userId);

    @Query("SELECT COUNT(*) FROM chat_messages WHERE userId = :userId")
    int getMessageCount(long userId);
}

