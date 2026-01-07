package com.edu.primary.utils;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * InputValidator工具类单元测试
 */
public class InputValidatorTest {

    @Test
    public void testIsValidUsername_Valid() {
        assertTrue("有效用户名应返回true", InputValidator.isValidUsername("test123"));
        assertTrue("有效用户名应返回true", InputValidator.isValidUsername("user_name"));
        assertTrue("有效用户名应返回true", InputValidator.isValidUsername("abc"));
        assertTrue("有效用户名应返回true", InputValidator.isValidUsername("username1234567890"));
    }

    @Test
    public void testIsValidUsername_Invalid() {
        assertFalse("null用户名应返回false", InputValidator.isValidUsername(null));
        assertFalse("空用户名应返回false", InputValidator.isValidUsername(""));
        assertFalse("太短用户名应返回false", InputValidator.isValidUsername("ab"));
        assertFalse("太长用户名应返回false", InputValidator.isValidUsername("username123456789012345"));
        assertFalse("包含特殊字符应返回false", InputValidator.isValidUsername("user-name"));
        assertFalse("包含空格应返回false", InputValidator.isValidUsername("user name"));
    }

    @Test
    public void testIsValidPassword_Valid() {
        assertTrue("有效密码应返回true", InputValidator.isValidPassword("password123"));
        assertTrue("6位密码应返回true", InputValidator.isValidPassword("123456"));
    }

    @Test
    public void testIsValidPassword_Invalid() {
        assertFalse("null密码应返回false", InputValidator.isValidPassword(null));
        assertFalse("空密码应返回false", InputValidator.isValidPassword(""));
        assertFalse("太短密码应返回false", InputValidator.isValidPassword("12345"));
    }

    @Test
    public void testIsValidAnswer_Valid() {
        assertTrue("有效答案应返回true", InputValidator.isValidAnswer("答案"));
        assertTrue("有效答案应返回true", InputValidator.isValidAnswer("A"));
    }

    @Test
    public void testIsValidAnswer_Invalid() {
        assertFalse("null答案应返回false", InputValidator.isValidAnswer(null));
        assertFalse("空答案应返回false", InputValidator.isValidAnswer(""));
        assertFalse("空白答案应返回false", InputValidator.isValidAnswer("   "));
    }

    @Test
    public void testIsValidGrade_Valid() {
        for (int i = 1; i <= 6; i++) {
            assertTrue("有效年级应返回true: " + i, InputValidator.isValidGrade(i));
        }
    }

    @Test
    public void testIsValidGrade_Invalid() {
        assertFalse("0年级应返回false", InputValidator.isValidGrade(0));
        assertFalse("7年级应返回false", InputValidator.isValidGrade(7));
        assertFalse("负数年级应返回false", InputValidator.isValidGrade(-1));
    }

    @Test
    public void testIsValidSubjectId_Valid() {
        assertTrue("科目1应返回true", InputValidator.isValidSubjectId(1));
        assertTrue("科目2应返回true", InputValidator.isValidSubjectId(2));
        assertTrue("科目3应返回true", InputValidator.isValidSubjectId(3));
    }

    @Test
    public void testIsValidSubjectId_Invalid() {
        assertFalse("科目0应返回false", InputValidator.isValidSubjectId(0));
        assertFalse("科目4应返回false", InputValidator.isValidSubjectId(4));
        assertFalse("负数科目应返回false", InputValidator.isValidSubjectId(-1));
    }
}
