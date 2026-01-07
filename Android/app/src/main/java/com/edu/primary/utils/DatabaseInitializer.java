package com.edu.primary.utils;

import android.content.Context;
import com.edu.primary.BuildConfig;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.AppDatabase;
import com.edu.primary.database.entity.QuestionEntity;
import io.reactivex.Completable;
import io.reactivex.schedulers.Schedulers;

import java.util.List;

public class DatabaseInitializer {
    // 根据BuildConfig.DEBUG决定题目数量：debug包5道，release包40道
    private static final int QUESTIONS_PER_GRADE = BuildConfig.DEBUG ? AppConstants.DEBUG_QUESTIONS_PER_PRACTICE : AppConstants.RELEASE_QUESTIONS_PER_PRACTICE;

    /**
     * 初始化数学题目数据
     * 如果数据库中没有数学题目，则生成随机题目
     * 使用RxJava替代new Thread，提高代码一致性
     */
    public static Completable initializeMathQuestions(Context context) {
        return Completable.fromAction(() -> {
            // 使用ApplicationContext防止内存泄漏
            AppDatabase database = AppDatabase.getInstance(context.getApplicationContext());
            
            // 检查是否已有数学题目
            int totalCount = 0;
            for (int grade = AppConstants.MIN_GRADE; grade <= AppConstants.MAX_GRADE; grade++) {
                totalCount += database.questionDao().getQuestionCount(
                    AppConstants.SUBJECT_MATH, grade);
            }
            
            // 如果没有题目，则生成
            if (totalCount == 0) {
                List<QuestionEntity> questions = QuestionDataGenerator.generateAllMathQuestions(
                    QUESTIONS_PER_GRADE);
                database.questionDao().insertQuestions(questions);
            }
        }).subscribeOn(Schedulers.io());
    }

    /**
     * 为指定年级生成数学题目
     * 使用RxJava替代new Thread，提高代码一致性
     */
    public static Completable generateMathQuestionsForGrade(Context context, int grade, int count) {
        return Completable.fromAction(() -> {
            // 使用ApplicationContext防止内存泄漏
            AppDatabase database = AppDatabase.getInstance(context.getApplicationContext());
            List<QuestionEntity> questions = QuestionDataGenerator.generateMathQuestions(grade, count);
            database.questionDao().insertQuestions(questions);
        }).subscribeOn(Schedulers.io());
    }
}
