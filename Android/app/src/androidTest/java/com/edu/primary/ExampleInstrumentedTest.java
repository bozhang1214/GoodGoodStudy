package com.edu.primary;

import android.content.Context;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import org.junit.Test;
import org.junit.runner.RunWith;

import static org.junit.Assert.*;

/**
 * 示例集成测试
 * 
 * 集成测试需要Android环境，会在设备或模拟器上运行。
 * 包括：
 * - 数据库操作测试
 * - Repository层测试
 * - UI组件测试
 * 
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {
    @Test
    public void useAppContext() {
        // Context of the app under test.
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("应用包名应匹配", "com.edu.primary", appContext.getPackageName());
    }

    @Test
    public void testContextNotNull() {
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertNotNull("应用Context不应为null", appContext);
        assertNotNull("应用包名不应为null", appContext.getPackageName());
    }
}