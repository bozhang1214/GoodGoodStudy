import { AppConstants } from '../constants/AppConstants';
import { Question } from '../model/Question';

/**
 * 答案检查工具类（单一职责原则）
 * 负责答案验证逻辑
 */
export class AnswerChecker {
  private constructor() {
    // 工具类，禁止实例化
  }

  /**
   * 检查答案是否正确
   * @param question 题目实体
   * @param userAnswer 用户答案
   * @param correctAnswerText 正确答案文本（用于判断题）
   * @returns 是否正确
   */
  static checkAnswer(question: Question, userAnswer: string, correctAnswerText?: string): boolean {
    if (!question || !userAnswer || userAnswer.length === 0) {
      return false;
    }
    
    if (!question.correctAnswer) {
      return false;
    }
    
    if (AppConstants.QUESTION_TYPE_JUDGMENT === question.type) {
      // 判断题：直接比较用户答案和正确答案
      return question.correctAnswer.trim() === userAnswer.trim();
    } else {
      // 选择题和填空题：直接比较答案
      return question.correctAnswer.trim() === userAnswer.trim();
    }
  }
}
