/** 与 Android-1 AppConstants 对齐 */
export const PREFS_USER = 'user_prefs';
export const PREFS_AI = 'ai_prefs';
export const KEY_USER_ID = 'user_id';
export const KEY_USERNAME = 'username';
export const KEY_API_KEY = 'deepseek_api_key';
export const KEY_AI_MODEL = 'ai_model';
export const KEY_LLAMA_MODEL_PATH = 'llama_model_path';

/** AI 大模型类型：Llama 端侧 / 基础大模型 / TFLite 意图 / 内置规则 */
export const AI_MODEL_LLAMA = 'llama';
export const AI_MODEL_BASE = 'base';
export const AI_MODEL_TFLITE = 'tflite';
export const AI_MODEL_RULE = 'rule';
export const AI_MODEL_DEFAULT = AI_MODEL_BASE;

/** 默认随 APK 打包的 GGUF 模型路径（若实际存在）
 * 建议放置：Qwen3.5-122B-A10B-UD-IQ3_XXS.gguf
 */
export const DEFAULT_LLAMA_ASSET_PATH =
  'file:///android_asset/models/Qwen3.5-122B-A10B-UD-IQ3_XXS.gguf';

export const MAX_HISTORY_MESSAGES = 50;
export const SUBJECT_CHINESE = 1;
export const SUBJECT_MATH = 2;
export const SUBJECT_ENGLISH = 3;
export const MIN_GRADE = 1;
export const MAX_GRADE = 6;
export const QUESTION_TYPE_SINGLE_CHOICE = 'single_choice';
export const QUESTION_TYPE_FILL_BLANK = 'fill_blank';
export const QUESTION_TYPE_JUDGMENT = 'judgment';
export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 5;
export const QUESTIONS_PER_PRACTICE = 5;
export const ROLE_USER = 'user';
export const ROLE_ASSISTANT = 'assistant';
export const ERROR_USERNAME_EXISTS = 'username_exists';
export const ERROR_USER_NOT_FOUND = 'user_not_found';
export const ERROR_PASSWORD_WRONG = 'password_wrong';
