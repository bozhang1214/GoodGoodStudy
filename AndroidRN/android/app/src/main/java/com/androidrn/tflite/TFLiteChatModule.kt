package com.androidrn.tflite

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.tensorflow.lite.Interpreter
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel

/**
 * 端侧 TFLite 人机对话：优先使用 intent_classifier.tflite 做意图分类并生成回复，
 * 无模型时使用内置规则回复（与 JS ruleBased 一致）。
 */
class TFLiteChatModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "TFLiteChat"

    companion object {
        private const val MODEL_NAME = "intent_classifier.tflite"
        private const val NUM_FEATURES = 32
        private const val NUM_CLASSES = 4
        // 与 export_intent_model.py 中 KEYWORDS 顺序一致
        private val KEYWORDS = arrayOf(
            "你好", "hello", "hi", "嗨", "早上", "下午", "晚上",
            "数学", "算式", "计算", "加减", "乘除", "应用题",
            "语文", "英语", "总结", "概括", "讲解", "题目",
            "谢谢", "感谢", "多谢", "不客气",
            "练习", "做题", "错题", "进度", "设置",
            "再见", "拜拜", "再会"
        )
        private val INTENTS = arrayOf("greet", "math", "thanks", "other")
    }

    private var interpreter: Interpreter? = null
    private var modelLoaded = false

    init {
        loadModelIfPresent()
    }

    private fun loadModelIfPresent() {
        try {
            val ctx = reactApplicationContext
            val assetPath = MODEL_NAME
            val file = File(ctx.cacheDir, MODEL_NAME)
            if (!file.exists()) {
                ctx.assets.open(assetPath).use { input ->
                    FileOutputStream(file).use { output ->
                        input.copyTo(output)
                    }
                }
            }
            val buffer = loadModelFile(file)
            interpreter = Interpreter(buffer)
            modelLoaded = true
        } catch (_: Exception) {
            modelLoaded = false
        }
    }

    private fun loadModelFile(file: File): MappedByteBuffer {
        FileInputStream(file).use { fis ->
            val channel = fis.channel
            val startOffset = 0L
            val declaredLength = channel.size()
            return channel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
        }
    }

    private fun textToFeatures(text: String): FloatArray {
        val t = text.lowercase().trim()
        val out = FloatArray(NUM_FEATURES)
        for (i in KEYWORDS.indices) {
            if (t.contains(KEYWORDS[i].lowercase())) out[i] = 1f
        }
        return out
    }

    private fun replyFromIntent(intent: String, userMessage: String, historySize: Int): String {
        return when (intent) {
            "greet" -> "你好！我是小学课后辅导小助手。可以问我语文、数学、英语的题目，也可以让我帮你总结、讲解知识点。"
            "math" -> "数学题可以在这里的「练习」里做，做完会有批改和解析。有不懂的题目把题目发给我，我帮你讲。"
            "thanks" -> "不客气，继续加油！有不会的随时问我。"
            "other" -> "我收到了你的消息。我这边是离线小助手，复杂问题建议在「练习」里多做题、看解析。简单问题可以再问我试试～（对话数: $historySize）"
            else -> ruleBasedReply(userMessage, historySize)
        }
    }

    private fun ruleBasedReply(userMessage: String, historySize: Int): String {
        val msg = userMessage.trim()
        if (msg.isEmpty()) return "请输入你的问题哦～"
        val lower = msg.lowercase()
        if (lower.contains("你好") || lower.contains("hello") || lower.contains("hi")) {
            return "你好！我是小学课后辅导小助手。可以问我语文、数学、英语的题目，也可以让我帮你总结、讲解知识点。"
        }
        if (lower.contains("数学") || lower.contains("算式") || lower.contains("计算")) {
            return "数学题可以在这里的「练习」里做，做完会有批改和解析。有不懂的题目把题目发给我，我帮你讲。"
        }
        if (lower.contains("总结") || lower.contains("概括")) {
            return "把要总结的内容发给我，我会按「要点 + 结论」的结构帮你整理。"
        }
        if (lower.contains("谢谢")) {
            return "不客气，继续加油！有不会的随时问我。"
        }
        return "我收到了：「$msg」。我这边是离线小助手，复杂问题建议在「练习」里多做题、看解析。简单问题可以再问我试试～（对话数: $historySize）"
    }

    @ReactMethod
    fun getReply(userMessage: String, historySize: Int, promise: Promise) {
        try {
            val msg = userMessage.trim()
            if (msg.isEmpty()) {
                promise.resolve("请输入你的问题哦～")
                return
            }
            if (modelLoaded && interpreter != null) {
                val input = textToFeatures(msg)
                // 输入形状 (1, NUM_FEATURES)，输出 (1, NUM_CLASSES)
                val inputBatch = Array(1) { input }
                val output = Array(1) { FloatArray(NUM_CLASSES) }
                interpreter!!.run(inputBatch, output)
                var maxIdx = 0
                for (i in 1 until NUM_CLASSES) {
                    if (output[0][i] > output[0][maxIdx]) maxIdx = i
                }
                val intent = INTENTS[maxIdx]
                promise.resolve(replyFromIntent(intent, msg, historySize))
            } else {
                promise.resolve(ruleBasedReply(msg, historySize))
            }
        } catch (e: Exception) {
            promise.resolve(ruleBasedReply(userMessage, 0))
        }
    }

    @ReactMethod
    fun isModelLoaded(promise: Promise) {
        promise.resolve(modelLoaded)
    }
}
