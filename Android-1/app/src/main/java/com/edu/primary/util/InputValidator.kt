package com.edu.primary.util

/**
 * 输入校验：用户名（3–20 位字母数字下划线）、密码（至少 6 位）、年级（1–6）、学科 ID（1–3）。
 */
object InputValidator {
    /** 用户名非空、长度 3–20、仅字母数字下划线。 */
    fun isValidUsername(username: String?) = !username.isNullOrEmpty() &&
        username.length in 3..20 && username.matches(Regex("^[a-zA-Z0-9_]+$"))
    /** 密码非空且至少 6 位。 */
    fun isValidPassword(password: String?) = !password.isNullOrEmpty() && password.length >= 6
    /** 年级在 1–6 之间。 */
    fun isValidGrade(grade: Int) = grade in 1..6
    /** 学科 ID 在 1–3 之间（语数英）。 */
    fun isValidSubjectId(subjectId: Int) = subjectId in 1..3
}
