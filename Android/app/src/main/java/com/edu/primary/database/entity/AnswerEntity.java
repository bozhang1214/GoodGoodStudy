package com.edu.primary.database.entity;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

@Entity(tableName = "answers")
public class AnswerEntity {
    @PrimaryKey(autoGenerate = true)
    public long id;

    public long userId;
    public long questionId;
    public String userAnswer;
    public boolean isCorrect;
    public long answerTime;

    public AnswerEntity() {
    }

    @Ignore
    public AnswerEntity(long userId, long questionId, String userAnswer, boolean isCorrect) {
        this.userId = userId;
        this.questionId = questionId;
        this.userAnswer = userAnswer;
        this.isCorrect = isCorrect;
        this.answerTime = System.currentTimeMillis();
    }
}

