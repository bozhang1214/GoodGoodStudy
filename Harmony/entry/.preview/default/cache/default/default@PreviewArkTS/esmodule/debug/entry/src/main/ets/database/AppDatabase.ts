import relationalStore from "@ohos:data.relationalStore";
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
import { getContext } from "@normalized:N&&&entry/src/main/ets/utils/ContextUtil&";
/**
 * 应用数据库管理类
 */
export class AppDatabase {
    private static instance: AppDatabase | null = null;
    private static instancePromise: Promise<AppDatabase> | null = null;
    private rdbStore: relationalStore.RdbStore | null = null;
    private constructor() {
    }
    /**
     * 获取数据库实例（单例模式）
     */
    static getInstance(): Promise<AppDatabase> {
        if (AppDatabase.instance === null) {
            if (AppDatabase.instancePromise === null) {
                AppDatabase.instancePromise = (async () => {
                    const db = new AppDatabase();
                    await db.initDatabase();
                    AppDatabase.instance = db;
                    return db;
                })();
            }
            return AppDatabase.instancePromise;
        }
        return Promise.resolve(AppDatabase.instance);
    }
    /**
     * 初始化数据库
     */
    private async initDatabase(): Promise<void> {
        const context = getContext();
        const config: relationalStore.StoreConfig = {
            name: AppConstants.DATABASE_NAME,
            securityLevel: relationalStore.SecurityLevel.S1
        };
        try {
            this.rdbStore = await relationalStore.getRdbStore(context, config);
            await this.createTables();
        }
        catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }
    /**
     * 创建数据表
     */
    private async createTables(): Promise<void> {
        if (!this.rdbStore) {
            throw new Error('Database not initialized');
        }
        // 创建用户表
        const createUserTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        nickname TEXT NOT NULL,
        createTime INTEGER NOT NULL
      )
    `;
        // 创建题目表
        const createQuestionTable = `
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subjectId INTEGER NOT NULL,
        grade INTEGER NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        options TEXT NOT NULL,
        correctAnswer TEXT NOT NULL,
        explanation TEXT,
        difficulty INTEGER NOT NULL
      )
    `;
        // 创建答题记录表
        const createAnswerTable = `
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        questionId INTEGER NOT NULL,
        userAnswer TEXT NOT NULL,
        isCorrect INTEGER NOT NULL,
        answerTime INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (questionId) REFERENCES questions(id)
      )
    `;
        // 创建错题表
        const createWrongQuestionTable = `
      CREATE TABLE IF NOT EXISTS wrong_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        questionId INTEGER NOT NULL,
        userAnswer TEXT NOT NULL,
        wrongTime INTEGER NOT NULL,
        reviewCount INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (questionId) REFERENCES questions(id)
      )
    `;
        // 创建聊天消息表
        const createChatMessageTable = `
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        messageTime INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `;
        await this.rdbStore.executeSql(createUserTable);
        await this.rdbStore.executeSql(createQuestionTable);
        await this.rdbStore.executeSql(createAnswerTable);
        await this.rdbStore.executeSql(createWrongQuestionTable);
        await this.rdbStore.executeSql(createChatMessageTable);
    }
    /**
     * 获取RdbStore实例
     */
    getRdbStore(): relationalStore.RdbStore {
        if (!this.rdbStore) {
            throw new Error('Database not initialized');
        }
        return this.rdbStore;
    }
    /**
     * 关闭数据库
     */
    async close(): Promise<void> {
        if (this.rdbStore) {
            await this.rdbStore.close();
            this.rdbStore = null;
            AppDatabase.instance = null;
        }
    }
}
