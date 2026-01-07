import { AppDatabase } from "@normalized:N&&&entry/src/main/ets/database/AppDatabase&";
import { QuestionDao } from "@normalized:N&&&entry/src/main/ets/database/dao/QuestionDao&";
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
import { QuestionDataGenerator } from "@normalized:N&&&entry/src/main/ets/utils/QuestionDataGenerator&";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
/**
 * 数据库初始化工具
 */
export class DatabaseInitializer {
    // 根据构建模式决定题目数量：debug包5道，release包40道
    private static readonly QUESTIONS_PER_GRADE = AppConstants.DEBUG_QUESTIONS_PER_PRACTICE; // 可以根据构建模式调整
    /**
     * 初始化数学题目数据
     * 如果数据库中没有数学题目，则生成随机题目
     */
    static async initializeMathQuestions(): Promise<void> {
        try {
            const database = await AppDatabase.getInstance();
            const rdbStore = database.getRdbStore();
            const questionDao = new QuestionDao(rdbStore);
            // 检查是否已有数学题目
            let totalCount = 0;
            for (let grade = AppConstants.MIN_GRADE; grade <= AppConstants.MAX_GRADE; grade++) {
                totalCount += await questionDao.getQuestionCount(AppConstants.SUBJECT_MATH, grade);
            }
            // 如果没有题目，则生成
            if (totalCount === 0) {
                Logger.debugWithTag('DatabaseInitializer', 'No math questions found, generating...');
                const questions = QuestionDataGenerator.generateAllMathQuestions(this.QUESTIONS_PER_GRADE);
                await questionDao.insertQuestions(questions);
                Logger.debugWithTag('DatabaseInitializer', `Generated ${questions.length} math questions`);
            }
            else {
                Logger.debugWithTag('DatabaseInitializer', `Math questions already exist: ${totalCount}`);
            }
        }
        catch (error) {
            Logger.errorWithTag('DatabaseInitializer', 'Failed to initialize math questions', error as Error);
            throw error;
        }
    }
    /**
     * 为指定年级生成数学题目
     */
    static async generateMathQuestionsForGrade(grade: number, count: number): Promise<void> {
        try {
            const database = await AppDatabase.getInstance();
            const rdbStore = database.getRdbStore();
            const questionDao = new QuestionDao(rdbStore);
            const questions = QuestionDataGenerator.generateMathQuestions(grade, count);
            await questionDao.insertQuestions(questions);
            Logger.debugWithTag('DatabaseInitializer', `Generated ${questions.length} math questions for grade ${grade}`);
        }
        catch (error) {
            Logger.errorWithTag('DatabaseInitializer', `Failed to generate math questions for grade ${grade}`, error as Error);
            throw error;
        }
    }
}
