import { AppConstants } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
import { Question } from "@normalized:N&&&entry/src/main/ets/model/Question&";
/**
 * 题目数据生成器
 */
export class QuestionDataGenerator {
    /**
     * 生成指定数量的数学题目
     * @param grade 年级 (1-6)
     * @param count 题目数量
     * @returns 题目列表
     */
    static generateMathQuestions(grade: number, count: number): Question[] {
        const questions: Question[] = [];
        // 如果数量为5，确保覆盖所有题型（2道单选、2道填空、1道判断）
        if (count === 5) {
            return this.generateMathQuestionsWithAllTypes(grade);
        }
        // 其他数量随机生成
        for (let i = 0; i < count; i++) {
            const question = this.generateRandomMathQuestion(grade);
            if (question !== null) {
                questions.push(question);
            }
        }
        return questions;
    }
    /**
     * 生成覆盖所有题型的数学题目（5道题：2道单选、2道填空、1道判断）
     */
    private static generateMathQuestionsWithAllTypes(grade: number): Question[] {
        const questions: Question[] = [];
        // 2道单选题
        for (let i = 0; i < 2; i++) {
            const question = new Question();
            question.subjectId = AppConstants.SUBJECT_MATH;
            question.grade = grade;
            question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
            const singleChoice = this.generateSingleChoiceQuestion(question, grade);
            if (singleChoice !== null) {
                questions.push(singleChoice);
            }
        }
        // 2道填空题
        for (let i = 0; i < 2; i++) {
            const question = new Question();
            question.subjectId = AppConstants.SUBJECT_MATH;
            question.grade = grade;
            question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
            const fillBlank = this.generateFillBlankQuestion(question, grade);
            if (fillBlank !== null) {
                questions.push(fillBlank);
            }
        }
        // 1道判断题
        const question = new Question();
        question.subjectId = AppConstants.SUBJECT_MATH;
        question.grade = grade;
        question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
        const judgment = this.generateJudgmentQuestion(question, grade);
        if (judgment !== null) {
            questions.push(judgment);
        }
        return questions;
    }
    /**
     * 生成随机数学题目
     */
    private static generateRandomMathQuestion(grade: number): Question | null {
        const question = new Question();
        question.subjectId = AppConstants.SUBJECT_MATH;
        question.grade = grade;
        question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
        // 随机选择题目类型
        const typeIndex = Math.floor(Math.random() * 3);
        switch (typeIndex) {
            case 0:
                return this.generateSingleChoiceQuestion(question, grade);
            case 1:
                return this.generateFillBlankQuestion(question, grade);
            case 2:
                return this.generateJudgmentQuestion(question, grade);
            default:
                return this.generateSingleChoiceQuestion(question, grade);
        }
    }
    /**
     * 生成选择题
     */
    private static generateSingleChoiceQuestion(question: Question, grade: number): Question | null {
        question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
        let num1: number, num2: number, result: number;
        let operator: string;
        const maxNum = this.getMaxNumber(grade);
        // 根据年级生成不同难度的题目
        if (grade <= 2) {
            // 1-2年级：简单加减法
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            if (Math.random() > 0.5) {
                operator = '+';
                result = num1 + num2;
            }
            else {
                operator = '-';
                if (num1 < num2) {
                    const temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                result = num1 - num2;
            }
        }
        else if (grade <= 4) {
            // 3-4年级：加减乘除
            const op = Math.floor(Math.random() * 4);
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            switch (op) {
                case 0:
                    operator = '+';
                    result = num1 + num2;
                    break;
                case 1:
                    operator = '-';
                    if (num1 < num2) {
                        const temp = num1;
                        num1 = num2;
                        num2 = temp;
                    }
                    result = num1 - num2;
                    break;
                case 2:
                    operator = '×';
                    result = num1 * num2;
                    break;
                default:
                    operator = '÷';
                    if (num2 === 0)
                        num2 = 1;
                    result = Math.floor(num1 / num2);
                    num1 = result * num2; // 确保能整除
                    break;
            }
        }
        else {
            // 5-6年级：复杂运算
            const op = Math.floor(Math.random() * 4);
            num1 = Math.floor(Math.random() * maxNum) + 10;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            switch (op) {
                case 0:
                    operator = '+';
                    result = num1 + num2;
                    break;
                case 1:
                    operator = '-';
                    if (num1 < num2) {
                        const temp = num1;
                        num1 = num2;
                        num2 = temp;
                    }
                    result = num1 - num2;
                    break;
                case 2:
                    operator = '×';
                    result = num1 * num2;
                    break;
                default:
                    operator = '÷';
                    if (num2 === 0)
                        num2 = 1;
                    const quotient = Math.floor(num1 / num2);
                    num1 = quotient * num2;
                    result = quotient;
                    break;
            }
        }
        question.content = `${num1} ${operator} ${num2} = ?`;
        question.correctAnswer = String(result);
        // 生成选项（包含正确答案和3个错误答案）
        const options: string[] = [question.correctAnswer];
        // 生成错误选项
        for (let i = 0; i < 3; i++) {
            let wrongAnswer = result + Math.floor(Math.random() * 20) - 10;
            if (wrongAnswer < 0)
                wrongAnswer = Math.abs(wrongAnswer);
            if (wrongAnswer === result)
                wrongAnswer += Math.floor(Math.random() * 5) + 1;
            options.push(String(wrongAnswer));
        }
        // 打乱选项顺序
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        question.options = options;
        question.explanation = `${num1} ${operator} ${num2} = ${result}`;
        return question;
    }
    /**
     * 生成填空题
     */
    private static generateFillBlankQuestion(question: Question, grade: number): Question | null {
        question.type = AppConstants.QUESTION_TYPE_FILL_BLANK;
        let num1: number, num2: number, result: number;
        let operator: string;
        const maxNum = this.getMaxNumber(grade);
        if (grade <= 2) {
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            if (Math.random() > 0.5) {
                operator = '+';
                result = num1 + num2;
                question.content = `${num1} + ${num2} = (    )`;
            }
            else {
                operator = '-';
                if (num1 < num2) {
                    const temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                result = num1 - num2;
                question.content = `${num1} - ${num2} = (    )`;
            }
        }
        else if (grade <= 4) {
            const op = Math.floor(Math.random() * 4);
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            switch (op) {
                case 0:
                    operator = '+';
                    result = num1 + num2;
                    question.content = `${num1} + ${num2} = (    )`;
                    break;
                case 1:
                    operator = '-';
                    if (num1 < num2) {
                        const temp = num1;
                        num1 = num2;
                        num2 = temp;
                    }
                    result = num1 - num2;
                    question.content = `${num1} - ${num2} = (    )`;
                    break;
                case 2:
                    operator = '×';
                    result = num1 * num2;
                    question.content = `${num1} × ${num2} = (    )`;
                    break;
                default:
                    operator = '÷';
                    if (num2 === 0)
                        num2 = 1;
                    result = Math.floor(num1 / num2);
                    num1 = result * num2; // 确保能整除
                    question.content = `${num1} ÷ ${num2} = (    )`;
                    break;
            }
        }
        else {
            const op = Math.floor(Math.random() * 4);
            num1 = Math.floor(Math.random() * maxNum) + 10;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            switch (op) {
                case 0:
                    operator = '+';
                    result = num1 + num2;
                    question.content = `${num1} + ${num2} = (    )`;
                    break;
                case 1:
                    operator = '-';
                    if (num1 < num2) {
                        const temp = num1;
                        num1 = num2;
                        num2 = temp;
                    }
                    result = num1 - num2;
                    question.content = `${num1} - ${num2} = (    )`;
                    break;
                case 2:
                    operator = '×';
                    result = num1 * num2;
                    question.content = `${num1} × ${num2} = (    )`;
                    break;
                default:
                    operator = '÷';
                    if (num2 === 0)
                        num2 = 1;
                    const quotient = Math.floor(num1 / num2);
                    num1 = quotient * num2;
                    result = quotient;
                    question.content = `${num1} ÷ ${num2} = (    )`;
                    break;
            }
        }
        question.correctAnswer = String(result);
        question.explanation = `${num1} ${operator} ${num2} = ${result}`;
        return question;
    }
    /**
     * 生成判断题
     */
    private static generateJudgmentQuestion(question: Question, grade: number): Question | null {
        question.type = AppConstants.QUESTION_TYPE_JUDGMENT;
        let num1: number, num2: number, result: number;
        let operator: string;
        const isCorrect = Math.random() > 0.5;
        const maxNum = this.getMaxNumber(grade);
        if (grade <= 2) {
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            if (Math.random() > 0.5) {
                operator = '+';
                result = num1 + num2;
            }
            else {
                operator = '-';
                if (num1 < num2) {
                    const temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                result = num1 - num2;
            }
        }
        else {
            const op = Math.floor(Math.random() * 4);
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            switch (op) {
                case 0:
                    operator = '+';
                    result = num1 + num2;
                    break;
                case 1:
                    operator = '-';
                    if (num1 < num2) {
                        const temp = num1;
                        num1 = num2;
                        num2 = temp;
                    }
                    result = num1 - num2;
                    break;
                case 2:
                    operator = '×';
                    result = num1 * num2;
                    break;
                default:
                    operator = '÷';
                    if (num2 === 0)
                        num2 = 1;
                    result = Math.floor(num1 / num2);
                    num1 = result * num2; // 确保能整除
                    break;
            }
        }
        // 如果是错误题目，生成一个错误的答案
        let displayedResult = result;
        if (!isCorrect) {
            displayedResult = result + Math.floor(Math.random() * 10) - 5;
            if (displayedResult < 0)
                displayedResult = Math.abs(displayedResult);
            if (displayedResult === result)
                displayedResult = result + 1;
        }
        question.content = `${num1} ${operator} ${num2} = ${displayedResult}`;
        question.correctAnswer = isCorrect ? '正确' : '错误';
        question.explanation = isCorrect
            ? `${num1} ${operator} ${num2} = ${result}，所以这个等式是正确的`
            : `${num1} ${operator} ${num2} = ${result}，但题目中写的是 ${displayedResult}，所以这个等式是错误的`;
        return question;
    }
    /**
     * 根据年级获取最大数字范围
     */
    private static getMaxNumber(grade: number): number {
        switch (grade) {
            case 1:
                return 20;
            case 2:
                return 50;
            case 3:
                return 100;
            case 4:
                return 200;
            case 5:
                return 500;
            case 6:
                return 1000;
            default:
                return 100;
        }
    }
    /**
     * 为所有年级生成数学题目
     * @param questionsPerGrade 每个年级的题目数量
     * @returns 所有题目列表
     */
    static generateAllMathQuestions(questionsPerGrade: number): Question[] {
        const allQuestions: Question[] = [];
        for (let grade = AppConstants.MIN_GRADE; grade <= AppConstants.MAX_GRADE; grade++) {
            const questions = this.generateMathQuestions(grade, questionsPerGrade);
            allQuestions.push(...questions);
        }
        return allQuestions;
    }
}
