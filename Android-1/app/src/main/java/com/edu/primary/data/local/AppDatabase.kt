package com.edu.primary.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.edu.primary.data.local.converter.StringListConverter
import com.edu.primary.data.local.dao.AnswerDao
import com.edu.primary.data.local.dao.ChatMessageDao
import com.edu.primary.data.local.dao.QuestionDao
import com.edu.primary.data.local.dao.UserDao
import com.edu.primary.data.local.dao.WrongQuestionDao
import com.edu.primary.data.local.entity.AnswerEntity
import com.edu.primary.data.local.entity.ChatMessageEntity
import com.edu.primary.data.local.entity.QuestionEntity
import com.edu.primary.data.local.entity.UserEntity
import com.edu.primary.data.local.entity.WrongQuestionEntity

/**
 * Room 数据库单例，包含用户、题目、答案、错题、聊天消息五张表。
 *
 * 使用 [getInstance] 获取实例，内部使用 applicationContext 并采用双重检查锁保证线程安全。
 * 使用 [StringListConverter] 将 [QuestionEntity.options] 的 List<String> 序列化为 JSON 存储。
 *
 * @see com.edu.primary.data.local.dao.UserDao
 * @see com.edu.primary.data.local.dao.QuestionDao
 * @see com.edu.primary.data.local.dao.AnswerDao
 * @see com.edu.primary.data.local.dao.WrongQuestionDao
 * @see com.edu.primary.data.local.dao.ChatMessageDao
 */
@Database(
    entities = [
        UserEntity::class,
        QuestionEntity::class,
        AnswerEntity::class,
        WrongQuestionEntity::class,
        ChatMessageEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(StringListConverter::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun questionDao(): QuestionDao
    abstract fun answerDao(): AnswerDao
    abstract fun wrongQuestionDao(): WrongQuestionDao
    abstract fun chatMessageDao(): ChatMessageDao

    companion object {
        private const val NAME = "primary_education_db"

        @Volatile
        private var instance: AppDatabase? = null

        /**
         * 获取数据库单例。使用 [Context.getApplicationContext] 避免泄漏。
         * @param context 任意 Context，内部会转为 ApplicationContext
         * @return 单例 [AppDatabase]
         */
        fun getInstance(context: Context): AppDatabase {
            return instance ?: synchronized(this) {
                instance ?: Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    NAME
                ).fallbackToDestructiveMigration().build().also { instance = it }
            }
        }
    }
}
