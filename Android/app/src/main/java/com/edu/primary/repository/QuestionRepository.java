package com.edu.primary.repository;

import android.content.Context;
import com.edu.primary.database.AppDatabase;
import com.edu.primary.database.entity.AnswerEntity;
import com.edu.primary.database.entity.QuestionEntity;
import com.edu.primary.database.entity.WrongQuestionEntity;
import io.reactivex.Completable;
import io.reactivex.Single;
import io.reactivex.schedulers.Schedulers;

import java.util.List;

public class QuestionRepository {
    private final AppDatabase database;

    /**
     * 构造函数
     * 使用ApplicationContext防止内存泄漏
     */
    public QuestionRepository(Context context) {
        // 使用ApplicationContext防止内存泄漏
        database = AppDatabase.getInstance(context.getApplicationContext());
    }

    public Single<List<QuestionEntity>> getQuestions(int subjectId, int grade) {
        return Single.fromCallable(() ->
            database.questionDao().getQuestionsBySubjectAndGrade(subjectId, grade)
        ).subscribeOn(Schedulers.io());
    }

    /**
     * 根据ID列表获取题目
     */
    public Single<List<QuestionEntity>> getQuestionsByIds(List<Long> questionIds) {
        return Single.fromCallable(() ->
            database.questionDao().getQuestionsByIds(questionIds)
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

    public Completable insertQuestions(List<QuestionEntity> questions) {
        return Completable.fromAction(() ->
            database.questionDao().insertQuestions(questions)
        ).subscribeOn(Schedulers.io());
    }

    public Completable insertAnswer(AnswerEntity answer) {
        return Completable.fromAction(() ->
            database.answerDao().insertAnswer(answer)
        ).subscribeOn(Schedulers.io());
    }

    public Completable addWrongQuestion(long userId, long questionId, String userAnswer) {
        return Completable.fromAction(() -> {
            // 检查是否已经存在
            WrongQuestionEntity existing = database.wrongQuestionDao().getWrongQuestion(userId, questionId);
            if (existing == null) {
                WrongQuestionEntity wrongQuestion = new WrongQuestionEntity();
                wrongQuestion.userId = userId;
                wrongQuestion.questionId = questionId;
                wrongQuestion.userAnswer = userAnswer;
                wrongQuestion.wrongTime = System.currentTimeMillis();
                wrongQuestion.reviewCount = 0;
                database.wrongQuestionDao().insertWrongQuestion(wrongQuestion);
            } else {
                // 如果已存在，更新用户答案和时间
                existing.userAnswer = userAnswer;
                existing.wrongTime = System.currentTimeMillis();
                database.wrongQuestionDao().updateWrongQuestion(existing);
            }
        }).subscribeOn(Schedulers.io());
    }

    /**
     * 从错题本中移除题目（答对了）
     */
    public Completable removeWrongQuestion(long userId, long questionId) {
        return Completable.fromAction(() -> {
            WrongQuestionEntity existing = database.wrongQuestionDao().getWrongQuestion(userId, questionId);
            if (existing != null) {
                database.wrongQuestionDao().deleteWrongQuestion(existing);
            }
        }).subscribeOn(Schedulers.io());
    }

    /**
     * 增加错题复习次数
     */
    public Completable incrementReviewCount(long userId, long questionId) {
        return Completable.fromAction(() -> {
            WrongQuestionEntity existing = database.wrongQuestionDao().getWrongQuestion(userId, questionId);
            if (existing != null) {
                existing.reviewCount++;
                database.wrongQuestionDao().updateWrongQuestion(existing);
            }
        }).subscribeOn(Schedulers.io());
    }

    public Single<AnswerEntity> getAnswer(long userId, long questionId) {
        return Single.fromCallable(() ->
            database.answerDao().getAnswer(userId, questionId)
        ).subscribeOn(Schedulers.io());
    }

    /**
     * 获取用户的错题列表
     */
    public Single<List<WrongQuestionEntity>> getWrongQuestions(long userId) {
        return Single.fromCallable(() ->
            database.wrongQuestionDao().getWrongQuestionsByUser(userId)
        ).subscribeOn(Schedulers.io());
    }

    /**
     * 获取用户答题统计
     */
    public Single<ProgressData> getProgressData(long userId) {
        return Single.fromCallable(() -> {
            int total = database.answerDao().getTotalCount(userId);
            int correct = database.answerDao().getCorrectCount(userId);
            double accuracy = total > 0 ? (correct * 100.0 / total) : 0.0;
            return new ProgressData(total, correct, accuracy);
        }).subscribeOn(Schedulers.io());
    }

    /**
     * 进度数据类
     */
    public static class ProgressData {
        public final int total;
        public final int correct;
        public final double accuracy;

        public ProgressData(int total, int correct, double accuracy) {
            this.total = total;
            this.correct = correct;
            this.accuracy = accuracy;
        }
    }
}

