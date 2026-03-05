/**
 * 统一对话后端：按设置中的「大模型选择」分发到 Llama / 基础大模型 / TFLite 意图 / 内置规则。
 */
import {Platform} from 'react-native';
import {NativeModules} from 'react-native';
import {chat as ruleBasedChat} from './ruleBased';
import {chat as baseChat} from './baseChat';
import {getReply as getLlamaReply, isLlamaAvailable} from './llamaChat';

const {TFLiteChat} = NativeModules;

export type RecentMessage = {role: string; content: string};

export async function getReply(
  userMessage: string,
  historySize: number,
  modelType: string,
  recentMessages?: RecentMessage[],
): Promise<string> {
  if (modelType === 'rule') {
    return ruleBasedChat(userMessage, historySize);
  }
  if (modelType === 'base') {
    return baseChat(userMessage, historySize);
  }
  if (modelType === 'llama' && isLlamaAvailable()) {
    try {
      return await getLlamaReply(userMessage, historySize, recentMessages ?? []);
    } catch (_) {
      return baseChat(userMessage, historySize);
    }
  }
  if (modelType === 'tflite' && Platform.OS === 'android' && TFLiteChat?.getReply) {
    try {
      return await TFLiteChat.getReply(userMessage, historySize);
    } catch (_) {
      return ruleBasedChat(userMessage, historySize);
    }
  }
  return baseChat(userMessage, historySize);
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
