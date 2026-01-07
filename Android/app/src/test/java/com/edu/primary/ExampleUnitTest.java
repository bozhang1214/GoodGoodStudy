package com.edu.primary;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * 示例单元测试
 * 
 * 本项目的测试用例包括：
 * - 单元测试（test目录）：测试业务逻辑，不依赖Android框架
 * - 集成测试（androidTest目录）：测试需要Android环境的组件
 * 
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
public class ExampleUnitTest {
    @Test
    public void addition_isCorrect() {
        assertEquals(4, 2 + 2);
    }

    @Test
    public void testBasicMath() {
        assertEquals("加法测试", 5, 2 + 3);
        assertEquals("减法测试", 2, 5 - 3);
        assertEquals("乘法测试", 6, 2 * 3);
        assertEquals("除法测试", 2, 6 / 3);
    }
}