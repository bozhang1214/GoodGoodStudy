/**
 * 基础大模型（端侧）：提供类 Chat 的对话能力。
 * 当前为增强版模板回复，后续可替换为真实端侧 LLM（如 llama.cpp 等）。
 */
export function chat(userMessage: string, historySize: number): string {
  const msg = userMessage.trim();
  if (msg === '') return '请输入你的问题哦～';
  const lower = msg.toLowerCase();

  // 打招呼（含 hello、nihao、你好 等）
  if (/你好|hello|hi|嗨|hey|nihao|ni hao|在吗|早上|下午|晚上/.test(lower)) {
    return '你好！我是小学课后辅导小助手，可以陪你练题、讲知识点。你可以问「数学题怎么做」「帮我总结一段话」，或者说「谢谢」～';
  }
  // 数学
  if (/数学|算式|计算|加减|乘除|应用题|口算/.test(lower)) {
    return '数学题可以在「练习」里做，做完有批改和解析。有具体题目发给我，我帮你讲思路。';
  }
  // 语文 / 英语
  if (/语文|英语|词语|造句|作文|单词|阅读/.test(lower)) {
    return '语文、英语相关可以在「练习」里刷题。需要总结或讲解某段内容的话，把内容发给我就行。';
  }
  // 总结 / 概括
  if (/总结|概括|归纳|要点/.test(lower)) {
    return '把要总结的内容发给我，我会按「要点 + 结论」帮你整理。';
  }
  // 感谢
  if (/谢谢|感谢|多谢|不客气/.test(lower)) {
    return '不客气～有不会的随时问我，继续加油！';
  }
  // 再见
  if (/再见|拜拜|再会|下次/.test(lower)) {
    return '再见～记得常来练习哦。';
  }
  // 练习 / 错题 / 进度
  if (/练习|做题|错题|进度|设置/.test(lower)) {
    return '在底部可以切到「练习」「错题本」「进度」「设置」。想聊学习上的问题直接发给我就好。';
  }
  // 开放问句（如 why is the sky blue / 今天天气）：给一条通用但像对话的回复
  if (/\?|？|吗|呢|啊$/.test(msg) || msg.length > 20) {
    return '这个问题我暂时没法详细回答哦。我更适合帮你做练习、讲题目、总结知识点。你可以试试问我「数学题」「帮我总结」或「你好」～';
  }
  // 短句兜底（避免与开放问句重复，统一给简短指引）
  return `收到：「${msg}」。我是学习小助手，可以聊练习、总结、讲题。试试说「你好」或「数学」～`;
}
