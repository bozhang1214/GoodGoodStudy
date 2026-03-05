/** 与 Android-1 RuleBasedTextGenerator 一致 */
export function chat(userMessage: string, historySize: number): string {
  const msg = userMessage.trim();
  if (msg === '') return '请输入你的问题哦～';
  const lower = msg.toLowerCase();

  if (lower.includes('你好') || lower.includes('hello') || lower.includes('hi')) {
    return '你好！我是小学课后辅导小助手。可以问我语文、数学、英语的题目，也可以让我帮你总结、讲解知识点。';
  }
  if (lower.includes('数学') || lower.includes('算式') || lower.includes('计算')) {
    return '数学题可以在这里的「练习」里做，做完会有批改和解析。有不懂的题目把题目发给我，我帮你讲。';
  }
  if (lower.includes('总结') || lower.includes('概括')) {
    return '把要总结的内容发给我，我会按「要点 + 结论」的结构帮你整理。';
  }
  if (lower.includes('谢谢')) {
    return '不客气，继续加油！有不会的随时问我。';
  }
  return `我收到了：「${msg}」。我这边是离线小助手，复杂问题建议在「练习」里多做题、看解析。简单问题可以再问我试试～（对话数: ${historySize}）`;
}
