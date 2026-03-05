import AsyncStorage from '@react-native-async-storage/async-storage';
import type {User, Answer, WrongQuestion, ChatMessage} from '../types';
import {
  KEY_USER_ID,
  KEY_USERNAME,
  KEY_API_KEY,
  KEY_AI_MODEL,
  AI_MODEL_DEFAULT,
  KEY_LLAMA_MODEL_PATH,
  DEFAULT_LLAMA_ASSET_PATH,
} from '../constants';

const KEY_USERS = 'store_users';
const KEY_ANSWERS = 'store_answers';
const KEY_WRONGS = 'store_wrongs';
const KEY_CHAT_PREFIX = 'store_chat_';

export interface AppStore {
  users: User[];
  answers: Answer[];
  wrongs: WrongQuestion[];
  chatByUser: Record<number, ChatMessage[]>;
}

async function loadFull(): Promise<AppStore> {
  try {
    const [u, a, w, chatKeys] = await Promise.all([
      AsyncStorage.getItem(KEY_USERS),
      AsyncStorage.getItem(KEY_ANSWERS),
      AsyncStorage.getItem(KEY_WRONGS),
      AsyncStorage.getAllKeys().then((keys) => keys.filter((k) => k.startsWith(KEY_CHAT_PREFIX))),
    ]);
    const users: User[] = u ? JSON.parse(u) : [];
    const answers: Answer[] = a ? JSON.parse(a) : [];
    const wrongs: WrongQuestion[] = w ? JSON.parse(w) : [];
    const chatByUser: Record<number, ChatMessage[]> = {};
    for (const k of chatKeys) {
      const uid = parseInt(k.replace(KEY_CHAT_PREFIX, ''), 10);
      if (!isNaN(uid)) {
        const raw = await AsyncStorage.getItem(k);
        chatByUser[uid] = raw ? JSON.parse(raw) : [];
      }
    }
    return {users, answers, wrongs, chatByUser};
  } catch {
    return {users: [], answers: [], wrongs: [], chatByUser: {}};
  }
}

let cache: AppStore | null = null;

export async function getStore(): Promise<AppStore> {
  if (cache) return cache;
  cache = await loadFull();
  return cache;
}

async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(KEY_USERS, JSON.stringify(users));
  if (cache) cache.users = users;
}

async function saveAnswers(answers: Answer[]) {
  await AsyncStorage.setItem(KEY_ANSWERS, JSON.stringify(answers));
  if (cache) cache.answers = answers;
}

async function saveWrongs(wrongs: WrongQuestion[]) {
  await AsyncStorage.setItem(KEY_WRONGS, JSON.stringify(wrongs));
  if (cache) cache.wrongs = wrongs;
}

async function saveChat(userId: number, messages: ChatMessage[]) {
  await AsyncStorage.setItem(KEY_CHAT_PREFIX + userId, JSON.stringify(messages));
  if (cache) cache.chatByUser[userId] = messages;
}

// --- 当前用户（简单用 AsyncStorage 存，与 Android prefs 一致）
export async function getCurrentUserId(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEY_USER_ID);
  const n = raw ? parseInt(raw, 10) : -1;
  return isNaN(n) ? -1 : n;
}

export async function getCurrentUsername(): Promise<string> {
  return (await AsyncStorage.getItem(KEY_USERNAME)) ?? '';
}

export async function setCurrentUser(userId: number, username: string): Promise<void> {
  await AsyncStorage.setItem(KEY_USER_ID, String(userId));
  await AsyncStorage.setItem(KEY_USERNAME, username);
}

export async function clearCurrentUser(): Promise<void> {
  await AsyncStorage.multiRemove([KEY_USER_ID, KEY_USERNAME]);
}

// --- API Key
export async function getApiKey(): Promise<string> {
  return (await AsyncStorage.getItem(KEY_API_KEY)) ?? '';
}

