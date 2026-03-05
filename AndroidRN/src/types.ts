/** 与 Android-1 Entity 对齐 */
export interface User {
  id: number;
  username: string;
  password: string;
  nickname: string;
  createTime: number;
}

export interface Question {
  id: string;
  subjectId: number;
  grade: number;
  type: string;
  content: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string | null;
  difficulty: number;
}

export interface Answer {
  id: string;
  userId: number;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  answerTime: number;
}

export interface WrongQuestion {
  id: string;
  userId: number;
  question: Question;
  userAnswer: string;
  wrongTime: number;
  reviewCount: number;
}

export interface ChatMessage {
  id: string;
  userId: number;
  role: string;
  content: string;
  timestamp: number;
}

export interface ProgressData {
  total: number;
  correct: number;
  accuracy: number;
}
