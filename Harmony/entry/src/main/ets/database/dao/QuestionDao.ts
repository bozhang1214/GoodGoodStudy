import relationalStore from '@ohos.data.relationalStore';
import { Question } from '../../model/Question';
import { ResultSetManager } from '../../utils/ResultSetManager';
import { Logger } from '../../utils/Logger';

/**
 * 题目数据访问对象
 */
export class QuestionDao {
  private rdbStore: relationalStore.RdbStore;

  constructor(rdbStore: relationalStore.RdbStore) {
    this.rdbStore = rdbStore;
  }

  /**
   * 插入题目列表
   */
  async insertQuestions(questions: Question[]): Promise<void> {
    for (const question of questions) {
      await this.insertQuestion(question);
    }
  }

  /**
   * 插入单个题目
   */
  async insertQuestion(question: Question): Promise<number> {
    const valueBucket: relationalStore.ValuesBucket = {
      'subjectId': question.subjectId,
      'grade': question.grade,
      'type': question.type,
      'content': question.content,
      'options': JSON.stringify(question.options), // 将数组转为JSON字符串存储
      'correctAnswer': question.correctAnswer,
      'explanation': question.explanation || '',
      'difficulty': question.difficulty
    };
    const insertId = await this.rdbStore.insert('questions', valueBucket);
    return Number(insertId);
  }

  /**
   * 根据科目和年级获取题目
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getQuestionsBySubjectAndGrade(subjectId: number, grade: number): Promise<Question[]> {
    const predicates = new relationalStore.RdbPredicates('questions');
    predicates.equalTo('subjectId', subjectId);
    predicates.equalTo('grade', grade);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates);
      return this.parseQuestions(resultSet);
    } catch (error) {
      Logger.errorWithTag('QuestionDao', `Failed to get questions by subject and grade`, error as Error);
      throw error;
    } finally {
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 根据ID列表获取题目
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getQuestionsByIds(ids: number[]): Promise<Question[]> {
    if (ids.length === 0) {
      return [];
    }
    const predicates = new relationalStore.RdbPredicates('questions');
    predicates.in('id', ids);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates);
      return this.parseQuestions(resultSet);
    } catch (error) {
      Logger.errorWithTag('QuestionDao', `Failed to get questions by ids`, error as Error);
      throw error;
    } finally {
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 根据ID获取题目
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getQuestionById(id: number): Promise<Question | null> {
    const predicates = new relationalStore.RdbPredicates('questions');
    predicates.equalTo('id', id);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates);
      if (resultSet.goToFirstRow()) {
        return this.parseQuestion(resultSet);
      }
      return null;
    } catch (error) {
      Logger.errorWithTag('QuestionDao', `Failed to get question by id: ${id}`, error as Error);
      throw error;
    } finally {
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 获取题目数量
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getQuestionCount(subjectId: number, grade: number): Promise<number> {
    const predicates = new relationalStore.RdbPredicates('questions');
    predicates.equalTo('subjectId', subjectId);
    predicates.equalTo('grade', grade);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates, ['id']);
      let count = 0;
      while (resultSet.goToNextRow()) {
        count++;
      }
      return count;
    } catch (error) {
      Logger.errorWithTag('QuestionDao', `Failed to get question count`, error as Error);
      throw error;
    } finally {
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 解析题目列表
   */
  private parseQuestions(resultSet: relationalStore.ResultSet): Question[] {
    const questions: Question[] = [];
    // 先移动到第一行
    if (resultSet.goToFirstRow()) {
      // 解析第一行
      questions.push(this.parseQuestion(resultSet));
      // 继续解析后续行
      while (resultSet.goToNextRow()) {
        questions.push(this.parseQuestion(resultSet));
      }
    }
    return questions;
  }

  /**
   * 解析单个题目
   */
  private parseQuestion(resultSet: relationalStore.ResultSet): Question {
    const question = new Question();
    question.id = resultSet.getLong(resultSet.getColumnIndex('id'));
    question.subjectId = resultSet.getLong(resultSet.getColumnIndex('subjectId'));
    question.grade = resultSet.getLong(resultSet.getColumnIndex('grade'));
    question.type = resultSet.getString(resultSet.getColumnIndex('type'));
    question.content = resultSet.getString(resultSet.getColumnIndex('content'));
    const optionsStr = resultSet.getString(resultSet.getColumnIndex('options'));
    try {
      question.options = JSON.parse(optionsStr) as string[];
    } catch {
      question.options = [];
    }
    question.correctAnswer = resultSet.getString(resultSet.getColumnIndex('correctAnswer'));
    question.explanation = resultSet.getString(resultSet.getColumnIndex('explanation')) || '';
    question.difficulty = resultSet.getLong(resultSet.getColumnIndex('difficulty'));
    return question;
  }
}
