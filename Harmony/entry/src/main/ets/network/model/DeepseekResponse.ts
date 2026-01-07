/**
 * Deepseek API 响应模型
 */
export class DeepseekResponse {
  id: string = '';
  object: string = '';
  created: number = 0;
  model: string = '';
  choices: Choice[] = [];
  usage?: Usage;

  getContent(): string {
    if (this.choices && this.choices.length > 0) {
      const choice = this.choices[0];
      if (choice && choice.message) {
        return choice.message.content;
      }
    }
    return '';
  }
}

export class Choice {
  index: number = 0;
  message?: Message;
  finish_reason: string = '';
}

export class Message {
  role: string = '';
  content: string = '';
}

export class Usage {
  prompt_tokens: number = 0;
  completion_tokens: number = 0;
  total_tokens: number = 0;
}