export async function setApiKey(key: string): Promise<void> {
  await AsyncStorage.setItem(KEY_API_KEY, key);
}

// --- AI 大模型选择
export async function getAiModel(): Promise<string> {
  const raw = await AsyncStorage.getItem(KEY_AI_MODEL);
  return raw ?? AI_MODEL_DEFAULT;
}

export async function setAiModel(model: string): Promise<void> {
  await AsyncStorage.setItem(KEY_AI_MODEL, model);
}

// --- Llama 模型路径（GGUF 文件，如 file:///data/.../model.gguf）
export async function getLlamaModelPath(): Promise<string> {
  const fromStore = await AsyncStorage.getItem(KEY_LLAMA_MODEL_PATH);
  if (fromStore && fromStore.trim()) {
    return fromStore.trim();
  }
  // 若未配置，则尝试使用随 APK 打包的默认模型路径
  return DEFAULT_LLAMA_ASSET_PATH;
}

export async function setLlamaModelPath(path: string): Promise<void> {
  await AsyncStorage.setItem(KEY_LLAMA_MODEL_PATH, path.trim());
}

// --- Users
export async function findUserByUsername(username: string): Promise<User | null> {
  const {users} = await getStore();
  return users.find((u) => u.username === username) ?? null;
}

export async function insertUser(user: Omit<User, 'id'>): Promise<number> {
  const {users} = await getStore();
  const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser: User = {...user, id};
  users.push(newUser);
  await saveUsers(users);
  return id;
}

// --- Answers
export async function insertAnswer(answer: Omit<Answer, 'id'>): Promise<void> {
  const {answers} = await getStore();
  const id = 'a_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  answers.push({...answer, id});
  await saveAnswers(answers);
}

export async function getAnswersByUser(userId: number): Promise<Answer[]> {
  const {answers} = await getStore();
  return answers.filter((a) => a.userId === userId);
}

// --- Wrongs
export async function getWrongsByUser(userId: number): Promise<WrongQuestion[]> {
  const {wrongs} = await getStore();
  return wrongs.filter((w) => w.userId === userId);
}

export async function addWrong(wrong: Omit<WrongQuestion, 'id'>): Promise<void> {
  const {wrongs} = await getStore();
  const existing = wrongs.find(
    (w) => w.userId === wrong.userId && w.question.id === wrong.question.id,
  );
  if (existing) {
    existing.userAnswer = wrong.userAnswer;
    existing.wrongTime = wrong.wrongTime;
  } else {
    wrongs.push({...wrong, id: 'w_' + Date.now(), reviewCount: wrong.reviewCount ?? 0});
  }
  await saveWrongs(wrongs);
}

export async function removeWrong(userId: number, questionId: string): Promise<void> {
  const {wrongs} = await getStore();
  const idx = wrongs.findIndex((w) => w.userId === userId && w.question.id === questionId);
  if (idx >= 0) {
    wrongs.splice(idx, 1);
    await saveWrongs(wrongs);
  }
}

export async function incrementReviewCount(userId: number, questionId: string): Promise<void> {
  const {wrongs} = await getStore();
  const w = wrongs.find((x) => x.userId === userId && x.question.id === questionId);
  if (w) {
    w.reviewCount += 1;
    await saveWrongs(wrongs);
  }
}

// --- Chat
export async function getChatHistory(userId: number): Promise<ChatMessage[]> {
  const {chatByUser} = await getStore();
  return chatByUser[userId] ?? [];
}

export async function appendChatMessage(
  userId: number,
  role: string,
  content: string,
): Promise<void> {
  const list = await getChatHistory(userId);
  const msg: ChatMessage = {
    id: 'c_' + Date.now(),
    userId,
    role,
    content,
    timestamp: Date.now(),
  };
  list.push(msg);
  await saveChat(userId, list);
}

export async function clearChat(userId: number): Promise<void> {
  await saveChat(userId, []);
}
