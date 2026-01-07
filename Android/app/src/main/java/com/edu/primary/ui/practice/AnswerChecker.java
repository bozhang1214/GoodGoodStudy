package com.edu.primary.ui.practice;

import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.entity.QuestionEntity;

/**
 * 答案检查工具类（单一职责原则）
 * 负责答案验证逻辑
 */
public class AnswerChecker {
    
    private AnswerChecker() {
        // 工具类，禁止实例化
    }
    
    /**
     * 检查答案是否正确
     * @param question 题目实体
     * @param userAnswer 用户答案
     * @param correctAnswerText 正确答案文本（用于判断题）
     * @return 是否正确
     */
    public static boolean checkAnswer(QuestionEntity question, String userAnswer, String correctAnswerText) {
        if (question == null || userAnswer == null || userAnswer.isEmpty()) {
            return false;
        }
        
        if (question.correctAnswer == null) {
            return false;
        }
        
        if (AppConstants.QUESTION_TYPE_JUDGMENT.equals(question.type)) {
            // 判断题需要特殊处理
            if (correctAnswerText == null) {
                return false;
            }
            boolean userChoice = userAnswer.equals(correctAnswerText);
            boolean correctAnswer = question.correctAnswer.equals(correctAnswerText);
            return userChoice == correctAnswer;
        } else {
            return question.correctAnswer.equals(userAnswer);
        }
    }
    
    /**
     * 检查答案是否正确（使用默认正确答案文本）
     * @param question 题目实体
     * @param userAnswer 用户答案
     * @return 是否正确
     */
    public static boolean checkAnswer(QuestionEntity question, String userAnswer) {
        if (question == null || userAnswer == null || userAnswer.isEmpty()) {
            return false;
        }
        
        if (AppConstants.QUESTION_TYPE_JUDGMENT.equals(question.type)) {
            // 判断题需要特殊处理，这里需要传入正确答案文本
            // 由于需要Context，这个方法保留在Activity中
            return false;
        } else {
            return question.correctAnswer != null && question.correctAnswer.equals(userAnswer);
        }
    }
}
