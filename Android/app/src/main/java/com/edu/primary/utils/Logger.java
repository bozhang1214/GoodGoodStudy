package com.edu.primary.utils;

import android.util.Log;
import com.edu.primary.BuildConfig;

/**
 * 日志工具类（统一日志管理）
 * 提供统一的日志记录接口，便于调试和错误追踪
 * Release版本自动禁用调试日志
 */
public class Logger {
    
    private static final String TAG = "GoodGoodStudy";
    // Release版本自动禁用调试日志，减少性能开销
    private static final boolean DEBUG = BuildConfig.DEBUG;
    
    private Logger() {
        // 工具类，禁止实例化
    }
    
    /**
     * 记录调试信息
     */
    public static void d(String message) {
        if (DEBUG) {
            Log.d(TAG, message);
        }
    }
    
    /**
     * 记录调试信息（带标签）
     */
    public static void d(String tag, String message) {
        if (DEBUG) {
            Log.d(TAG, "[" + tag + "] " + message);
        }
    }
    
    /**
     * 记录信息
     */
    public static void i(String message) {
        Log.i(TAG, message);
    }
    
    /**
     * 记录信息（带标签）
     */
    public static void i(String tag, String message) {
        Log.i(TAG, "[" + tag + "] " + message);
    }
    
    /**
     * 记录警告
     */
    public static void w(String message) {
        Log.w(TAG, message);
    }
    
    /**
     * 记录警告（带标签）
     */
    public static void w(String tag, String message) {
        Log.w(TAG, "[" + tag + "] " + message);
    }
    
    /**
     * 记录错误
     */
    public static void e(String message) {
        Log.e(TAG, message);
    }
    
    /**
     * 记录错误（带标签和异常）
     */
    public static void e(String tag, String message, Throwable throwable) {
        Log.e(TAG, "[" + tag + "] " + message, throwable);
    }
    
    /**
     * 记录错误（带异常）
     */
    public static void e(String message, Throwable throwable) {
        Log.e(TAG, message, throwable);
    }
}
