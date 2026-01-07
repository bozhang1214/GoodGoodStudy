import { AppDatabase } from '../database/AppDatabase';
import { QuestionDao } from '../database/dao/QuestionDao';
import { AppConstants } from '../constants/AppConstants';
import { QuestionDataGenerator } from './QuestionDataGenerator';
import { Logger } from './Logger';

/**
 * 数据库初始化工具
 */
export class DatabaseInitializer {
  // 根据构建模式决定题目数量：debug包5道，release包40道
  private static readonly QUESTIONS_PER_GRADE = AppConstants.DEBUG_QUESTIONS_PER_PRACTICE; // 可以根据构建模式调整

  /**
   * 初始化数学题目数据
   * 如果数据库中没有数学题目，则生成随机题目
   * 为了确保题目多样化，每个年级至少生成20道题目（即使DEBUG模式只显示5道）
   */
  static async initializeMathQuestions(): Promise<void> {
    try {
      const database = await AppDatabase.getInstance();
      const rdbStore = database.getRdbStore();
      const questionDao = new QuestionDao(rdbStore);
      
      // 检查是否已有数学题目
      let totalCount = 0;
      for (let grade = AppConstants.MIN_GRADE; grade <= AppConstants.MAX_GRADE; grade++) {
        const gradeCount = await questionDao.getQuestionCount(AppConstants.SUBJECT_MATH, grade);
        totalCount += gradeCount;
        // 如果某个年级的题目数量不足20道，补充生成
        if (gradeCount < 20) {
          Logger.debugWithTag('DatabaseInitializer', `Grade ${grade} has only ${gradeCount} questions, generating more...`);
          const questionsToGenerate = 20 - gradeCount;
          const questions = QuestionDataGenerator.generateMathQuestions(grade, questionsToGenerate);
          await questionDao.insertQuestions(questions);
          Logger.debugWithTag('DatabaseInitializer', `Generated ${questions.length} additional math questions for grade ${grade}`);
        }
      }
      // 如果完全没有题目，则生成
      if (totalCount === 0) {
        Logger.debugWithTag('DatabaseInitializer', 'No math questions found, generating...');
        // 每个年级生成20道题目，确保有足够的多样性
        const questionsPerGrade = 20;
        const questions = QuestionDataGenerator.generateAllMathQuestions(questionsPerGrade);
        await questionDao.insertQuestions(questions);
        Logger.debugWithTag('DatabaseInitializer', `Generated ${questions.length} math questions`);
      } else {
        Logger.debugWithTag('DatabaseInitializer', `Math questions already exist: ${totalCount}`);
      }
    } catch (error) {
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
    } catch (error) {
      Logger.errorWithTag('DatabaseInitializer', `Failed to generate math questions for grade ${grade}`, error as Error);
      throw error;
    }
  }
}
