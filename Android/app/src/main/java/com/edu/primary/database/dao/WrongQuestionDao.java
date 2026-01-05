package com.edu.primary.database.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;
import com.edu.primary.database.entity.WrongQuestionEntity;

import java.util.List;

@Dao
public interface WrongQuestionDao {
    @Insert
    long insertWrongQuestion(WrongQuestionEntity wrongQuestion);

    @Update
    void updateWrongQuestion(WrongQuestionEntity wrongQuestion);

    @Delete
    void deleteWrongQuestion(WrongQuestionEntity wrongQuestion);

    @Query("SELECT * FROM wrong_questions WHERE userId = :userId ORDER BY wrongTime DESC")
    List<WrongQuestionEntity> getWrongQuestionsByUser(long userId);

    @Query("SELECT * FROM wrong_questions WHERE userId = :userId AND questionId = :questionId")
    WrongQuestionEntity getWrongQuestion(long userId, long questionId);
}

