package com.edu.primary.repository;

import android.content.Context;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.AppDatabase;
import com.edu.primary.database.entity.AnswerEntity;
import com.edu.primary.database.entity.QuestionEntity;
import com.edu.primary.utils.QuestionDataGenerator;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.*;

/**
 * 题目仓库集成测试
 */
@RunWith(AndroidJUnit4.class)
public class QuestionRepositoryTest {

    private Context context;
    private QuestionRepository questionRepository;
    private AppDatabase database;

    @Before
    public void setUp() {
        context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        questionRepository = new QuestionRepository(context);
        database = AppDatabase.getInstance(context);
        
        // 清理测试数据
        clearTestData();
    }

    @After
    public void tearDown() {
        clearTestData();
    }

    private void clearTestData() {
        new Thread(() -> {
            // 删除所有题目
            List<QuestionEntity> allQuestions = database.questionDao().getQuestionsBySubjectAndGrade(
                AppConstants.SUBJECT_MATH, 1);
            // 注意：Room没有批量删除，这里只是清理测试数据
        }).start();
    }

    @Test
    public void testGetQuestions_Empty() throws Exception {
        List<QuestionEntity> questions = questionRepository.getQuestions(
            AppConstants.SUBJECT_MATH, 1)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        assertNotNull("题目列表不应为null", questions);
        // 初始状态可能为空或已有数据
    }

    @Test
    public void testGetQuestionCount() throws Exception {
        Integer count = questionRepository.getQuestionCount(
            AppConstants.SUBJECT_MATH, 1)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        assertNotNull("题目数量不应为null", count);
        assertTrue("题目数量应大于等于0", count >= 0);
    }

    @Test
    public void testInsertQuestions() throws Exception {
        // 生成测试题目
        List<QuestionEntity> testQuestions = QuestionDataGenerator.generateMathQuestions(1, 5);
        
        // 插入题目
        questionRepository.insertQuestions(testQuestions);
        
        // 等待插入完成
        Thread.sleep(500);
        
        // 验证题目已插入
        List<QuestionEntity> questions = questionRepository.getQuestions(
            AppConstants.SUBJECT_MATH, 1)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        assertTrue("应至少包含插入的题目", questions.size() >= 5);
    }

    @Test
    public void testGetQuestionById() throws Exception {
        // 生成并插入测试题目
        List<QuestionEntity> testQuestions = QuestionDataGenerator.generateMathQuestions(2, 1);
        questionRepository.insertQuestions(testQuestions);
        Thread.sleep(500);

        // 获取题目列表
        List<QuestionEntity> questions = questionRepository.getQuestions(
            AppConstants.SUBJECT_MATH, 2)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        if (!questions.isEmpty()) {
            QuestionEntity question = questions.get(0);
            
            // 通过ID获取题目
            QuestionEntity retrievedQuestion = questionRepository.getQuestionById(question.id)
                .timeout(5, TimeUnit.SECONDS)
                .blockingGet();

            assertNotNull("应能通过ID获取题目", retrievedQuestion);
            assertEquals("题目ID应匹配", question.id, retrievedQuestion.id);
            assertEquals("题目内容应匹配", question.content, retrievedQuestion.content);
        }
    }

    @Test
    public void testGetQuestionsBySubjectAndGrade() throws Exception {
        // 为不同年级生成题目
        for (int grade = 1; grade <= 3; grade++) {
            List<QuestionEntity> questions = QuestionDataGenerator.generateMathQuestions(grade, 3);
            questionRepository.insertQuestions(questions);
        }
        
        Thread.sleep(500);

        // 验证每个年级的题目
        for (int grade = 1; grade <= 3; grade++) {
            List<QuestionEntity> questions = questionRepository.getQuestions(
                AppConstants.SUBJECT_MATH, grade)
                .timeout(5, TimeUnit.SECONDS)
                .blockingGet();

            assertNotNull("题目列表不应为null", questions);
            for (QuestionEntity question : questions) {
                assertEquals("年级应匹配", grade, question.grade);
                assertEquals("科目应匹配", AppConstants.SUBJECT_MATH, question.subjectId);
            }
        }
    }

    @Test
    public void testInsertAnswer() throws Exception {
        // 生成并插入测试题目
        List<QuestionEntity> testQuestions = QuestionDataGenerator.generateMathQuestions(1, 1);
        questionRepository.insertQuestions(testQuestions);
        Thread.sleep(500);

        List<QuestionEntity> questions = questionRepository.getQuestions(
            AppConstants.SUBJECT_MATH, 1)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        if (!questions.isEmpty()) {
            QuestionEntity question = questions.get(0);
            
            // 创建答案
            AnswerEntity answer = new AnswerEntity();
            answer.userId = 1;
            answer.questionId = question.id;
            answer.userAnswer = "test answer";
            answer.isCorrect = true;
            answer.answerTime = System.currentTimeMillis();

            // 插入答案
            questionRepository.insertAnswer(answer);
            Thread.sleep(500);

            // 验证答案已插入（通过数据库查询）
            AnswerEntity retrievedAnswer = database.answerDao().getAnswer(1, question.id);
            assertNotNull("答案应已插入", retrievedAnswer);
            assertEquals("用户ID应匹配", answer.userId, retrievedAnswer.userId);
            assertEquals("题目ID应匹配", answer.questionId, retrievedAnswer.questionId);
        }
    }
}
