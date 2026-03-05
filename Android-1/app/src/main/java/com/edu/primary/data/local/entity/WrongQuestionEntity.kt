package com.edu.primary.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "wrong_questions")
data class WrongQuestionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: Long,
    val questionId: Long,
    val userAnswer: String,
    val wrongTime: Long = System.currentTimeMillis(),
    val reviewCount: Int = 0
)
