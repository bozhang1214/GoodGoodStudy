import { AppConstants } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
import type { Question } from '../model/Question';
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
            // 判断题需要特殊处理
            if (!correctAnswerText) {
                return false;
            }
            const userChoice = userAnswer === correctAnswerText;
            const correctAnswer = question.correctAnswer === correctAnswerText;
            return userChoice === correctAnswer;
        }
        else {
            return question.correctAnswer === userAnswer;
        }
    }
}
