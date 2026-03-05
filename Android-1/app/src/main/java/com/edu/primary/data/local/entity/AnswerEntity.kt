package com.edu.primary.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "answers")
data class AnswerEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: Long,
    val questionId: Long,
    val userAnswer: String,
    val isCorrect: Boolean,
    val answerTime: Long = System.currentTimeMillis()
)
