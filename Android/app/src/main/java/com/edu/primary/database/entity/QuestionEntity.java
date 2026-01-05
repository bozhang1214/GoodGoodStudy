package com.edu.primary.database.entity;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;
import com.edu.primary.database.converter.ListConverter;

import java.util.List;

@Entity(tableName = "questions")
@TypeConverters(ListConverter.class)
public class QuestionEntity {
    @PrimaryKey(autoGenerate = true)
    public long id;

    public int subjectId;
    public int grade;
    public String type; // single_choice, multiple_choice, fill_blank, judgment
    public String content;
    public List<String> options;
    public String correctAnswer;
    public String explanation;
    public int difficulty; // 1-5

    public QuestionEntity() {
    }
}

