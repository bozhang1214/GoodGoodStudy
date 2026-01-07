package com.edu.primary.ui.practice;

import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.entity.QuestionEntity;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * AnswerChecker工具类单元测试
 */
public class AnswerCheckerTest {

    @Test
    public void testCheckAnswer_SingleChoice_Correct() {
        QuestionEntity question = new QuestionEntity();
        question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
        question.correctAnswer = "A";
        
        assertTrue("单选题答案正确应返回true", 
            AnswerChecker.checkAnswer(question, "A", null));
    }

    @Test
    public void testCheckAnswer_SingleChoice_Wrong() {
        QuestionEntity question = new QuestionEntity();
        question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
        question.correctAnswer = "A";
        
        assertFalse("单选题答案错误应返回false", 
            AnswerChecker.checkAnswer(question, "B", null));
    }

    @Test
    public void testCheckAnswer_FillBlank_Correct() {
        QuestionEntity question = new QuestionEntity();
        question.type = AppConstants.QUESTION_TYPE_FILL_BLANK;
        question.correctAnswer = "10";
        
        assertTrue("填空题答案正确应返回true", 
            AnswerChecker.checkAnswer(question, "10", null));
    }

    @Test
    public void testCheckAnswer_Judgment_Correct() {
        QuestionEntity question = new QuestionEntity();
        question.type = AppConstants.QUESTION_TYPE_JUDGMENT;
        question.correctAnswer = "正确";
        
        assertTrue("判断题答案正确应返回true", 
            AnswerChecker.checkAnswer(question, "正确", "正确"));
    }

    @Test
    public void testCheckAnswer_Judgment_Wrong() {
        QuestionEntity question = new QuestionEntity();
        question.type = AppConstants.QUESTION_TYPE_JUDGMENT;
        question.correctAnswer = "正确";
        
        assertFalse("判断题答案错误应返回false", 
            AnswerChecker.checkAnswer(question, "错误", "正确"));
    }

    @Test
    public void testCheckAnswer_NullQuestion() {
        assertFalse("题目为null应返回false", 
            AnswerChecker.checkAnswer(null, "A", null));
    }

    @Test
    public void testCheckAnswer_NullAnswer() {
        QuestionEntity question = new QuestionEntity();
        question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
        question.correctAnswer = "A";
        
        assertFalse("答案为null应返回false", 
            AnswerChecker.checkAnswer(question, null, null));
    }

    @Test
    public void testCheckAnswer_EmptyAnswer() {
        QuestionEntity question = new QuestionEntity();
        question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
        question.correctAnswer = "A";
        
        assertFalse("答案为空字符串应返回false", 
            AnswerChecker.checkAnswer(question, "", null));
    }

    @Test
    public void testCheckAnswer_NullCorrectAnswer() {
        QuestionEntity question = new QuestionEntity();
        question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
        question.correctAnswer = null;
        
        assertFalse("正确答案为null应返回false", 
            AnswerChecker.checkAnswer(question, "A", null));
    }
}
