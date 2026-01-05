package com.edu.primary.repository;

import android.content.Context;
import com.edu.primary.database.AppDatabase;
import com.edu.primary.database.entity.QuestionEntity;
import io.reactivex.Single;
import io.reactivex.schedulers.Schedulers;

import java.util.List;

public class QuestionRepository {
    private AppDatabase database;

    public QuestionRepository(Context context) {
        database = AppDatabase.getInstance(context);
    }

    public Single<List<QuestionEntity>> getQuestions(int subjectId, int grade) {
        return Single.fromCallable(() ->
            database.questionDao().getQuestionsBySubjectAndGrade(subjectId, grade)
        ).subscribeOn(Schedulers.io());
    }

    public Single<QuestionEntity> getQuestionById(long questionId) {
        return Single.fromCallable(() ->
            database.questionDao().getQuestionById(questionId)
        ).subscribeOn(Schedulers.io());
    }

    public Single<Integer> getQuestionCount(int subjectId, int grade) {
        return Single.fromCallable(() ->
            database.questionDao().getQuestionCount(subjectId, grade)
        ).subscribeOn(Schedulers.io());
    }

    public void insertQuestions(List<QuestionEntity> questions) {
        new Thread(() -> {
            database.questionDao().insertQuestions(questions);
        }).start();
    }
}

