/**
 * Llama 端侧对话：使用 llama.rn 绑定 llama.cpp，加载 GGUF 模型并做补全。
 * 需在「设置」中配置 Llama 模型路径（GGUF 文件）；未配置或加载失败时回退到 baseChat。
 */
import {chat as baseChat} from './baseChat';
import {getLlamaModelPath} from '../storage/store';

let cachedContext: {completion: (params: unknown, cb: (data: unknown) => void) => Promise<{text?: string}>} | null = null;
let cachedModelPath: string = '';

const SYSTEM_PROMPT =
  '你是小学课后辅导小助手，用简短、友好的中文回答。可以帮学生练题、讲知识点、总结段落。';

const STOP_WORDS = [
  '</s>',
  '<|end|>',
  '<|eot_id|>',
  '<|end_of_text|>',
  '<|im_end|>',
  '再见',
  '<|END_OF_TURN_TOKEN|>',
  '<|end_of_turn|>',
  '<|endoftext|>',
];

async function initLlama(modelPath: string) {
  const {initLlama: init} = await import('llama.rn');
  return init({
    model: modelPath.startsWith('file://') ? modelPath : `file://${modelPath}`,
    use_mlock: true,
    n_ctx: 2048,
    n_gpu_layers: 0,
  });
}

function buildMessages(
  recentMessages: {role: string; content: string}[],
  userMessage: string,
): {role: string; content: string}[] {
  const list: {role: string; content: string}[] = [
    {role: 'system', content: SYSTEM_PROMPT},
  ];
  const maxHistory = 10;
  const recent = recentMessages.slice(-maxHistory);
  for (const m of recent) {
    if (m.role === 'user' || m.role === 'assistant') {
      list.push({role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content});
    }
  }
  list.push({role: 'user', content: userMessage});
  return list;
}

export async function getReply(
  userMessage: string,
  historySize: number,
  recentMessages: {role: string; content: string}[],
): Promise<string> {
  const msg = userMessage.trim();
  if (!msg) return '请输入你的问题哦～';

  const modelPath = await getLlamaModelPath();
  if (!modelPath || !modelPath.trim()) {
    return baseChat(userMessage, historySize);
  }

  try {
    if (cachedModelPath !== modelPath || !cachedContext) {
      cachedContext = null;
      cachedModelPath = modelPath;
      cachedContext = await initLlama(modelPath);
    }
    const messages = buildMessages(recentMessages, msg);
    const result = await cachedContext!.completion(
      {
        messages,
        n_predict: 256,
        stop: STOP_WORDS,
      },
      () => {},
    );
    const text = (result?.text ?? '').trim();
    return text || baseChat(userMessage, historySize);
  } catch (_) {
    cachedContext = null;
    cachedModelPath = '';
    return baseChat(userMessage, historySize);
  }
}

export function isLlamaAvailable(): boolean {
  try {
    require('llama.rn');
    return true;
  } catch {
    return false;
  }
}

export async function isLlamaModelPathSet(): Promise<boolean> {
  const path = await getLlamaModelPath();
  return !!path.trim();
}

export function clearLlamaCache(): void {
  cachedContext = null;
  cachedModelPath = '';
}
