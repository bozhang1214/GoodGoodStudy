import { AppConstants } from '../constants/AppConstants';
import { Question } from '../model/Question';

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
    
    // 使用时间戳和随机数作为种子，确保每次生成不同的题目
    const seed = Date.now() + Math.random() * 1000000;
    
    // 如果数量为5，确保覆盖所有题型，但每次顺序和内容都不同
    if (count === 5) {
      return this.generateMathQuestionsWithAllTypes(grade, seed);
    }
    
    // 其他数量随机生成，确保题型多样化和题目不重复
    const usedQuestions = new Set<string>(); // 用于去重
    let attempts = 0;
    const maxAttempts = count * 10; // 最多尝试次数，避免无限循环
    
    while (questions.length < count && attempts < maxAttempts) {
      attempts++;
      const question = this.generateRandomMathQuestion(grade, seed + attempts);
      if (question !== null) {
        // 使用题目内容作为唯一标识，避免重复
        const questionKey = `${question.type}_${question.content}`;
        if (!usedQuestions.has(questionKey)) {
          usedQuestions.add(questionKey);
          questions.push(question);
        }
      }
    }
    
    // 如果生成的题目不够，补充随机题目（允许少量重复）
    while (questions.length < count) {
      const question = this.generateRandomMathQuestion(grade, seed + questions.length + Math.random() * 1000);
      if (question !== null) {
        questions.push(question);
      }
    }
    
    return questions;
  }

  /**
   * 生成覆盖所有题型的数学题目（5道题：确保包含所有题型，但顺序随机）
   * @param grade 年级
   * @param seed 随机种子，确保每次生成不同题目
   */
  private static generateMathQuestionsWithAllTypes(grade: number, seed: number): Question[] {
    const questions: Question[] = [];
    const usedQuestions = new Set<string>(); // 用于去重
    
    // 生成2道单选题（确保不重复）
    let singleChoiceCount = 0;
    let attempts = 0;
    while (singleChoiceCount < 2 && attempts < 20) {
      attempts++;
      const question = new Question();
      question.subjectId = AppConstants.SUBJECT_MATH;
      question.grade = grade;
      question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
      const singleChoice = this.generateSingleChoiceQuestion(question, grade, seed + attempts);
      if (singleChoice !== null) {
        const questionKey = `${singleChoice.type}_${singleChoice.content}`;
        if (!usedQuestions.has(questionKey)) {
          usedQuestions.add(questionKey);
          questions.push(singleChoice);
          singleChoiceCount++;
        }
      }
    }
    
    // 生成2道填空题（确保不重复）
    let fillBlankCount = 0;
    attempts = 0;
    while (fillBlankCount < 2 && attempts < 20) {
      attempts++;
      const question = new Question();
      question.subjectId = AppConstants.SUBJECT_MATH;
      question.grade = grade;
      question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
      const fillBlank = this.generateFillBlankQuestion(question, grade, seed + 100 + attempts);
      if (fillBlank !== null) {
        const questionKey = `${fillBlank.type}_${fillBlank.content}`;
        if (!usedQuestions.has(questionKey)) {
          usedQuestions.add(questionKey);
          questions.push(fillBlank);
          fillBlankCount++;
        }
      }
    }
    
    // 生成1道判断题
    let judgmentCount = 0;
    attempts = 0;
    while (judgmentCount < 1 && attempts < 20) {
      attempts++;
      const question = new Question();
      question.subjectId = AppConstants.SUBJECT_MATH;
      question.grade = grade;
      question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
      const judgment = this.generateJudgmentQuestion(question, grade, seed + 200 + attempts);
      if (judgment !== null) {
        const questionKey = `${judgment.type}_${judgment.content}`;
        if (!usedQuestions.has(questionKey)) {
          usedQuestions.add(questionKey);
          questions.push(judgment);
          judgmentCount++;
        }
      }
    }
    
    // 打乱题目顺序，避免总是相同的题型顺序
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor((seed + i) % (i + 1));
      const temp = questions[i];
      questions[i] = questions[j];
      questions[j] = temp;
    }
    
    return questions;
  }

  /**
   * 生成随机数学题目
   * @param grade 年级
   * @param seed 随机种子，确保每次生成不同题目
   */
  private static generateRandomMathQuestion(grade: number, seed: number = Date.now()): Question | null {
    const question = new Question();
    question.subjectId = AppConstants.SUBJECT_MATH;
    question.grade = grade;
    question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
    
    // 使用种子生成随机数，确保可重复性
    const randomValue = (seed * 9301 + 49297) % 233280;
    const normalizedRandom = randomValue / 233280;
    
    // 随机选择题目类型
    const typeIndex = Math.floor(normalizedRandom * 3);
    switch (typeIndex) {
      case 0:
        return this.generateSingleChoiceQuestion(question, grade, seed);
      case 1:
        return this.generateFillBlankQuestion(question, grade, seed);
      case 2:
        return this.generateJudgmentQuestion(question, grade, seed);
      default:
        return this.generateSingleChoiceQuestion(question, grade, seed);
    }
  }

  /**
   * 生成选择题
   * @param question 题目对象
   * @param grade 年级
   * @param seed 随机种子，确保每次生成不同题目
   */
  private static generateSingleChoiceQuestion(question: Question, grade: number, seed: number = Date.now()): Question | null {
    question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
    
    let num1: number, num2: number, result: number;
    let operator: string;
    const maxNum = this.getMaxNumber(grade);
    
    // 使用种子生成可重复的随机数
    let currentSeed = seed;
    const nextRandom = (): number => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
    
    // 根据年级生成不同难度的题目
    if (grade <= 2) {
      // 1-2年级：简单加减法
      num1 = Math.floor(nextRandom() * maxNum) + 1;
      num2 = Math.floor(nextRandom() * maxNum) + 1;
      if (nextRandom() > 0.5) {
        operator = '+';
        result = num1 + num2;
      } else {
        operator = '-';
        if (num1 < num2) {
          const temp = num1;
          num1 = num2;
          num2 = temp;
        }
        result = num1 - num2;
      }
    } else if (grade <= 4) {
      // 3-4年级：加减乘除
      const op = Math.floor(nextRandom() * 4);
      num1 = Math.floor(nextRandom() * maxNum) + 1;
      num2 = Math.floor(nextRandom() * maxNum) + 1;
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
          if (num2 === 0) num2 = 1;
          result = Math.floor(num1 / num2);
          num1 = result * num2; // 确保能整除
          break;
      }
    } else {
      // 5-6年级：复杂运算
      const op = Math.floor(nextRandom() * 4);
      num1 = Math.floor(nextRandom() * maxNum) + 10;
      num2 = Math.floor(nextRandom() * maxNum) + 1;
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
          if (num2 === 0) num2 = 1;
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
    const usedOptions = new Set<string>([question.correctAnswer]); // 用于去重
    
    // 生成错误选项，确保不重复
    let wrongOptionCount = 0;
    let attempts = 0;
    while (wrongOptionCount < 3 && attempts < 50) {
      attempts++;
      // 生成错误答案，范围在result的±50%内
      const offset = Math.floor(nextRandom() * (Math.max(result, 10) * 0.5 + 10)) - Math.floor(Math.max(result, 10) * 0.25);
      let wrongAnswer = result + offset;
      
      // 确保错误答案不为负数
      if (wrongAnswer < 0) {
        wrongAnswer = Math.abs(wrongAnswer);
      }
      
      // 确保错误答案不等于正确答案
      if (wrongAnswer === result) {
        wrongAnswer = result + (nextRandom() > 0.5 ? 1 : -1);
        if (wrongAnswer < 0) wrongAnswer = result + 1;
      }
      
      const wrongAnswerStr = String(wrongAnswer);
      
      // 检查是否重复
      if (!usedOptions.has(wrongAnswerStr)) {
        usedOptions.add(wrongAnswerStr);
        options.push(wrongAnswerStr);
        wrongOptionCount++;
      }
    }
    
    // 如果错误选项不够，补充一些（确保至少有4个选项）
    let supplementAttempts = 0;
    while (options.length < 4 && supplementAttempts < 100) {
      supplementAttempts++;
      const wrongAnswer = result + Math.floor(nextRandom() * 20) - 10;
      const wrongAnswerStr = String(Math.max(0, wrongAnswer === result ? wrongAnswer + 1 : wrongAnswer));
      if (!usedOptions.has(wrongAnswerStr)) {
        usedOptions.add(wrongAnswerStr);
        options.push(wrongAnswerStr);
      }
    }
    // 如果仍然不够4个选项，强制添加不同的选项
    while (options.length < 4) {
      let candidate = result + options.length;
      if (candidate === result) candidate = result + options.length + 1;
      const candidateStr = String(candidate);
      if (!usedOptions.has(candidateStr)) {
        usedOptions.add(candidateStr);
        options.push(candidateStr);
      } else {
        // 如果还是重复，使用更大的数字
        candidate = result + 100 + options.length;
        const candidateStr2 = String(candidate);
        usedOptions.add(candidateStr2);
        options.push(candidateStr2);
      }
    }
    
    // 打乱选项顺序
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(nextRandom() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    question.options = options;
    question.explanation = `${num1} ${operator} ${num2} = ${result}`;
    
    return question;
  }

  /**
   * 生成填空题
   * @param question 题目对象
   * @param grade 年级
   * @param seed 随机种子，确保每次生成不同题目
   */
  private static generateFillBlankQuestion(question: Question, grade: number, seed: number = Date.now()): Question | null {
    question.type = AppConstants.QUESTION_TYPE_FILL_BLANK;
    
    let num1: number, num2: number, result: number;
    let operator: string;
    const maxNum = this.getMaxNumber(grade);
    
    // 使用种子生成可重复的随机数
    let currentSeed = seed;
    const nextRandom = (): number => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
    
    if (grade <= 2) {
      num1 = Math.floor(nextRandom() * maxNum) + 1;
      num2 = Math.floor(nextRandom() * maxNum) + 1;
      if (nextRandom() > 0.5) {
        operator = '+';
        result = num1 + num2;
        question.content = `${num1} + ${num2} = (    )`;
      } else {
        operator = '-';
        if (num1 < num2) {
          const temp = num1;
          num1 = num2;
          num2 = temp;
        }
        result = num1 - num2;
        question.content = `${num1} - ${num2} = (    )`;
      }
    } else if (grade <= 4) {
      const op = Math.floor(nextRandom() * 4);
      num1 = Math.floor(nextRandom() * maxNum) + 1;
      num2 = Math.floor(nextRandom() * maxNum) + 1;
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
          if (num2 === 0) num2 = 1;
          result = Math.floor(num1 / num2);
          num1 = result * num2; // 确保能整除
          question.content = `${num1} ÷ ${num2} = (    )`;
          break;
      }
    } else {
      const op = Math.floor(nextRandom() * 4);
      num1 = Math.floor(nextRandom() * maxNum) + 10;
      num2 = Math.floor(nextRandom() * maxNum) + 1;
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
          if (num2 === 0) num2 = 1;
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
   * @param question 题目对象
   * @param grade 年级
   * @param seed 随机种子，确保每次生成不同题目
   */
  private static generateJudgmentQuestion(question: Question, grade: number, seed: number = Date.now()): Question | null {
    question.type = AppConstants.QUESTION_TYPE_JUDGMENT;
    
    let num1: number, num2: number, result: number;
    let operator: string;
    
    // 使用种子生成可重复的随机数
    let currentSeed = seed;
    const nextRandom = (): number => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
    
    const isCorrect = nextRandom() > 0.5;
    const maxNum = this.getMaxNumber(grade);
    
    if (grade <= 2) {
      num1 = Math.floor(nextRandom() * maxNum) + 1;
      num2 = Math.floor(nextRandom() * maxNum) + 1;
      if (nextRandom() > 0.5) {
        operator = '+';
        result = num1 + num2;
      } else {
        operator = '-';
        if (num1 < num2) {
          const temp = num1;
          num1 = num2;
          num2 = temp;
        }
        result = num1 - num2;
      }
    } else {
      const op = Math.floor(nextRandom() * 4);
      num1 = Math.floor(nextRandom() * maxNum) + 1;
      num2 = Math.floor(nextRandom() * maxNum) + 1;
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
          if (num2 === 0) num2 = 1;
          result = Math.floor(num1 / num2);
          num1 = result * num2; // 确保能整除
          break;
      }
    }
    
    // 如果是错误题目，生成一个错误的答案
    let displayedResult = result;
    if (!isCorrect) {
      displayedResult = result + Math.floor(nextRandom() * 10) - 5;
      if (displayedResult < 0) displayedResult = Math.abs(displayedResult);
      if (displayedResult === result) displayedResult = result + 1;
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
