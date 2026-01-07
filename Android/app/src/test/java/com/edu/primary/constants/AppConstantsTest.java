package com.edu.primary.constants;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * 应用常量测试
 */
public class AppConstantsTest {

    @Test
    public void testDatabaseName() {
        assertNotNull("数据库名称不应为null", AppConstants.DATABASE_NAME);
        assertFalse("数据库名称不应为空", AppConstants.DATABASE_NAME.isEmpty());
    }

    @Test
    public void testSubjectConstants() {
        assertEquals("语文科目ID应为1", 1, AppConstants.SUBJECT_CHINESE);
        assertEquals("数学科目ID应为2", 2, AppConstants.SUBJECT_MATH);
        assertEquals("英语科目ID应为3", 3, AppConstants.SUBJECT_ENGLISH);
    }

    @Test
    public void testGradeRange() {
        assertTrue("最小年级应为1", AppConstants.MIN_GRADE >= 1);
        assertTrue("最大年级应为6", AppConstants.MAX_GRADE <= 6);
        assertTrue("最小年级应小于等于最大年级", 
            AppConstants.MIN_GRADE <= AppConstants.MAX_GRADE);
    }

    @Test
    public void testQuestionTypes() {
        assertNotNull("选择题类型不应为null", AppConstants.QUESTION_TYPE_SINGLE_CHOICE);
        assertNotNull("多选题类型不应为null", AppConstants.QUESTION_TYPE_MULTIPLE_CHOICE);
        assertNotNull("填空题类型不应为null", AppConstants.QUESTION_TYPE_FILL_BLANK);
        assertNotNull("判断题类型不应为null", AppConstants.QUESTION_TYPE_JUDGMENT);
        
        // 验证类型不重复
        assertNotEquals("选择题和多选题应不同", 
            AppConstants.QUESTION_TYPE_SINGLE_CHOICE, 
            AppConstants.QUESTION_TYPE_MULTIPLE_CHOICE);
    }

    @Test
    public void testDifficultyRange() {
        assertTrue("最小难度应为1", AppConstants.MIN_DIFFICULTY >= 1);
        assertTrue("最大难度应为5", AppConstants.MAX_DIFFICULTY <= 5);
        assertTrue("最小难度应小于等于最大难度", 
            AppConstants.MIN_DIFFICULTY <= AppConstants.MAX_DIFFICULTY);
    }

    @Test
    public void testAIRoleConstants() {
        assertNotNull("用户角色不应为null", AppConstants.ROLE_USER);
        assertNotNull("助手角色不应为null", AppConstants.ROLE_ASSISTANT);
        assertNotNull("系统角色不应为null", AppConstants.ROLE_SYSTEM);
        
        assertNotEquals("用户和助手角色应不同", 
            AppConstants.ROLE_USER, AppConstants.ROLE_ASSISTANT);
    }

    @Test
    public void testDeepseekConstants() {
        assertNotNull("Deepseek基础URL不应为null", AppConstants.DEEPSEEK_BASE_URL);
        assertNotNull("Deepseek模型不应为null", AppConstants.DEEPSEEK_MODEL);
        assertTrue("温度应在0-1之间", 
            AppConstants.DEEPSEEK_TEMPERATURE >= 0 && 
            AppConstants.DEEPSEEK_TEMPERATURE <= 1);
        assertTrue("最大token数应大于0", AppConstants.DEEPSEEK_MAX_TOKENS > 0);
    }

    @Test
    public void testSharedPreferencesKeys() {
        assertNotNull("用户偏好键不应为null", AppConstants.PREFS_USER);
        assertNotNull("AI偏好键不应为null", AppConstants.PREFS_AI);
        assertNotNull("用户ID键不应为null", AppConstants.KEY_USER_ID);
        assertNotNull("用户名键不应为null", AppConstants.KEY_USERNAME);
        assertNotNull("API密钥键不应为null", AppConstants.KEY_API_KEY);
    }
}
