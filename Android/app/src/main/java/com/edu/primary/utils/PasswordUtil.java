package com.edu.primary.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 密码加密工具类（安全性优化）
 * 使用MD5哈希算法加密密码（生产环境建议使用更安全的算法如BCrypt）
 */
public class PasswordUtil {
    
    private PasswordUtil() {
        // 工具类，禁止实例化
    }
    
    /**
     * 加密密码
     * @param password 明文密码
     * @return 加密后的密码
     */
    public static String encrypt(String password) {
        if (password == null || password.isEmpty()) {
            return "";
        }
        
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            // 如果MD5不可用，返回原密码（不推荐，但保证功能可用）
            return password;
        }
    }
    
    /**
     * 验证密码
     * @param inputPassword 输入的密码
     * @param storedPassword 存储的加密密码
     * @return 是否匹配
     */
    public static boolean verify(String inputPassword, String storedPassword) {
        if (inputPassword == null || storedPassword == null) {
            return false;
        }
        String encryptedInput = encrypt(inputPassword);
        return encryptedInput.equals(storedPassword);
    }
}
