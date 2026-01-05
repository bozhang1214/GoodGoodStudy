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
    private static AppDatabase instance;

    public abstract UserDao userDao();
    public abstract QuestionDao questionDao();
    public abstract AnswerDao answerDao();
    public abstract WrongQuestionDao wrongQuestionDao();
    public abstract ChatMessageDao chatMessageDao();

    public static synchronized AppDatabase getInstance(Context context) {
        if (instance == null) {
            instance = Room.databaseBuilder(
                context.getApplicationContext(),
                AppDatabase.class,
                AppConstants.DATABASE_NAME
            )
            .fallbackToDestructiveMigration()
            .build();
        }
        return instance;
    }
}

