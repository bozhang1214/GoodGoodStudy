/**
 * 应用常量定义
 */
export class AppConstants {
    // 数据库相关
    static readonly DATABASE_NAME = 'primary_education_database';
    // Preferences相关
    static readonly PREFS_USER = 'user_prefs';
    static readonly PREFS_AI = 'ai_prefs';
    static readonly KEY_USER_ID = 'user_id';
    static readonly KEY_USERNAME = 'username';
    static readonly KEY_API_KEY = 'deepseek_api_key';
    // AI相关
    static readonly MAX_HISTORY_MESSAGES = 50;
    static readonly DEEPSEEK_BASE_URL = 'https://api.deepseek.com/';
    static readonly DEEPSEEK_MODEL = 'deepseek-chat';
    static readonly DEEPSEEK_TEMPERATURE = 0.7;
    static readonly DEEPSEEK_MAX_TOKENS = 2000;
    static readonly DEEPSEEK_API_ENDPOINT = 'v1/chat/completions';
    static readonly HEADER_AUTHORIZATION = 'Authorization';
    static readonly HEADER_CONTENT_TYPE = 'Content-Type';
    static readonly BEARER_PREFIX = 'Bearer ';
    static readonly CONTENT_TYPE_JSON = 'application/json';
    // 科目ID
    static readonly SUBJECT_CHINESE = 1;
    static readonly SUBJECT_MATH = 2;
    static readonly SUBJECT_ENGLISH = 3;
    // 年级范围
    static readonly MIN_GRADE = 1;
    static readonly MAX_GRADE = 6;
    // 题目类型
    static readonly QUESTION_TYPE_SINGLE_CHOICE = 'single_choice';
    static readonly QUESTION_TYPE_MULTIPLE_CHOICE = 'multiple_choice';
    static readonly QUESTION_TYPE_FILL_BLANK = 'fill_blank';
    static readonly QUESTION_TYPE_JUDGMENT = 'judgment';
    // 难度范围
    static readonly MIN_DIFFICULTY = 1;
    static readonly MAX_DIFFICULTY = 5;
    // 消息角色
    static readonly ROLE_USER = 'user';
    static readonly ROLE_ASSISTANT = 'assistant';
    static readonly ROLE_SYSTEM = 'system';
    // 练习题目数量
    static readonly DEBUG_QUESTIONS_PER_PRACTICE = 5;
    static readonly RELEASE_QUESTIONS_PER_PRACTICE = 40;
    // 错误消息键
    static readonly ERROR_USERNAME_EXISTS = 'username_exists';
    static readonly ERROR_USER_NOT_FOUND = 'user_not_found';
    static readonly ERROR_PASSWORD_WRONG = 'password_wrong';
    static readonly ERROR_API_KEY_NOT_SET = 'api_key_not_set';
    static readonly ERROR_LOAD_FAILED = 'load_failed';
    static readonly ERROR_NETWORK = 'network_error';
}
