package com.edu.primary.data.repository

import android.content.Context
import com.edu.primary.data.local.AppDatabase
import com.edu.primary.data.local.entity.UserEntity
import com.edu.primary.util.AppConstants
import com.edu.primary.util.InputValidator
import com.edu.primary.util.Logger
import com.edu.primary.util.PasswordUtil
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext

/**
 * 用户相关数据仓库：登录、注册、当前用户状态。
 *
 * 使用 Room [AppDatabase.userDao] 持久化用户，使用 SharedPreferences 保存当前登录用户 ID 与用户名。
 * 密码经 [PasswordUtil.encrypt] 存储；登录时支持明文兼容并自动升级为加密存储。
 *
 * @param context 用于获取 ApplicationContext 与 SharedPreferences，建议传入 Application
 */
class UserRepository(context: Context) {
    private val appContext = context.applicationContext
    private val db = AppDatabase.getInstance(appContext)
    private val prefs = appContext.getSharedPreferences(AppConstants.PREFS_USER, Context.MODE_PRIVATE)

    private val _currentUserId = MutableStateFlow(prefs.getLong(AppConstants.KEY_USER_ID, -1L))
    /** 当前登录用户 ID 的响应式流，未登录时为 -1L。 */
    val currentUserId: StateFlow<Long> = _currentUserId.asStateFlow()

    /** 是否已登录（即 SharedPreferences 中存有有效 user_id）。 */
    fun isLoggedIn(): Boolean = prefs.getLong(AppConstants.KEY_USER_ID, -1L) != -1L
    /** 当前用户 ID，未登录返回 -1L。 */
    fun getCurrentUserId(): Long = prefs.getLong(AppConstants.KEY_USER_ID, -1L)
    /** 当前用户名，未登录返回空字符串。 */
    fun getCurrentUsername(): String = prefs.getString(AppConstants.KEY_USERNAME, "").orEmpty()

    /** 清除登录状态（清空 SharedPreferences 并更新 [currentUserId]）。 */
    fun logout() {
        prefs.edit().clear().apply()
        _currentUserId.value = -1L
    }

    private fun saveCurrentUser(userId: Long, username: String) {
        prefs.edit()
            .putLong(AppConstants.KEY_USER_ID, userId)
            .putString(AppConstants.KEY_USERNAME, username)
            .apply()
        _currentUserId.value = userId
    }

    /**
     * 注册新用户。密码会经 MD5 加密后存入数据库。
     * @param username 用户名，须符合 [InputValidator.isValidUsername]
     * @param password 密码，须符合 [InputValidator.isValidPassword]
     * @param nickname 昵称，可与 username 相同
     * @return [Result.success] 为新用户 ID，[Result.failure] 为校验失败或用户名已存在等异常
     */
    suspend fun register(username: String, password: String, nickname: String): Result<Long> = withContext(Dispatchers.IO) {
        if (!InputValidator.isValidUsername(username))
            return@withContext Result.failure(IllegalArgumentException("用户名格式不正确（3-20个字符，字母数字下划线）"))
        if (!InputValidator.isValidPassword(password))
            return@withContext Result.failure(IllegalArgumentException("密码至少6位"))
        val existing = db.userDao().getByUsername(username)
        if (existing != null)
            return@withContext Result.failure(Exception(AppConstants.ERROR_USERNAME_EXISTS))
        val encrypted = PasswordUtil.encrypt(password)
        val user = UserEntity(username = username, password = encrypted, nickname = nickname)
        val id = db.userDao().insert(user)
        Logger.d("UserRepository", "Registered: $username")
        Result.success(id)
    }

    /**
     * 用户登录。校验用户名与密码，成功后写入当前用户到 SharedPreferences 并更新 [currentUserId]。
     * @param username 用户名
     * @param password 密码（支持与库中明文兼容，登录后会自动更新为加密存储）
     * @return [Result.success] 为 [UserEntity]，[Result.failure] 为用户不存在、密码错误或格式错误
     */
    suspend fun login(username: String, password: String): Result<UserEntity> = withContext(Dispatchers.IO) {
        if (!InputValidator.isValidUsername(username))
            return@withContext Result.failure(IllegalArgumentException("用户名格式不正确"))
        if (!InputValidator.isValidPassword(password))
            return@withContext Result.failure(IllegalArgumentException("密码格式不正确"))
        val user = db.userDao().getByUsername(username)
            ?: return@withContext Result.failure(Exception(AppConstants.ERROR_USER_NOT_FOUND))
        val match = PasswordUtil.verify(password, user.password) || user.password == password
        if (!match)
            return@withContext Result.failure(Exception(AppConstants.ERROR_PASSWORD_WRONG))
        if (user.password == password) {
            val updated = user.copy(password = PasswordUtil.encrypt(password))
            db.userDao().update(updated)
        }
        saveCurrentUser(user.id, user.username)
        Logger.d("UserRepository", "Logged in: $username")
        Result.success(user)
    }

    /** 根据 [getCurrentUserId] 从数据库查询当前用户实体，未登录返回 null。 */
    suspend fun getCurrentUser(): UserEntity? = withContext(Dispatchers.IO) {
        val id = getCurrentUserId()
        if (id == -1L) null else db.userDao().getById(id)
    }
}
