package com.edu.primary.database;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.dao.*;
import com.edu.primary.database.entity.*;

@Database(
    entities = {
        UserEntity.class,
        QuestionEntity.class,
        AnswerEntity.class,
        WrongQuestionEntity.class,
        ChatMessageEntity.class
    },
    version = 1,
    exportSchema = false
)
public abstract class AppDatabase extends RoomDatabase {
    // 使用volatile保证多线程环境下的可见性（双重检查锁定模式）
    private static volatile AppDatabase instance;

    public abstract UserDao userDao();
    public abstract QuestionDao questionDao();
    public abstract AnswerDao answerDao();
    public abstract WrongQuestionDao wrongQuestionDao();
    public abstract ChatMessageDao chatMessageDao();

    /**
     * 获取数据库实例（线程安全的单例模式）
     * 使用双重检查锁定模式，确保线程安全
     */
    public static AppDatabase getInstance(Context context) {
        if (instance == null) {
            synchronized (AppDatabase.class) {
                if (instance == null) {
                    // 使用ApplicationContext防止内存泄漏
                    instance = Room.databaseBuilder(
                        context.getApplicationContext(),
                        AppDatabase.class,
                        AppConstants.DATABASE_NAME
                    )
                    .fallbackToDestructiveMigration()
                    .build();
                }
            }
        }
        return instance;
    }
}

