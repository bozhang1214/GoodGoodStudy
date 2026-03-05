package com.edu.primary.util

/**
 * 应用全局常量：SharedPreferences 键名、学科/年级/题型/难度范围、练习题目数量、角色与错误码等。
 */
object AppConstants {
    const val PREFS_USER = "user_prefs"
    const val PREFS_AI = "ai_prefs"
    const val KEY_USER_ID = "user_id"
    const val KEY_USERNAME = "username"
    const val KEY_API_KEY = "deepseek_api_key"
    const val MAX_HISTORY_MESSAGES = 50
    const val SUBJECT_CHINESE = 1
    const val SUBJECT_MATH = 2
    const val SUBJECT_ENGLISH = 3
    const val MIN_GRADE = 1
    const val MAX_GRADE = 6
    const val QUESTION_TYPE_SINGLE_CHOICE = "single_choice"
    const val QUESTION_TYPE_MULTIPLE_CHOICE = "multiple_choice"
    const val QUESTION_TYPE_FILL_BLANK = "fill_blank"
    const val QUESTION_TYPE_JUDGMENT = "judgment"
    const val MIN_DIFFICULTY = 1
    const val MAX_DIFFICULTY = 5
    const val DEBUG_QUESTIONS_PER_PRACTICE = 5
    const val RELEASE_QUESTIONS_PER_PRACTICE = 40
    const val ROLE_USER = "user"
    const val ROLE_ASSISTANT = "assistant"
    const val ROLE_SYSTEM = "system"
    const val ERROR_USERNAME_EXISTS = "username_exists"
    const val ERROR_USER_NOT_FOUND = "user_not_found"
    const val ERROR_PASSWORD_WRONG = "password_wrong"
    const val ERROR_API_KEY_NOT_SET = "api_key_not_set"
}
