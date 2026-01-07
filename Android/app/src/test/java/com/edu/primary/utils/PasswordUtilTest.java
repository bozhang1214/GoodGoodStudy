package com.edu.primary.utils;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * PasswordUtil工具类单元测试
 */
public class PasswordUtilTest {

    @Test
    public void testEncrypt_ValidPassword() {
        String password = "test123";
        String encrypted = PasswordUtil.encrypt(password);
        
        assertNotNull("加密结果不应为null", encrypted);
        assertFalse("加密结果不应为空", encrypted.isEmpty());
        assertNotEquals("加密结果应与原密码不同", password, encrypted);
    }

    @Test
    public void testEncrypt_NullPassword() {
        String encrypted = PasswordUtil.encrypt(null);
        assertEquals("null密码应返回空字符串", "", encrypted);
    }

    @Test
    public void testEncrypt_EmptyPassword() {
        String encrypted = PasswordUtil.encrypt("");
        assertEquals("空密码应返回空字符串", "", encrypted);
    }

    @Test
    public void testVerify_CorrectPassword() {
        String password = "test123";
        String encrypted = PasswordUtil.encrypt(password);
        
        assertTrue("验证正确密码应返回true", PasswordUtil.verify(password, encrypted));
    }

    @Test
    public void testVerify_WrongPassword() {
        String password = "test123";
        String encrypted = PasswordUtil.encrypt(password);
        String wrongPassword = "wrong123";
        
        assertFalse("验证错误密码应返回false", PasswordUtil.verify(wrongPassword, encrypted));
    }

    @Test
    public void testVerify_NullInput() {
        String encrypted = PasswordUtil.encrypt("test123");
        
        assertFalse("null输入应返回false", PasswordUtil.verify(null, encrypted));
    }

    @Test
    public void testVerify_NullStored() {
        assertFalse("null存储密码应返回false", PasswordUtil.verify("test123", null));
    }

    @Test
    public void testEncrypt_Consistency() {
        String password = "test123";
        String encrypted1 = PasswordUtil.encrypt(password);
        String encrypted2 = PasswordUtil.encrypt(password);
        
        // MD5加密结果应该一致
        assertEquals("相同密码加密结果应一致", encrypted1, encrypted2);
    }
}
