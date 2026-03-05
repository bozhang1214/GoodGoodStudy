package com.edu.primary.ai

import java.util.Locale

/**
 * 规则回退：无 TFLite 模型时提供小学辅导场景的固定回复。
 * 参考 aiAssistant 的 RuleBasedTextGenerator，适配小学课后练习场景。
 */
object RuleBasedTextGenerator {
    /**
     * 根据用户消息关键词返回预设回复；无法匹配时返回通用提示（含 historySize 信息）。
     * @param userMessage 用户输入
     * @param historySize 当前对话条数，用于回退回复中展示
     * @return 助手回复文本
     */
    fun chat(userMessage: String, historySize: Int): String {
        val msg = userMessage.trim().ifEmpty { return "请输入你的问题哦～" }
        val lower = msg.lowercase(Locale.getDefault())

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
}
