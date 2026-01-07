import { AppConstants } from '../../constants/AppConstants';

/**
 * Deepseek API 请求模型
 */
export class DeepseekRequest {
  model: string = AppConstants.DEEPSEEK_MODEL;
  messages: Message[] = [];
  temperature: number = AppConstants.DEEPSEEK_TEMPERATURE;
  max_tokens: number = AppConstants.DEEPSEEK_MAX_TOKENS;

  constructor() {
  }
}

export class Message {
  role: string = '';
  content: string = '';

  constructor(role?: string, content?: string) {
    if (role && content) {
      this.role = role;
      this.content = content;
    }
  }
}
