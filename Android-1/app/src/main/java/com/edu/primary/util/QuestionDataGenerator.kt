package com.edu.primary.util

import com.edu.primary.data.local.entity.QuestionEntity
import kotlin.random.Random

/**
 * 小学数学题生成器：按年级与数量生成单选、填空、判断题，支持加减乘除，难度与数字范围随年级变化。
 */
object QuestionDataGenerator {
    private val rnd get() = Random.Default

    /** 生成指定年级、数量的数学题；count 为 5 时保证包含单选/填空/判断各类型。 */
    fun generateMathQuestions(grade: Int, count: Int): List<QuestionEntity> {
        if (count == 5) return generateMathWithAllTypes(grade)
        return (1..count).mapNotNull { generateRandomMath(grade) }
    }

    /** 为 1–6 年级各生成 [questionsPerGrade] 道数学题并合并为列表。 */
    fun generateAllMathQuestions(questionsPerGrade: Int): List<QuestionEntity> =
        (AppConstants.MIN_GRADE..AppConstants.MAX_GRADE).flatMap {
            generateMathQuestions(it, questionsPerGrade)
        }

    private fun generateMathWithAllTypes(grade: Int): List<QuestionEntity> {
        val diff = minOf(grade, AppConstants.MAX_DIFFICULTY)
        return listOfNotNull(
            generateSingleChoice(grade, diff),
            generateSingleChoice(grade, diff),
            generateFillBlank(grade, diff),
            generateFillBlank(grade, diff),
            generateJudgment(grade, diff)
        )
    }

    private fun generateRandomMath(grade: Int): QuestionEntity? {
        val diff = minOf(grade, AppConstants.MAX_DIFFICULTY)
        return when (rnd.nextInt(3)) {
            0 -> generateSingleChoice(grade, diff)
            1 -> generateFillBlank(grade, diff)
            else -> generateJudgment(grade, diff)
        }
    }

    private fun maxNum(grade: Int) = when (grade) {
        1 -> 20; 2 -> 50; 3 -> 100; 4 -> 200; 5 -> 500; 6 -> 1000
        else -> 100
    }

    private fun generateSingleChoice(grade: Int, difficulty: Int): QuestionEntity {
        val maxN = maxNum(grade)
        val num1 = rnd.nextInt(maxN) + 1
        val num2 = rnd.nextInt(maxN) + 1
        val (op, result) = when {
            grade <= 2 -> if (rnd.nextBoolean()) "+" to num1 + num2
            else {
                val (a, b) = if (num1 >= num2) num1 to num2 else num2 to num1
                "-" to (a - b)
            }
            else -> when (rnd.nextInt(4)) {
                0 -> "+" to num1 + num2
                1 -> "-" to (if (num1 >= num2) num1 - num2 else num2 - num1)
                2 -> "×" to (num1 * num2)
                else -> {
                    val n2 = num2.coerceAtLeast(1)
                    val res = num1 / n2
                    "÷" to res
                }
            }
        }
        val (n1, n2, res) = when (op) {
            "÷" -> {
                val n2 = num2.coerceAtLeast(1)
                val res = num1 / n2
                Triple(res * n2, n2, res)
            }
            else -> Triple(num1, num2, result)
        }
        val content = "$n1 $op $n2 = ?"
        val options = (listOf(res.toString()) + (1..3).map {
            var w = res + rnd.nextInt(20) - 10
            if (w < 0) w = -w
            if (w == res) w += rnd.nextInt(5) + 1
            w.toString()
        }).shuffled(rnd)
        return QuestionEntity(
            subjectId = AppConstants.SUBJECT_MATH,
            grade = grade,
            type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE,
            content = content,
            options = options,
            correctAnswer = res.toString(),
            explanation = "$n1 $op $n2 = $res",
            difficulty = difficulty
        )
    }

    private fun generateFillBlank(grade: Int, difficulty: Int): QuestionEntity {
        val maxN = maxNum(grade)
        val num1 = rnd.nextInt(maxN) + 1
        val num2 = rnd.nextInt(maxN) + 1
        val (op, result, content) = when {
            grade <= 2 -> if (rnd.nextBoolean())
                Triple("+", num1 + num2, "$num1 + $num2 = (    )")
            else {
                val (a, b) = if (num1 >= num2) num1 to num2 else num2 to num1
                Triple("-", a - b, "$a - $b = (    )")
            }
            else -> when (rnd.nextInt(4)) {
                0 -> Triple("+", num1 + num2, "$num1 + $num2 = (    )")
                1 -> {
                    val (a, b) = if (num1 >= num2) num1 to num2 else num2 to num1
                    Triple("-", a - b, "$a - $b = (    )")
                }
                2 -> Triple("×", num1 * num2, "$num1 × $num2 = (    )")
                else -> {
                    val n2 = num2.coerceAtLeast(1)
                    val res = num1 / n2
                    Triple("÷", res, "${res * n2} ÷ $n2 = (    )")
                }
            }
        }
        return QuestionEntity(
            subjectId = AppConstants.SUBJECT_MATH,
            grade = grade,
            type = AppConstants.QUESTION_TYPE_FILL_BLANK,
            content = content,
            options = null,
            correctAnswer = result.toString(),
            explanation = content.replace("(    )", result.toString()),
            difficulty = difficulty
        )
    }

    private fun generateJudgment(grade: Int, difficulty: Int): QuestionEntity {
        val maxN = maxNum(grade)
        val num1 = rnd.nextInt(maxN) + 1
        val num2 = rnd.nextInt(maxN) + 1
        val actual = when (rnd.nextInt(4)) {
            0 -> num1 + num2
            1 -> if (num1 >= num2) num1 - num2 else num2 - num1
            2 -> num1 * num2
            else -> num1 / num2.coerceAtLeast(1)
        }
        val op = when (rnd.nextInt(4)) {
            0 -> "+"; 1 -> "-"; 2 -> "×"; else -> "÷"
        }
        val isCorrect = rnd.nextBoolean()
        val displayed = if (isCorrect) actual else actual + rnd.nextInt(10) - 5
        val content = "$num1 $op $num2 = $displayed"
        return QuestionEntity(
            subjectId = AppConstants.SUBJECT_MATH,
            grade = grade,
            type = AppConstants.QUESTION_TYPE_JUDGMENT,
            content = content,
            options = null,
            correctAnswer = if (isCorrect) "正确" else "错误",
            explanation = if (isCorrect) "$num1 $op $num2 = $actual，等式正确"
            else "$num1 $op $num2 = $actual，题目写的是 $displayed，等式错误",
            difficulty = difficulty
        )
    }
}
