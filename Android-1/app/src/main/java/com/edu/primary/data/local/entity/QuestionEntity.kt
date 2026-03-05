package com.edu.primary.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters
import com.edu.primary.data.local.converter.StringListConverter

@Entity(tableName = "questions")
@TypeConverters(StringListConverter::class)
data class QuestionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val subjectId: Int,
    val grade: Int,
    val type: String,
    val content: String,
    val options: List<String>? = null,
    val correctAnswer: String,
    val explanation: String? = null,
    val difficulty: Int = 1
)
