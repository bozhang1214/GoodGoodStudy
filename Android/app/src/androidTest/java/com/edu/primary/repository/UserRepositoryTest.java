package com.edu.primary.repository;

import android.content.Context;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import com.edu.primary.database.AppDatabase;
import com.edu.primary.database.entity.UserEntity;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.*;

/**
 * 用户仓库集成测试
 */
@RunWith(AndroidJUnit4.class)
public class UserRepositoryTest {

    private Context context;
    private UserRepository userRepository;
    private AppDatabase database;

    @Before
    public void setUp() {
        context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        userRepository = new UserRepository(context);
        database = AppDatabase.getInstance(context);
        
        // 清理测试数据
        clearTestData();
    }

    @After
    public void tearDown() {
        clearTestData();
    }

    private void clearTestData() {
        // 清理SharedPreferences
        context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE).edit().clear().apply();
    }

    @Test
    public void testRegister_Success() throws Exception {
        String username = "testuser_" + System.currentTimeMillis();
        String password = "password123";
        String nickname = "Test User";

        Long userId = userRepository.register(username, password, nickname)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        assertNotNull("注册应返回用户ID", userId);
        assertTrue("用户ID应大于0", userId > 0);
    }

    @Test
    public void testRegister_DuplicateUsername() {
        String username = "duplicate_" + System.currentTimeMillis();
        String password = "password123";
        String nickname = "Test User";

        try {
            // 第一次注册应该成功
            userRepository.register(username, password, nickname)
                .timeout(5, TimeUnit.SECONDS)
                .blockingGet();

            // 第二次注册相同用户名应该失败
            userRepository.register(username, password, nickname)
                .timeout(5, TimeUnit.SECONDS)
                .blockingGet();

            fail("应该抛出用户名已存在的异常");
        } catch (Exception e) {
            assertTrue("异常消息应包含用户名已存在", 
                e.getMessage().contains("username_exists") || 
                e.getMessage().contains("用户名"));
        }
    }

    @Test
    public void testLogin_Success() throws Exception {
        String username = "loginuser_" + System.currentTimeMillis();
        String password = "password123";
        String nickname = "Login User";

        // 先注册
        userRepository.register(username, password, nickname)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        // 再登录
        UserEntity user = userRepository.login(username, password)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        assertNotNull("登录应返回用户", user);
        assertEquals("用户名应匹配", username, user.username);
        assertEquals("密码应匹配", password, user.password);
        assertEquals("昵称应匹配", nickname, user.nickname);
    }

    @Test
    public void testLogin_UserNotFound() {
        String username = "nonexistent_" + System.currentTimeMillis();
        String password = "password123";

        try {
            userRepository.login(username, password)
                .timeout(5, TimeUnit.SECONDS)
                .blockingGet();
            fail("应该抛出用户不存在的异常");
        } catch (Exception e) {
            assertTrue("异常消息应包含用户不存在", 
                e.getMessage().contains("user_not_found") || 
                e.getMessage().contains("用户"));
        }
    }

    @Test
    public void testLogin_WrongPassword() throws Exception {
        String username = "wrongpass_" + System.currentTimeMillis();
        String password = "password123";
        String wrongPassword = "wrongpassword";
        String nickname = "Test User";

        // 先注册
        userRepository.register(username, password, nickname)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        // 使用错误密码登录
        try {
            userRepository.login(username, wrongPassword)
                .timeout(5, TimeUnit.SECONDS)
                .blockingGet();
            fail("应该抛出密码错误的异常");
        } catch (Exception e) {
            assertTrue("异常消息应包含密码错误", 
                e.getMessage().contains("password_wrong") || 
                e.getMessage().contains("密码"));
        }
    }

    @Test
    public void testIsLoggedIn() throws Exception {
        // 初始状态应该未登录
        assertFalse("初始状态应未登录", userRepository.isLoggedIn());

        // 注册并登录
        String username = "logintest_" + System.currentTimeMillis();
        String password = "password123";
        String nickname = "Test User";

        userRepository.register(username, password, nickname)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        userRepository.login(username, password)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        // 登录后应该已登录
        assertTrue("登录后应已登录", userRepository.isLoggedIn());
    }

    @Test
    public void testLogout() throws Exception {
        // 注册并登录
        String username = "logouttest_" + System.currentTimeMillis();
        String password = "password123";
        String nickname = "Test User";

        userRepository.register(username, password, nickname)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        userRepository.login(username, password)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        assertTrue("登录后应已登录", userRepository.isLoggedIn());

        // 登出
        userRepository.logout();

        // 登出后应该未登录
        assertFalse("登出后应未登录", userRepository.isLoggedIn());
    }

    @Test
    public void testGetCurrentUserId() throws Exception {
        // 初始状态用户ID应为-1
        assertEquals("初始用户ID应为-1", -1, userRepository.getCurrentUserId());

        // 注册并登录
        String username = "useridtest_" + System.currentTimeMillis();
        String password = "password123";
        String nickname = "Test User";

        Long userId = userRepository.register(username, password, nickname)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        userRepository.login(username, password)
            .timeout(5, TimeUnit.SECONDS)
            .blockingGet();

        // 登录后用户ID应匹配
        assertEquals("当前用户ID应匹配", userId.longValue(), userRepository.getCurrentUserId());
    }
}
