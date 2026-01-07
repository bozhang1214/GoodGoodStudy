package com.edu.primary.utils;

/**
 * 输入验证工具类（防御性编程）
 * 提供统一的输入验证方法
 */
public class InputValidator {
    
    private InputValidator() {
        // 工具类，禁止实例化
    }
    
    /**
     * 验证用户名
     * @param username 用户名
     * @return 是否有效
     */
    public static boolean isValidUsername(String username) {
        if (username == null || username.isEmpty()) {
            return false;
        }
        // 用户名长度3-20个字符，只能包含字母、数字、下划线
        return username.length() >= 3 && username.length() <= 20 
            && username.matches("^[a-zA-Z0-9_]+$");
    }
    
    /**
     * 验证密码
     * @param password 密码
     * @return 是否有效
     */
    public static boolean isValidPassword(String password) {
        if (password == null || password.isEmpty()) {
            return false;
        }
        // 密码长度至少6个字符
        return password.length() >= 6;
    }
    
    /**
     * 验证答案
     * @param answer 答案
     * @return 是否有效
     */
    public static boolean isValidAnswer(String answer) {
        return answer != null && !answer.trim().isEmpty();
    }
    
    /**
     * 验证年级
     * @param grade 年级
     * @return 是否有效
     */
    public static boolean isValidGrade(int grade) {
        return grade >= 1 && grade <= 6;
    }
    
    /**
     * 验证科目ID
     * @param subjectId 科目ID
     * @return 是否有效
     */
    public static boolean isValidSubjectId(int subjectId) {
        return subjectId >= 1 && subjectId <= 3;
    }
}
