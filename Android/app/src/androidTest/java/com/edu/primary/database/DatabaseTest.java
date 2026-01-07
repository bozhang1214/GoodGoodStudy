package com.edu.primary.database;

import android.content.Context;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.entity.AnswerEntity;
import com.edu.primary.database.entity.ChatMessageEntity;
import com.edu.primary.database.entity.QuestionEntity;
import com.edu.primary.database.entity.UserEntity;
import com.edu.primary.database.entity.WrongQuestionEntity;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.List;

import static org.junit.Assert.*;

/**
 * 数据库集成测试
 */
@RunWith(AndroidJUnit4.class)
public class DatabaseTest {

    private Context context;
    private AppDatabase database;

    @Before
    public void setUp() {
        context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        database = AppDatabase.getInstance(context);
    }

    @Test
    public void testDatabaseInstance() {
        assertNotNull("数据库实例不应为null", database);
        assertNotNull("UserDao不应为null", database.userDao());
        assertNotNull("QuestionDao不应为null", database.questionDao());
        assertNotNull("AnswerDao不应为null", database.answerDao());
        assertNotNull("WrongQuestionDao不应为null", database.wrongQuestionDao());
        assertNotNull("ChatMessageDao不应为null", database.chatMessageDao());
    }

    @Test
    public void testUserEntity_InsertAndQuery() {
        UserEntity user = new UserEntity();
        user.username = "testuser_" + System.currentTimeMillis();
        user.password = "password123";
        user.nickname = "Test User";
        user.createTime = System.currentTimeMillis();

        long userId = database.userDao().insertUser(user);
        assertTrue("用户ID应大于0", userId > 0);

        UserEntity retrievedUser = database.userDao().getUserByUsername(user.username);
        assertNotNull("应能通过用户名查询用户", retrievedUser);
        assertEquals("用户名应匹配", user.username, retrievedUser.username);
        assertEquals("密码应匹配", user.password, retrievedUser.password);
        assertEquals("昵称应匹配", user.nickname, retrievedUser.nickname);
    }

    @Test
    public void testQuestionEntity_InsertAndQuery() {
        QuestionEntity question = new QuestionEntity();
        question.subjectId = AppConstants.SUBJECT_MATH;
        question.grade = 1;
        question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
        question.content = "1 + 1 = ?";
        question.correctAnswer = "2";
        question.difficulty = 1;

        long questionId = database.questionDao().insertQuestion(question);
        assertTrue("题目ID应大于0", questionId > 0);

        QuestionEntity retrievedQuestion = database.questionDao().getQuestionById(questionId);
        assertNotNull("应能通过ID查询题目", retrievedQuestion);
        assertEquals("题目内容应匹配", question.content, retrievedQuestion.content);
        assertEquals("正确答案应匹配", question.correctAnswer, retrievedQuestion.correctAnswer);
        assertEquals("年级应匹配", question.grade, retrievedQuestion.grade);
    }

    @Test
    public void testAnswerEntity_InsertAndQuery() {
        // 先创建用户和题目
        UserEntity user = new UserEntity();
        user.username = "answeruser_" + System.currentTimeMillis();
        user.password = "password";
        user.nickname = "Answer User";
        long userId = database.userDao().insertUser(user);

        QuestionEntity question = new QuestionEntity();
        question.subjectId = AppConstants.SUBJECT_MATH;
        question.grade = 1;
        question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
        question.content = "2 + 2 = ?";
        question.correctAnswer = "4";
        long questionId = database.questionDao().insertQuestion(question);

        // 创建答案
        AnswerEntity answer = new AnswerEntity();
        answer.userId = userId;
        answer.questionId = questionId;
        answer.userAnswer = "4";
        answer.isCorrect = true;
        answer.answerTime = System.currentTimeMillis();

        long answerId = database.answerDao().insertAnswer(answer);
        assertTrue("答案ID应大于0", answerId > 0);

        AnswerEntity retrievedAnswer = database.answerDao().getAnswer(userId, questionId);
        assertNotNull("应能查询答案", retrievedAnswer);
        assertEquals("用户答案应匹配", answer.userAnswer, retrievedAnswer.userAnswer);
        assertEquals("是否正确应匹配", answer.isCorrect, retrievedAnswer.isCorrect);
    }

    @Test
    public void testWrongQuestionEntity_InsertAndQuery() {
        // 先创建用户和题目
        UserEntity user = new UserEntity();
        user.username = "wronguser_" + System.currentTimeMillis();
        user.password = "password";
        user.nickname = "Wrong User";
        long userId = database.userDao().insertUser(user);

        QuestionEntity question = new QuestionEntity();
        question.subjectId = AppConstants.SUBJECT_MATH;
        question.grade = 1;
        question.type = AppConstants.QUESTION_TYPE_SINGLE_CHOICE;
        question.content = "3 + 3 = ?";
        question.correctAnswer = "6";
        long questionId = database.questionDao().insertQuestion(question);

        // 创建错题
        WrongQuestionEntity wrongQuestion = new WrongQuestionEntity();
        wrongQuestion.userId = userId;
        wrongQuestion.questionId = questionId;
        wrongQuestion.userAnswer = "5";
        wrongQuestion.wrongTime = System.currentTimeMillis();
        wrongQuestion.reviewCount = 0;

        long wrongQuestionId = database.wrongQuestionDao().insertWrongQuestion(wrongQuestion);
        assertTrue("错题ID应大于0", wrongQuestionId > 0);

        WrongQuestionEntity retrieved = database.wrongQuestionDao().getWrongQuestion(userId, questionId);
        assertNotNull("应能查询错题", retrieved);
        assertEquals("用户答案应匹配", wrongQuestion.userAnswer, retrieved.userAnswer);
        assertEquals("复习次数应匹配", wrongQuestion.reviewCount, retrieved.reviewCount);
    }

    @Test
    public void testChatMessageEntity_InsertAndQuery() {
        // 先创建用户
        UserEntity user = new UserEntity();
        user.username = "chatuser_" + System.currentTimeMillis();
        user.password = "password";
        user.nickname = "Chat User";
        long userId = database.userDao().insertUser(user);

        // 创建聊天消息
        ChatMessageEntity message = new ChatMessageEntity();
        message.userId = userId;
        message.role = AppConstants.ROLE_USER;
        message.content = "测试消息";
        message.timestamp = System.currentTimeMillis();

        long messageId = database.chatMessageDao().insertMessage(message);
        assertTrue("消息ID应大于0", messageId > 0);

        List<ChatMessageEntity> messages = database.chatMessageDao().getMessagesByUser(userId);
        assertNotNull("消息列表不应为null", messages);
        assertTrue("应至少有一条消息", messages.size() > 0);
    }
}
