import relationalStore from '@ohos.data.relationalStore';
import { ResultSetManager } from '../../utils/ResultSetManager';
import { Logger } from '../../utils/Logger';

/**
 * 答案实体
 */
export interface AnswerEntity {
  id?: number;
  userId: number;
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  answerTime: number;
}

/**
 * 答案数据访问对象
 */
export class AnswerDao {
  private rdbStore: relationalStore.RdbStore;

  constructor(rdbStore: relationalStore.RdbStore) {
    this.rdbStore = rdbStore;
  }

  /**
   * 插入答案
   */
  async insertAnswer(answer: AnswerEntity): Promise<number> {
    const valueBucket: relationalStore.ValuesBucket = {
      'userId': answer.userId,
      'questionId': answer.questionId,
      'userAnswer': answer.userAnswer,
      'isCorrect': answer.isCorrect ? 1 : 0,
      'answerTime': answer.answerTime
    };
    const insertId = await this.rdbStore.insert('answers', valueBucket);
    return Number(insertId);
  }

  /**
   * 根据用户ID获取答案列表
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getAnswersByUser(userId: number): Promise<AnswerEntity[]> {
    const predicates = new relationalStore.RdbPredicates('answers');
    predicates.equalTo('userId', userId);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates);
      return this.parseAnswers(resultSet);
    } catch (error) {
      Logger.errorWithTag('AnswerDao', `Failed to get answers by user: ${userId}`, error as Error);
      throw error;
    } finally {
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 获取用户的答案
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getAnswer(userId: number, questionId: number): Promise<AnswerEntity | null> {
    const predicates = new relationalStore.RdbPredicates('answers');
    predicates.equalTo('userId', userId);
    predicates.equalTo('questionId', questionId);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates);
      if (resultSet.goToFirstRow()) {
        return this.parseAnswer(resultSet);
      }
      return null;
    } catch (error) {
      Logger.errorWithTag('AnswerDao', `Failed to get answer for user ${userId}, question ${questionId}`, error as Error);
      throw error;
    } finally {
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 获取用户答对的数量
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getCorrectCount(userId: number): Promise<number> {
    const predicates = new relationalStore.RdbPredicates('answers');
    predicates.equalTo('userId', userId);
    predicates.equalTo('isCorrect', 1);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates, ['id']);
      let count = 0;
      while (resultSet.goToNextRow()) {
        count++;
      }
      return count;
    } catch (error) {
      Logger.errorWithTag('AnswerDao', `Failed to get correct count for user: ${userId}`, error as Error);
      throw error;
    } finally {
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 获取用户答题总数
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getTotalCount(userId: number): Promise<number> {
    const predicates = new relationalStore.RdbPredicates('answers');
    predicates.equalTo('userId', userId);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates, ['id']);
      let count = 0;
      while (resultSet.goToNextRow()) {
        count++;
      }
      return count;
    } catch (error) {
      Logger.errorWithTag('AnswerDao', `Failed to get total count for user: ${userId}`, error as Error);
      throw error;
    } finally {
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 解析答案列表
   */
  private parseAnswers(resultSet: relationalStore.ResultSet): AnswerEntity[] {
    const answers: AnswerEntity[] = [];
    while (resultSet.goToNextRow()) {
      answers.push(this.parseAnswer(resultSet));
    }
    return answers;
  }

  /**
   * 解析单个答案
   */
  private parseAnswer(resultSet: relationalStore.ResultSet): AnswerEntity {
    return {
      id: resultSet.getLong(resultSet.getColumnIndex('id')),
      userId: resultSet.getLong(resultSet.getColumnIndex('userId')),
      questionId: resultSet.getLong(resultSet.getColumnIndex('questionId')),
      userAnswer: resultSet.getString(resultSet.getColumnIndex('userAnswer')),
      isCorrect: resultSet.getLong(resultSet.getColumnIndex('isCorrect')) === 1,
      answerTime: resultSet.getLong(resultSet.getColumnIndex('answerTime'))
    };
  }
}
