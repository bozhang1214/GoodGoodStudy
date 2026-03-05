import type {Question} from '../types';
import {
  SUBJECT_MATH,
  QUESTION_TYPE_SINGLE_CHOICE,
  QUESTION_TYPE_FILL_BLANK,
  QUESTION_TYPE_JUDGMENT,
  MAX_DIFFICULTY,
  MIN_GRADE,
  MAX_GRADE,
} from '../constants';

const rnd = () => Math.random();
const randInt = (max: number) => Math.floor(rnd() * max);
const randIntRange = (min: number, max: number) => min + randInt(max - min + 1);

function maxNum(grade: number): number {
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

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** 与 Android-1 QuestionDataGenerator 逻辑一致，生成数学题 */
export function generateMathQuestions(
  grade: number,
  count: number,
  idPrefix: string = 'q',
): Question[] {
  const diff = Math.min(grade, MAX_DIFFICULTY);
  if (count === 5) {
    return [
      generateSingleChoice(grade, diff, `${idPrefix}_0`),
      generateSingleChoice(grade, diff, `${idPrefix}_1`),
      generateFillBlank(grade, diff, `${idPrefix}_2`),
      generateFillBlank(grade, diff, `${idPrefix}_3`),
      generateJudgment(grade, diff, `${idPrefix}_4`),
    ];
  }
  const list: Question[] = [];
  const types = [
    () => generateSingleChoice(grade, diff, `${idPrefix}_${list.length}`),
    () => generateFillBlank(grade, diff, `${idPrefix}_${list.length}`),
    () => generateJudgment(grade, diff, `${idPrefix}_${list.length}`),
  ];
  for (let i = 0; i < count; i++) {
    const fn = types[randInt(3)]!;
    list.push(fn());
  }
  return list;
}

function generateSingleChoice(grade: number, difficulty: number, id: string): Question {
  const maxN = maxNum(grade);
  let num1 = randInt(maxN) + 1;
  let num2 = randInt(maxN) + 1;
  let op: string;
  let result: number;
  if (grade <= 2) {
    if (rnd() < 0.5) {
      op = '+';
      result = num1 + num2;
    } else {
      if (num1 < num2) [num1, num2] = [num2, num1];
      op = '-';
      result = num1 - num2;
    }
  } else {
    const which = randInt(4);
    if (which === 0) {
      op = '+';
      result = num1 + num2;
    } else if (which === 1) {
      if (num1 < num2) [num1, num2] = [num2, num1];
      op = '-';
      result = num1 - num2;
    } else if (which === 2) {
      op = '×';
      result = num1 * num2;
    } else {
      num2 = Math.max(1, num2);
      result = Math.floor(num1 / num2);
      num1 = result * num2;
      op = '÷';
    }
  }
  const content = `${num1} ${op} ${num2} = ?`;
  const options = [result.toString()];
  for (let i = 0; i < 3; i++) {
    let w = result + randIntRange(-10, 10);
    if (w < 0) w = -w;
    if (w === result) w += randInt(5) + 1;
    options.push(w.toString());
  }
  return {
    id,
    subjectId: SUBJECT_MATH,
    grade,
    type: QUESTION_TYPE_SINGLE_CHOICE,
    content,
    options: shuffle(options),
    correctAnswer: result.toString(),
    explanation: `${num1} ${op} ${num2} = ${result}`,
    difficulty,
  };
}

function generateFillBlank(grade: number, difficulty: number, id: string): Question {
  const maxN = maxNum(grade);
  const num1 = randInt(maxN) + 1;
  const num2 = randInt(maxN) + 1;
  let op: string;
  let result: number;
  let content: string;
  if (grade <= 2) {
    if (rnd() < 0.5) {
      op = '+';
      result = num1 + num2;
      content = `${num1} + ${num2} = (    )`;
    } else {
      const [a, b] = num1 >= num2 ? [num1, num2] : [num2, num1];
      op = '-';
      result = a - b;
      content = `${a} - ${b} = (    )`;
    }
  } else {
    const which = randInt(4);
    if (which === 0) {
      result = num1 + num2;
      content = `${num1} + ${num2} = (    )`;
    } else if (which === 1) {
      const [a, b] = num1 >= num2 ? [num1, num2] : [num2, num1];
      result = a - b;
      content = `${a} - ${b} = (    )`;
    } else if (which === 2) {
      result = num1 * num2;
      content = `${num1} × ${num2} = (    )`;
    } else {
      const n2 = Math.max(1, num2);
      result = Math.floor(num1 / n2);
      content = `${result * n2} ÷ ${n2} = (    )`;
    }
  }
  return {
    id,
    subjectId: SUBJECT_MATH,
    grade,
    type: QUESTION_TYPE_FILL_BLANK,
    content,
    options: null,
    correctAnswer: result.toString(),
    explanation: content.replace('(    )', result.toString()),
    difficulty,
  };
}

function generateJudgment(grade: number, difficulty: number, id: string): Question {
  const maxN = maxNum(grade);
  const num1 = randInt(maxN) + 1;
  const num2 = randInt(maxN) + 1;
  const actual =
    randInt(4) === 0
      ? num1 + num2
      : randInt(4) === 1
        ? (num1 >= num2 ? num1 - num2 : num2 - num1)
        : randInt(4) === 2
          ? num1 * num2
          : Math.floor(num1 / Math.max(1, num2));
  const ops = ['+', '-', '×', '÷'];
  const op = ops[randInt(4)]!;
  const isCorrect = rnd() < 0.5;
  const displayed = isCorrect ? actual : actual + randIntRange(-5, 5);
  const content = `${num1} ${op} ${num2} = ${displayed}`;
  return {
    id,
    subjectId: SUBJECT_MATH,
    grade,
    type: QUESTION_TYPE_JUDGMENT,
    content,
    options: null,
    correctAnswer: isCorrect ? '正确' : '错误',
    explanation: isCorrect
      ? `${num1} ${op} ${num2} = ${actual}，等式正确`
      : `${num1} ${op} ${num2} = ${actual}，题目写的是 ${displayed}，等式错误`,
    difficulty,
  };
}
