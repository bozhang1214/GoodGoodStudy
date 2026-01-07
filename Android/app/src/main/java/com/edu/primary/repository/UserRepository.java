package com.edu.primary.repository;

import android.content.Context;
import android.content.SharedPreferences;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.AppDatabase;
import com.edu.primary.database.entity.UserEntity;
import com.edu.primary.utils.InputValidator;
import com.edu.primary.utils.Logger;
import com.edu.primary.utils.PasswordUtil;
import io.reactivex.Single;
import io.reactivex.schedulers.Schedulers;

public class UserRepository {

    private final AppDatabase database;
    private final SharedPreferences prefs;

    /**
     * 构造函数
     * 使用ApplicationContext防止内存泄漏
     */
    public UserRepository(Context context) {
        // 使用ApplicationContext防止内存泄漏
        Context appContext = context.getApplicationContext();
        database = AppDatabase.getInstance(appContext);
        prefs = appContext.getSharedPreferences(AppConstants.PREFS_USER, Context.MODE_PRIVATE);
    }

    /**
     * 注册用户
     * 添加输入验证和密码加密
     */
    public Single<Long> register(String username, String password, String nickname) {
        return Single.fromCallable(() -> {
            // 输入验证
            if (!InputValidator.isValidUsername(username)) {
                Logger.w("UserRepository", "Invalid username: " + username);
                throw new IllegalArgumentException("用户名格式不正确（3-20个字符，只能包含字母、数字、下划线）");
            }
            if (!InputValidator.isValidPassword(password)) {
                Logger.w("UserRepository", "Invalid password length");
                throw new IllegalArgumentException("密码长度至少6个字符");
            }
            
            UserEntity existingUser = database.userDao().getUserByUsername(username);
            if (existingUser != null) {
                Logger.w("UserRepository", "Username already exists: " + username);
                throw new Exception(AppConstants.ERROR_USERNAME_EXISTS);
            }
            
            // 加密密码
            String encryptedPassword = PasswordUtil.encrypt(password);
            UserEntity user = new UserEntity(username, encryptedPassword, nickname);
            long userId = database.userDao().insertUser(user);
            Logger.d("UserRepository", "User registered: " + username);
            return userId;
        }).subscribeOn(Schedulers.io());
    }

    /**
     * 用户登录
     * 添加输入验证和密码验证
     */
    public Single<UserEntity> login(String username, String password) {
        return Single.fromCallable(() -> {
            // 输入验证
            if (!InputValidator.isValidUsername(username)) {
                Logger.w("UserRepository", "Invalid username: " + username);
                throw new IllegalArgumentException("用户名格式不正确");
            }
            if (!InputValidator.isValidPassword(password)) {
                Logger.w("UserRepository", "Invalid password");
                throw new IllegalArgumentException("密码格式不正确");
            }
            
            UserEntity user = database.userDao().getUserByUsername(username);
            if (user == null) {
                Logger.w("UserRepository", "User not found: " + username);
                throw new Exception(AppConstants.ERROR_USER_NOT_FOUND);
            }
            
            // 验证密码（支持加密和明文密码，便于迁移）
            boolean passwordMatch = PasswordUtil.verify(password, user.password) 
                || user.password.equals(password); // 兼容旧数据
            
            if (!passwordMatch) {
                Logger.w("UserRepository", "Password mismatch for user: " + username);
                throw new Exception(AppConstants.ERROR_PASSWORD_WRONG);
            }
            
            // 如果密码是明文的，更新为加密密码
            if (user.password.equals(password)) {
                user.password = PasswordUtil.encrypt(password);
                database.userDao().updateUser(user);
                Logger.d("UserRepository", "Password encrypted for user: " + username);
            }
            
            saveCurrentUser(user.id, user.username);
            Logger.d("UserRepository", "User logged in: " + username);
            return user;
        }).subscribeOn(Schedulers.io());
    }

    public void logout() {
        prefs.edit().clear().apply();
    }

    public boolean isLoggedIn() {
        return prefs.getLong(AppConstants.KEY_USER_ID, -1) != -1;
    }

    public long getCurrentUserId() {
        return prefs.getLong(AppConstants.KEY_USER_ID, -1);
    }

    public String getCurrentUsername() {
        return prefs.getString(AppConstants.KEY_USERNAME, "");
    }

    private void saveCurrentUser(long userId, String username) {
        prefs.edit()
            .putLong(AppConstants.KEY_USER_ID, userId)
            .putString(AppConstants.KEY_USERNAME, username)
            .apply();
    }

    public Single<UserEntity> getCurrentUser() {
        return Single.fromCallable(() -> {
            long userId = getCurrentUserId();
            if (userId == -1) {
                return null;
            }
            return database.userDao().getUserById(userId);
        }).subscribeOn(Schedulers.io());
    }
}
