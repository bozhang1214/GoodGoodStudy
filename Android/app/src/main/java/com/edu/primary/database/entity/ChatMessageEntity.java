package com.edu.primary.database.entity;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

@Entity(tableName = "chat_messages")
public class ChatMessageEntity {
    @PrimaryKey(autoGenerate = true)
    public long id;

    public long userId;
    public String role; // user, assistant
    public String content;
    public long timestamp;

    public ChatMessageEntity() {
    }

    @Ignore
    public ChatMessageEntity(long userId, String role, String content) {
        this.userId = userId;
        this.role = role;
        this.content = content;
        this.timestamp = System.currentTimeMillis();
    }
}

