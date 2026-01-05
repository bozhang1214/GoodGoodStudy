package com.edu.primary.repository;

import android.content.Context;
import android.content.SharedPreferences;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.AppDatabase;
import com.edu.primary.database.entity.UserEntity;
import io.reactivex.Single;
import io.reactivex.schedulers.Schedulers;

public class UserRepository {

    private AppDatabase database;
    private SharedPreferences prefs;

    public UserRepository(Context context) {
        database = AppDatabase.getInstance(context);
        prefs = context.getSharedPreferences(AppConstants.PREFS_USER, Context.MODE_PRIVATE);
    }

    public Single<Long> register(String username, String password, String nickname) {
        return Single.fromCallable(() -> {
            UserEntity existingUser = database.userDao().getUserByUsername(username);
            if (existingUser != null) {
                throw new Exception(AppConstants.ERROR_USERNAME_EXISTS);
            }
            UserEntity user = new UserEntity(username, password, nickname);
            return database.userDao().insertUser(user);
        }).subscribeOn(Schedulers.io());
    }

    public Single<UserEntity> login(String username, String password) {
        return Single.fromCallable(() -> {
            UserEntity user = database.userDao().getUserByUsername(username);
            if (user == null) {
                throw new Exception(AppConstants.ERROR_USER_NOT_FOUND);
            }
            if (!user.password.equals(password)) {
                throw new Exception(AppConstants.ERROR_PASSWORD_WRONG);
            }
            saveCurrentUser(user.id, user.username);
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
