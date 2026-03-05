package com.edu.primary.util

import java.security.MessageDigest

/**
 * 密码 MD5 加密与校验，用于注册/登录时存储与比对。
 */
object PasswordUtil {
    /** 对密码做 MD5 摘要，异常时返回原字符串。 */
    fun encrypt(password: String?): String {
        if (password.isNullOrEmpty()) return ""
        return try {
            MessageDigest.getInstance("MD5").digest(password.toByteArray())
                .joinToString("") { "%02x".format(it) }
        } catch (_: Exception) {
            password
        }
    }
    /** 校验输入密码与存储的密文是否一致（对 input 加密后与 stored 比较）。 */
    fun verify(input: String?, stored: String?): Boolean =
        !input.isNullOrEmpty() && !stored.isNullOrEmpty() && encrypt(input) == stored
}
