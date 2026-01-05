package com.edu.primary.database.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import com.edu.primary.database.entity.AnswerEntity;

import java.util.List;

@Dao
public interface AnswerDao {
    @Insert
    long insertAnswer(AnswerEntity answer);

    @Query("SELECT * FROM answers WHERE userId = :userId")
    List<AnswerEntity> getAnswersByUser(long userId);

    @Query("SELECT * FROM answers WHERE userId = :userId AND questionId = :questionId")
    AnswerEntity getAnswer(long userId, long questionId);

    @Query("SELECT COUNT(*) FROM answers WHERE userId = :userId AND isCorrect = 1")
    int getCorrectCount(long userId);

    @Query("SELECT COUNT(*) FROM answers WHERE userId = :userId")
    int getTotalCount(long userId);
}

