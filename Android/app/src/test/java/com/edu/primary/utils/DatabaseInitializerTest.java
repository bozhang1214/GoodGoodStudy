package com.edu.primary.utils;

import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.entity.QuestionEntity;
import org.junit.Test;
import java.util.List;

import static org.junit.Assert.*;

/**
 * 数据库初始化工具测试
 */
public class DatabaseInitializerTest {

    @Test
    public void testQuestionDataGeneratorIntegration() {
        // 测试题目生成器与初始化器的集成
        // 验证可以为所有年级生成题目
        for (int grade = AppConstants.MIN_GRADE; grade <= AppConstants.MAX_GRADE; grade++) {
            int count = 10;
            List<QuestionEntity> questions = QuestionDataGenerator.generateMathQuestions(grade, count);
            assertNotNull("题目列表不应为null", questions);
            assertEquals("应生成指定数量的题目", count, questions.size());
        }
    }

    @Test
    public void testGenerateAllMathQuestions() {
        // 测试为所有年级生成题目
        List<QuestionEntity> allQuestions = QuestionDataGenerator.generateAllMathQuestions(5);
        assertNotNull("题目列表不应为null", allQuestions);
        assertEquals("应为6个年级各生成5道题", 30, allQuestions.size());
    }
}
