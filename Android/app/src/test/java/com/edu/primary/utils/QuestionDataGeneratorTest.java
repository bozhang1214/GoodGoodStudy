package com.edu.primary.utils;

import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.entity.QuestionEntity;
import org.junit.Test;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * 题目生成器单元测试
 */
public class QuestionDataGeneratorTest {

    @Test
    public void testGenerateMathQuestions_ValidGrade() {
        // 测试生成1-6年级的题目
        for (int grade = 1; grade <= 6; grade++) {
            List<QuestionEntity> questions = QuestionDataGenerator.generateMathQuestions(grade, 10);
            assertNotNull("题目列表不应为null", questions);
            assertEquals("应该生成10道题目", 10, questions.size());
            
            for (QuestionEntity question : questions) {
                assertNotNull("题目不应为null", question);
                assertEquals("科目ID应为数学", AppConstants.SUBJECT_MATH, question.subjectId);
                assertEquals("年级应匹配", grade, question.grade);
                assertNotNull("题目内容不应为null", question.content);
                assertNotNull("正确答案不应为null", question.correctAnswer);
                assertTrue("难度应在1-5之间", 
                    question.difficulty >= 1 && question.difficulty <= 5);
            }
        }
    }

    @Test
    public void testGenerateMathQuestions_QuestionTypes() {
        List<QuestionEntity> questions = QuestionDataGenerator.generateMathQuestions(3, 30);
        
        boolean hasSingleChoice = false;
        boolean hasFillBlank = false;
        boolean hasJudgment = false;
        
        for (QuestionEntity question : questions) {
            assertNotNull("题目类型不应为null", question.type);
            if (AppConstants.QUESTION_TYPE_SINGLE_CHOICE.equals(question.type)) {
                hasSingleChoice = true;
                assertNotNull("选择题应有选项", question.options);
                assertTrue("选择题选项应至少2个", question.options.size() >= 2);
            } else if (AppConstants.QUESTION_TYPE_FILL_BLANK.equals(question.type)) {
                hasFillBlank = true;
            } else if (AppConstants.QUESTION_TYPE_JUDGMENT.equals(question.type)) {
                hasJudgment = true;
            }
        }
        
        // 生成30道题应该包含所有类型
        assertTrue("应包含选择题", hasSingleChoice);
        assertTrue("应包含填空题", hasFillBlank);
        assertTrue("应包含判断题", hasJudgment);
    }

    @Test
    public void testGenerateMathQuestions_AnswerValidation() {
        List<QuestionEntity> questions = QuestionDataGenerator.generateMathQuestions(4, 20);
        
        for (QuestionEntity question : questions) {
            // 验证答案格式
            assertNotNull("正确答案不应为空", question.correctAnswer);
            assertFalse("正确答案不应为空字符串", question.correctAnswer.trim().isEmpty());
            
            // 验证题目内容包含运算符
            assertTrue("题目内容应包含运算符", 
                question.content.contains("+") || 
                question.content.contains("-") || 
                question.content.contains("×") || 
                question.content.contains("÷"));
        }
    }

    @Test
    public void testGenerateAllMathQuestions() {
        List<QuestionEntity> allQuestions = QuestionDataGenerator.generateAllMathQuestions(5);
        
        assertNotNull("题目列表不应为null", allQuestions);
        assertEquals("应为6个年级各生成5道题，共30道", 30, allQuestions.size());
        
        // 验证每个年级都有题目
        for (int grade = 1; grade <= 6; grade++) {
            int count = 0;
            for (QuestionEntity q : allQuestions) {
                if (q.grade == grade) {
                    count++;
                }
            }
            assertEquals("每个年级应有5道题", 5, count);
        }
    }

    @Test
    public void testGenerateMathQuestions_DifferentGrades() {
        // 测试不同年级的题目难度
        for (int grade = 1; grade <= 6; grade++) {
            List<QuestionEntity> questions = QuestionDataGenerator.generateMathQuestions(grade, 1);
            QuestionEntity question = questions.get(0);
            
            // 验证难度设置
            int expectedDifficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
            assertEquals("难度应匹配年级", expectedDifficulty, question.difficulty);
        }
    }

    @Test
    public void testGenerateMathQuestions_ZeroCount() {
        List<QuestionEntity> questions = QuestionDataGenerator.generateMathQuestions(3, 0);
        assertNotNull("题目列表不应为null", questions);
        assertEquals("生成0道题应返回空列表", 0, questions.size());
    }

    @Test
    public void testGenerateMathQuestions_FiveQuestionsWithAllTypes() {
        // 测试生成5道题时，确保覆盖所有题型（2道单选、2道填空、1道判断）
        List<QuestionEntity> questions = QuestionDataGenerator.generateMathQuestions(3, 5);
        
        assertNotNull("题目列表不应为null", questions);
        assertEquals("应生成5道题目", 5, questions.size());
        
        int singleChoiceCount = 0;
        int fillBlankCount = 0;
        int judgmentCount = 0;
        
        for (QuestionEntity question : questions) {
            assertNotNull("题目类型不应为null", question.type);
            if (AppConstants.QUESTION_TYPE_SINGLE_CHOICE.equals(question.type)) {
                singleChoiceCount++;
            } else if (AppConstants.QUESTION_TYPE_FILL_BLANK.equals(question.type)) {
                fillBlankCount++;
            } else if (AppConstants.QUESTION_TYPE_JUDGMENT.equals(question.type)) {
                judgmentCount++;
            }
        }
        
        // 验证覆盖所有题型
        assertEquals("应有2道单选题", 2, singleChoiceCount);
        assertEquals("应有2道填空题", 2, fillBlankCount);
        assertEquals("应有1道判断题", 1, judgmentCount);
    }
}
