import relationalStore from '@ohos.data.relationalStore';
import { ResultSetManager } from '../../utils/ResultSetManager';
import { Logger } from '../../utils/Logger';

/**
 * 错题实体
 */
export interface WrongQuestionEntity {
  id?: number;
  userId: number;
  questionId: number;
  userAnswer: string;
  wrongTime: number;
  reviewCount: number;
}

/**
 * 错题数据访问对象
 */
export class WrongQuestionDao {
  private rdbStore: relationalStore.RdbStore;

  constructor(rdbStore: relationalStore.RdbStore) {
    this.rdbStore = rdbStore;
  }

  /**
   * 插入错题
   */
  async insertWrongQuestion(wrongQuestion: WrongQuestionEntity): Promise<number> {
    const valueBucket: relationalStore.ValuesBucket = {
      'userId': wrongQuestion.userId,
      'questionId': wrongQuestion.questionId,
      'userAnswer': wrongQuestion.userAnswer,
      'wrongTime': wrongQuestion.wrongTime,
      'reviewCount': wrongQuestion.reviewCount || 0
    };
    const insertId = await this.rdbStore.insert('wrong_questions', valueBucket);
    return Number(insertId);
  }

  /**
   * 更新错题
   */
  async updateWrongQuestion(wrongQuestion: WrongQuestionEntity): Promise<void> {
    const valueBucket: relationalStore.ValuesBucket = {
      'userAnswer': wrongQuestion.userAnswer,
      'wrongTime': wrongQuestion.wrongTime,
      'reviewCount': wrongQuestion.reviewCount
    };
    const predicates = new relationalStore.RdbPredicates('wrong_questions');
    predicates.equalTo('id', wrongQuestion.id!);
    await this.rdbStore.update(valueBucket, predicates);
  }

  /**
   * 删除错题
   */
  async deleteWrongQuestion(wrongQuestion: WrongQuestionEntity): Promise<void> {
    const predicates = new relationalStore.RdbPredicates('wrong_questions');
    predicates.equalTo('id', wrongQuestion.id!);
    await this.rdbStore.delete(predicates);
  }

  /**
   * 根据用户ID获取错题列表
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getWrongQuestionsByUser(userId: number): Promise<WrongQuestionEntity[]> {
    const predicates = new relationalStore.RdbPredicates('wrong_questions');
    predicates.equalTo('userId', userId);
    predicates.orderByDesc('wrongTime');
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates);
      return this.parseWrongQuestions(resultSet);
    } catch (error) {
      Logger.errorWithTag('WrongQuestionDao', `Failed to get wrong questions by user: ${userId}`, error as Error);
      throw error;
    } finally {
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 获取错题
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getWrongQuestion(userId: number, questionId: number): Promise<WrongQuestionEntity | null> {
    const predicates = new relationalStore.RdbPredicates('wrong_questions');
    predicates.equalTo('userId', userId);
    predicates.equalTo('questionId', questionId);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates);
      if (resultSet.goToFirstRow()) {
        return this.parseWrongQuestion(resultSet);
      }
      return null;
    } catch (error) {
      Logger.errorWithTag('WrongQuestionDao', `Failed to get wrong question for user ${userId}, question ${questionId}`, error as Error);
      throw error;
    } finally {
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 解析错题列表
   */
  private parseWrongQuestions(resultSet: relationalStore.ResultSet): WrongQuestionEntity[] {
    const wrongQuestions: WrongQuestionEntity[] = [];
    while (resultSet.goToNextRow()) {
      wrongQuestions.push(this.parseWrongQuestion(resultSet));
    }
    return wrongQuestions;
  }

  /**
   * 解析单个错题
   */
  private parseWrongQuestion(resultSet: relationalStore.ResultSet): WrongQuestionEntity {
    return {
      id: resultSet.getLong(resultSet.getColumnIndex('id')),
      userId: resultSet.getLong(resultSet.getColumnIndex('userId')),
      questionId: resultSet.getLong(resultSet.getColumnIndex('questionId')),
      userAnswer: resultSet.getString(resultSet.getColumnIndex('userAnswer')),
      wrongTime: resultSet.getLong(resultSet.getColumnIndex('wrongTime')),
      reviewCount: resultSet.getLong(resultSet.getColumnIndex('reviewCount'))
    };
  }
}
