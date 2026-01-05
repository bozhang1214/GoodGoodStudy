package com.edu.primary.database.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import com.edu.primary.database.entity.QuestionEntity;

import java.util.List;

@Dao
public interface QuestionDao {
    @Insert
    void insertQuestions(List<QuestionEntity> questions);

    @Insert
    long insertQuestion(QuestionEntity question);

    @Query("SELECT * FROM questions WHERE subjectId = :subjectId AND grade = :grade")
    List<QuestionEntity> getQuestionsBySubjectAndGrade(int subjectId, int grade);

    @Query("SELECT * FROM questions WHERE id = :id LIMIT 1")
    QuestionEntity getQuestionById(long id);

    @Query("SELECT COUNT(*) FROM questions WHERE subjectId = :subjectId AND grade = :grade")
    int getQuestionCount(int subjectId, int grade);
}

