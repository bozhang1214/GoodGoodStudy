package com.edu.primary.database.entity;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

@Entity(tableName = "wrong_questions")
public class WrongQuestionEntity {
    @PrimaryKey(autoGenerate = true)
    public long id;

    public long userId;
    public long questionId;
    public String userAnswer;
    public long wrongTime;
    public int reviewCount; // 复习次数

    public WrongQuestionEntity() {
    }

    @Ignore
    public WrongQuestionEntity(long userId, long questionId, String userAnswer) {
        this.userId = userId;
        this.questionId = questionId;
        this.userAnswer = userAnswer;
        this.wrongTime = System.currentTimeMillis();
        this.reviewCount = 0;
    }
}

