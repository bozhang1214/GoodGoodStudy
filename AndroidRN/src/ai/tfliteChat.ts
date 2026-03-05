/**
 * 端侧 TFLite 对话：优先使用 Android 原生 TFLiteChat 模块（含 TFLite 意图分类或规则兜底），
 * 否则回退到 JS 规则回复。
 */
import {NativeModules, Platform} from 'react-native';
import {chat as ruleBasedChat} from './ruleBased';

const {TFLiteChat} = NativeModules;

export async function getReply(userMessage: string, historySize: number): Promise<string> {
  if (Platform.OS === 'android' && TFLiteChat?.getReply) {
    try {
      return await TFLiteChat.getReply(userMessage, historySize);
    } catch (_) {
      return ruleBasedChat(userMessage, historySize);
    }
  }
  return ruleBasedChat(userMessage, historySize);
}

export function isTFLiteAvailable(): boolean {
  return Platform.OS === 'android' && !!TFLiteChat;
}

export async function isModelLoaded(): Promise<boolean> {
  if (Platform.OS === 'android' && TFLiteChat?.isModelLoaded) {
    try {
      return await TFLiteChat.isModelLoaded();
    } catch (_) {
      return false;
    }
  }
  return false;
}
