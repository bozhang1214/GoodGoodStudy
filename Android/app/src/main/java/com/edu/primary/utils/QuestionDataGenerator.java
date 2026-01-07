package com.edu.primary.utils;

import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.entity.QuestionEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class QuestionDataGenerator {
    private static final Random random = new Random();

    /**
     * 生成指定数量的数学题目
     * @param grade 年级 (1-6)
     * @param count 题目数量
     * @return 题目列表
     */
    public static List<QuestionEntity> generateMathQuestions(int grade, int count) {
        List<QuestionEntity> questions = new ArrayList<>();
        
        // 如果数量为5，确保覆盖所有题型（2道单选、2道填空、1道判断）
        if (count == 5) {
            return generateMathQuestionsWithAllTypes(grade);
        }
        
        // 其他数量随机生成
        for (int i = 0; i < count; i++) {
            QuestionEntity question = generateRandomMathQuestion(grade);
            if (question != null) {
                questions.add(question);
            }
        }
        
        return questions;
    }

    /**
     * 生成覆盖所有题型的数学题目（5道题：2道单选、2道填空、1道判断）
     * @param grade 年级 (1-6)
     * @return 题目列表
     */
    private static List<QuestionEntity> generateMathQuestionsWithAllTypes(int grade) {
        List<QuestionEntity> questions = new ArrayList<>();
        
        // 2道单选题
        for (int i = 0; i < 2; i++) {
            QuestionEntity question = new QuestionEntity();
            question.subjectId = AppConstants.SUBJECT_MATH;
            question.grade = grade;
            question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
            QuestionEntity singleChoice = generateSingleChoiceQuestion(question, grade);
            if (singleChoice != null) {
                questions.add(singleChoice);
            }
        }
        
        // 2道填空题
        for (int i = 0; i < 2; i++) {
            QuestionEntity question = new QuestionEntity();
            question.subjectId = AppConstants.SUBJECT_MATH;
            question.grade = grade;
            question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
            QuestionEntity fillBlank = generateFillBlankQuestion(question, grade);
            if (fillBlank != null) {
                questions.add(fillBlank);
            }
        }
        
        // 1道判断题
        QuestionEntity question = new QuestionEntity();
        question.subjectId = AppConstants.SUBJECT_MATH;
        question.grade = grade;
        question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
        QuestionEntity judgment = generateJudgmentQuestion(question, grade);
        if (judgment != null) {
            questions.add(judgment);
        }
        
        return questions;
    }

    /**
     * 生成随机数学题目
     */
    private static QuestionEntity generateRandomMathQuestion(int grade) {
        QuestionEntity question = new QuestionEntity();
        question.subjectId = AppConstants.SUBJECT_MATH;
        question.grade = grade;
        question.difficulty = Math.min(grade, AppConstants.MAX_DIFFICULTY);
        
        // 随机选择题目类型
        int typeIndex = random.nextInt(3);
        switch (typeIndex) {
            case 0:
                return generateSingleChoiceQuestion(question, grade);
            case 1:
                return generateFillBlankQuestion(question, grade);
            case 2:
                return generateJudgmentQuestion(question, grade);
            default:
                return generateSingleChoiceQuestion(question, grade);
        }
    }

    /**
     * 生成选择题
     */
    private static QuestionEntity generateSingleChoiceQuestion(QuestionEntity question, int grade) {
        question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
        
        int num1, num2, result;
        String operator;
        int maxNum = getMaxNumber(grade);
        
        // 根据年级生成不同难度的题目
        if (grade <= 2) {
            // 1-2年级：简单加减法
            num1 = random.nextInt(maxNum) + 1;
            num2 = random.nextInt(maxNum) + 1;
            if (random.nextBoolean()) {
                operator = "+";
                result = num1 + num2;
            } else {
                operator = "-";
                if (num1 < num2) {
                    int temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                result = num1 - num2;
            }
        } else if (grade <= 4) {
            // 3-4年级：加减乘除
            int op = random.nextInt(4);
            num1 = random.nextInt(maxNum) + 1;
            num2 = random.nextInt(maxNum) + 1;
            switch (op) {
                case 0:
                    operator = "+";
                    result = num1 + num2;
                    break;
                case 1:
                    operator = "-";
                    if (num1 < num2) {
                        int temp = num1;
                        num1 = num2;
                        num2 = temp;
                    }
                    result = num1 - num2;
                    break;
                case 2:
                    operator = "×";
                    result = num1 * num2;
                    break;
                default:
                    operator = "÷";
                    if (num2 == 0) num2 = 1;
                    result = num1 / num2;
                    num1 = result * num2; // 确保能整除
                    break;
            }
        } else {
            // 5-6年级：复杂运算
            int op = random.nextInt(4);
            num1 = random.nextInt(maxNum) + 10;
            num2 = random.nextInt(maxNum) + 1;
            switch (op) {
                case 0:
                    operator = "+";
                    result = num1 + num2;
                    break;
                case 1:
                    operator = "-";
                    if (num1 < num2) {
                        int temp = num1;
                        num1 = num2;
                        num2 = temp;
                    }
                    result = num1 - num2;
                    break;
                case 2:
                    operator = "×";
                    result = num1 * num2;
                    break;
                default:
                    operator = "÷";
                    if (num2 == 0) num2 = 1;
                    int quotient = num1 / num2;
                    num1 = quotient * num2;
                    result = quotient;
                    break;
            }
        }
        
        question.content = num1 + " " + operator + " " + num2 + " = ?";
        question.correctAnswer = String.valueOf(result);
        
        // 生成选项（包含正确答案和3个错误答案）
        List<String> options = new ArrayList<>();
        options.add(question.correctAnswer);
        
        // 生成错误选项
        for (int i = 0; i < 3; i++) {
            int wrongAnswer = result + random.nextInt(20) - 10;
            if (wrongAnswer < 0) wrongAnswer = Math.abs(wrongAnswer);
            if (wrongAnswer == result) wrongAnswer += random.nextInt(5) + 1;
            options.add(String.valueOf(wrongAnswer));
        }
        
        // 打乱选项顺序
        Collections.shuffle(options);
        question.options = options;
        question.explanation = num1 + " " + operator + " " + num2 + " = " + result;
        
        return question;
    }

    /**
     * 生成填空题
     */
    private static QuestionEntity generateFillBlankQuestion(QuestionEntity question, int grade) {
        question.type = AppConstants.QUESTION_TYPE_FILL_BLANK;
        
        int num1, num2, result;
        String operator;
        int maxNum = getMaxNumber(grade);
        
        if (grade <= 2) {
            num1 = random.nextInt(maxNum) + 1;
            num2 = random.nextInt(maxNum) + 1;
            if (random.nextBoolean()) {
                operator = "+";
                result = num1 + num2;
                question.content = num1 + " + " + num2 + " = (    )";
            } else {
                operator = "-";
                if (num1 < num2) {
                    int temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                result = num1 - num2;
                question.content = num1 + " - " + num2 + " = (    )";
            }
        } else if (grade <= 4) {
            int op = random.nextInt(4);
            num1 = random.nextInt(maxNum) + 1;
            num2 = random.nextInt(maxNum) + 1;
            switch (op) {
                case 0:
                    operator = "+";
                    result = num1 + num2;
                    question.content = num1 + " + " + num2 + " = (    )";
                    break;
                case 1:
                    operator = "-";
                    if (num1 < num2) {
                        int temp = num1;
                        num1 = num2;
                        num2 = temp;
                    }
                    result = num1 - num2;
                    question.content = num1 + " - " + num2 + " = (    )";
                    break;
                case 2:
                    operator = "×";
                    result = num1 * num2;
                    question.content = num1 + " × " + num2 + " = (    )";
                    break;
                default:
                    operator = "÷";
                    if (num2 == 0) num2 = 1;
                    result = num1 / num2;
                    num1 = result * num2; // 确保能整除
                    question.content = num1 + " ÷ " + num2 + " = (    )";
                    break;
            }
        } else {
            int op = random.nextInt(4);
            num1 = random.nextInt(maxNum) + 10;
            num2 = random.nextInt(maxNum) + 1;
            switch (op) {
                case 0:
                    operator = "+";
                    result = num1 + num2;
                    question.content = num1 + " + " + num2 + " = (    )";
                    break;
                case 1:
                    operator = "-";
                    if (num1 < num2) {
                        int temp = num1;
                        num1 = num2;
                        num2 = temp;
                    }
                    result = num1 - num2;
                    question.content = num1 + " - " + num2 + " = (    )";
                    break;
                case 2:
                    operator = "×";
                    result = num1 * num2;
                    question.content = num1 + " × " + num2 + " = (    )";
                    break;
                default:
                    operator = "÷";
                    if (num2 == 0) num2 = 1;
                    int quotient = num1 / num2;
                    num1 = quotient * num2;
                    result = quotient;
                    question.content = num1 + " ÷ " + num2 + " = (    )";
                    break;
            }
        }
        
        question.correctAnswer = String.valueOf(result);
        question.explanation = num1 + " " + operator + " " + num2 + " = " + result;
        
        return question;
    }

    /**
     * 生成判断题
     */
    private static QuestionEntity generateJudgmentQuestion(QuestionEntity question, int grade) {
        question.type = AppConstants.QUESTION_TYPE_JUDGMENT;
        
        int num1, num2, result;
        String operator;
        boolean isCorrect = random.nextBoolean();
        int maxNum = getMaxNumber(grade);
        
        if (grade <= 2) {
            num1 = random.nextInt(maxNum) + 1;
            num2 = random.nextInt(maxNum) + 1;
            if (random.nextBoolean()) {
                operator = "+";
                result = num1 + num2;
            } else {
                operator = "-";
                if (num1 < num2) {
                    int temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                result = num1 - num2;
            }
        } else {
            int op = random.nextInt(4);
            num1 = random.nextInt(maxNum) + 1;
            num2 = random.nextInt(maxNum) + 1;
            switch (op) {
                case 0:
                    operator = "+";
                    result = num1 + num2;
                    break;
                case 1:
                    operator = "-";
                    if (num1 < num2) {
                        int temp = num1;
                        num1 = num2;
                        num2 = temp;
                    }
                    result = num1 - num2;
                    break;
                case 2:
                    operator = "×";
                    result = num1 * num2;
                    break;
                default:
                    operator = "÷";
                    if (num2 == 0) num2 = 1;
                    result = num1 / num2;
                    num1 = result * num2; // 确保能整除
                    break;
            }
        }
        
        // 如果是错误题目，生成一个错误的答案
        int displayedResult = result;
        if (!isCorrect) {
            displayedResult = result + random.nextInt(10) - 5;
            if (displayedResult < 0) displayedResult = Math.abs(displayedResult);
            if (displayedResult == result) displayedResult = result + 1;
        }
        
        question.content = num1 + " " + operator + " " + num2 + " = " + displayedResult;
        question.correctAnswer = isCorrect ? "正确" : "错误";
        question.explanation = isCorrect 
            ? (num1 + " " + operator + " " + num2 + " = " + result + "，所以这个等式是正确的")
            : (num1 + " " + operator + " " + num2 + " = " + result + "，但题目中写的是 " + displayedResult + "，所以这个等式是错误的");
        
        return question;
    }

    /**
     * 根据年级获取最大数字范围
     */
    private static int getMaxNumber(int grade) {
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
     * @return 所有题目列表
     */
    public static List<QuestionEntity> generateAllMathQuestions(int questionsPerGrade) {
        List<QuestionEntity> allQuestions = new ArrayList<>();
        
        for (int grade = AppConstants.MIN_GRADE; grade <= AppConstants.MAX_GRADE; grade++) {
            List<QuestionEntity> questions = generateMathQuestions(grade, questionsPerGrade);
            allQuestions.addAll(questions);
        }
        
        return allQuestions;
    }
}
