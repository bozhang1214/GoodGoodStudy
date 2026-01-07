/**
 * 题目模型
 */
export class Question {
  id: number = 0;
  subjectId: number = 0;
  grade: number = 0;
  type: string = ''; // single_choice, multiple_choice, fill_blank, judgment
  content: string = '';
  options: string[] = [];
  correctAnswer: string = '';
  explanation: string = '';
  difficulty: number = 1; // 1-5

  constructor() {
  }
}
