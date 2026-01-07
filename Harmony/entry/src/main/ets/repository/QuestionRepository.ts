import { AppDatabase } from '../database/AppDatabase';
import { QuestionDao } from '../database/dao/QuestionDao';
import { AnswerDao, AnswerEntity } from '../database/dao/AnswerDao';
import { WrongQuestionDao, WrongQuestionEntity } from '../database/dao/WrongQuestionDao';
import { Question } from '../model/Question';

/**
 * 进度数据
 */
export interface ProgressData {
  total: number;
  correct: number;
  accuracy: number;
}

/**
 * 题目仓库
 */
export class QuestionRepository {
  private database: Promise<AppDatabase>;
  private questionDao: QuestionDao | null = null;
  private answerDao: AnswerDao | null = null;
  private wrongQuestionDao: WrongQuestionDao | null = null;

  constructor() {
    this.database = AppDatabase.getInstance();
  }

  /**
   * 初始化
   */
  async init(): Promise<void> {
    if (this.questionDao && this.answerDao && this.wrongQuestionDao) {
      return;
    }
    const db = await this.database;
    const rdbStore = db.getRdbStore();
    this.questionDao = new QuestionDao(rdbStore);
    this.answerDao = new AnswerDao(rdbStore);
    this.wrongQuestionDao = new WrongQuestionDao(rdbStore);
  }

  /**
   * 获取题目列表
   */
  async getQuestions(subjectId: number, grade: number): Promise<Question[]> {
    await this.ensureInit();
    return await this.questionDao!.getQuestionsBySubjectAndGrade(subjectId, grade);
  }

  /**
   * 根据ID列表获取题目
   */
  async getQuestionsByIds(questionIds: number[]): Promise<Question[]> {
    await this.ensureInit();
    return await this.questionDao!.getQuestionsByIds(questionIds);
  }

  /**
   * 根据ID获取题目
   */
  async getQuestionById(questionId: number): Promise<Question | null> {
    await this.ensureInit();
    return await this.questionDao!.getQuestionById(questionId);
  }

  /**
   * 获取题目数量
   */
  async getQuestionCount(subjectId: number, grade: number): Promise<number> {
    await this.ensureInit();
    return await this.questionDao!.getQuestionCount(subjectId, grade);
  }

  /**
   * 插入题目列表
   */
  async insertQuestions(questions: Question[]): Promise<void> {
    await this.ensureInit();
    await this.questionDao!.insertQuestions(questions);
  }

  /**
   * 插入答案
   */
  async insertAnswer(answer: AnswerEntity): Promise<void> {
    await this.ensureInit();
    await this.answerDao!.insertAnswer(answer);
  }

  /**
   * 获取答案
   */
  async getAnswer(userId: number, questionId: number): Promise<AnswerEntity | null> {
    await this.ensureInit();
    return await this.answerDao!.getAnswer(userId, questionId);
  }

  /**
   * 添加错题
   */
  async addWrongQuestion(userId: number, questionId: number, userAnswer: string): Promise<void> {
    await this.ensureInit();
    const existing = await this.wrongQuestionDao!.getWrongQuestion(userId, questionId);
    if (existing === null) {
      const wrongQuestion: WrongQuestionEntity = {
        userId: userId,
        questionId: questionId,
        userAnswer: userAnswer,
        wrongTime: Date.now(),
        reviewCount: 0
      };
      await this.wrongQuestionDao!.insertWrongQuestion(wrongQuestion);
    } else {
      // 如果已存在，更新用户答案和时间
      existing.userAnswer = userAnswer;
      existing.wrongTime = Date.now();
      await this.wrongQuestionDao!.updateWrongQuestion(existing);
    }
  }

  /**
   * 从错题本中移除题目（答对了）
   */
  async removeWrongQuestion(userId: number, questionId: number): Promise<void> {
    await this.ensureInit();
    const existing = await this.wrongQuestionDao!.getWrongQuestion(userId, questionId);
    if (existing !== null) {
      await this.wrongQuestionDao!.deleteWrongQuestion(existing);
    }
  }

  /**
   * 增加错题复习次数
   */
  async incrementReviewCount(userId: number, questionId: number): Promise<void> {
    await this.ensureInit();
    const existing = await this.wrongQuestionDao!.getWrongQuestion(userId, questionId);
    if (existing !== null) {
      existing.reviewCount++;
      await this.wrongQuestionDao!.updateWrongQuestion(existing);
    }
  }

  /**
   * 获取用户的错题列表
   */
  async getWrongQuestions(userId: number): Promise<WrongQuestionEntity[]> {
    await this.ensureInit();
    return await this.wrongQuestionDao!.getWrongQuestionsByUser(userId);
  }

  /**
   * 获取用户答题统计
   */
  async getProgressData(userId: number): Promise<ProgressData> {
    await this.ensureInit();
    const total = await this.answerDao!.getTotalCount(userId);
    const correct = await this.answerDao!.getCorrectCount(userId);
    const accuracy = total > 0 ? (correct * 100.0 / total) : 0.0;
    return { total, correct, accuracy };
  }

  /**
   * 确保已初始化
   */
  private async ensureInit(): Promise<void> {
    if (!this.questionDao || !this.answerDao || !this.wrongQuestionDao) {
      await this.init();
    }
  }
}
