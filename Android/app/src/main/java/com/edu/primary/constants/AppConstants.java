package com.edu.primary.constants;

public class AppConstants {
    // 数据库相关
    public static final String DATABASE_NAME = "primary_education_database";
    
    // SharedPreferences相关
    public static final String PREFS_USER = "user_prefs";
    public static final String PREFS_AI = "ai_prefs";
    public static final String KEY_USER_ID = "user_id";
    public static final String KEY_USERNAME = "username";
    public static final String KEY_API_KEY = "deepseek_api_key";
    
    // AI相关
    public static final int MAX_HISTORY_MESSAGES = 50;
    public static final String DEEPSEEK_BASE_URL = "https://api.deepseek.com/";
    public static final String DEEPSEEK_MODEL = "deepseek-chat";
    public static final double DEEPSEEK_TEMPERATURE = 0.7;
    public static final int DEEPSEEK_MAX_TOKENS = 2000;
    public static final String DEEPSEEK_API_ENDPOINT = "v1/chat/completions";
    public static final String HEADER_AUTHORIZATION = "Authorization";
    public static final String HEADER_CONTENT_TYPE = "Content-Type";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String CONTENT_TYPE_JSON = "application/json";
    
    // 科目ID
    public static final int SUBJECT_CHINESE = 1;
    public static final int SUBJECT_MATH = 2;
    public static final int SUBJECT_ENGLISH = 3;
    
    // 年级范围
    public static final int MIN_GRADE = 1;
    public static final int MAX_GRADE = 6;
    
    // 题目类型
    public static final String QUESTION_TYPE_SINGLE_CHOICE = "single_choice";
    public static final String QUESTION_TYPE_MULTIPLE_CHOICE = "multiple_choice";
    public static final String QUESTION_TYPE_FILL_BLANK = "fill_blank";
    public static final String QUESTION_TYPE_JUDGMENT = "judgment";
    
    // 难度范围
    public static final int MIN_DIFFICULTY = 1;
    public static final int MAX_DIFFICULTY = 5;
    
    // 练习题目数量（根据BuildConfig动态设置）
    public static final int DEBUG_QUESTIONS_PER_PRACTICE = 5;
    public static final int RELEASE_QUESTIONS_PER_PRACTICE = 40;
    
    // 消息角色
    public static final String ROLE_USER = "user";
    public static final String ROLE_ASSISTANT = "assistant";
    public static final String ROLE_SYSTEM = "system";
    
    // 错误消息键
    public static final String ERROR_USERNAME_EXISTS = "username_exists";
    public static final String ERROR_USER_NOT_FOUND = "user_not_found";
    public static final String ERROR_PASSWORD_WRONG = "password_wrong";
    public static final String ERROR_API_KEY_NOT_SET = "api_key_not_set";
    public static final String ERROR_LOAD_FAILED = "load_failed";
    public static final String ERROR_NETWORK = "network_error";
    
    private AppConstants() {
        // Prevent instantiation
    }
}
