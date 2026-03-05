package com.edu.primary.util

import android.util.Log
import com.edu.primary.BuildConfig

private const val TAG = "GoodGoodStudy"

/**
 * 统一日志封装，DEBUG 下输出 d，w/e 始终输出；所有日志带统一 TAG 与子 tag。
 */
object Logger {
    /** Debug 日志，仅 DEBUG 构建时输出。 */
    fun d(tag: String, msg: String) {
        if (BuildConfig.DEBUG) Log.d(TAG, "[$tag] $msg")
    }
    /** Warning 日志。 */
    fun w(tag: String, msg: String) = Log.w(TAG, "[$tag] $msg")
    /** Error 日志，可选附带异常。 */
    fun e(tag: String, msg: String, t: Throwable? = null) {
        if (t != null) Log.e(TAG, "[$tag] $msg", t) else Log.e(TAG, "[$tag] $msg")
    }
}
