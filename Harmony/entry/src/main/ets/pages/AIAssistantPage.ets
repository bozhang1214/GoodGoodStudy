import promptAction from '@ohos.promptAction';
import { getString } from '../utils/ResourceUtil';
import { AIRepository } from '../repository/AIRepository';
import { UserRepository } from '../repository/UserRepository';

/**
 * 消息接口
 */
interface Message {
  role: string;
  content: string;
}

/**
 * AI助手页面
 */
@Component
export struct AIAssistantPage {
  @State messages: Array<Message> = [];
  @State inputText: string = '';
  @State isLoading: boolean = false;
  private aiRepository: AIRepository = new AIRepository();
  private userRepository: UserRepository = new UserRepository();

  aboutToAppear() {
    this.aiRepository.init();
    this.userRepository.init();
    this.loadChatHistory();
  }

  async loadChatHistory() {
    try {
      const userId = await this.userRepository.getCurrentUserId();
      if (userId !== -1) {
        const history = await this.aiRepository.getChatHistory(userId);
        this.messages = history.map((msg): Message => ({
          role: msg.role,
          content: msg.content
        }));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }

  build() {
    Column() {
      // 消息列表
      List() {
        ForEach(this.messages, (message: Message, index: number) => {
          ListItem() {
            Row() {
              if (message.role === 'user') {
                Column() {
                  Text(message.content)
                    .fontSize(14)
                    .padding(10)
                    .backgroundColor('#007DFF')
                    .fontColor('#FFFFFF')
                    .borderRadius(8)
                }
                .alignItems(HorizontalAlign.End)
                .layoutWeight(1)
              } else {
                Column() {
                  Text(message.content)
                    .fontSize(14)
                    .padding(10)
                    .backgroundColor('#F0F0F0')
                    .fontColor('#000000')
                    .borderRadius(8)
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)
              }
            }
            .width('100%')
            .padding(10)
          }
        })
      }
      .width('100%')
      .layoutWeight(1)
      .padding(10)

      // 输入区域
      Row() {
        TextInput({ placeholder: getString('input_message_hint') })
          .layoutWeight(1)
          .height(40)
          .onChange((value: string) => {
            this.inputText = value;
          })

        Button(getString('send'))
          .width(60)
          .height(40)
          .enabled(!this.isLoading && this.inputText.trim() !== '')
          .onClick(() => {
            this.sendMessage();
          })
          .margin({ left: 10 })
      }
      .width('100%')
      .padding(10)
      .backgroundColor('#FFFFFF')

      if (this.isLoading) {
        Row() {
          LoadingProgress()
            .width(20)
            .height(20)
          Text(getString('thinking'))
            .fontSize(14)
            .margin({ left: 10 })
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .padding(10)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  async sendMessage() {
    if (this.inputText.trim() === '') {
      return;
    }

    const message = this.inputText.trim();
    this.inputText = '';

    // 添加用户消息到列表
    this.messages.push({ role: 'user', content: message } as Message);
    this.isLoading = true;

    try {
      const userId = await this.userRepository.getCurrentUserId();
      if (userId === -1 || userId <= 0) {
        this.showToast(getString('please_login'));
        // 移除刚才添加的用户消息
        this.messages.pop();
        this.isLoading = false;
        return;
      }

      const response = await this.aiRepository.sendMessage(userId, message);
      this.messages.push({ role: 'assistant', content: response } as Message);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.showToast(`${getString('send_failed')}: ${errorMsg}`);
      // 移除最后添加的用户消息（因为发送失败）
      if (this.messages.length > 0 && this.messages[this.messages.length - 1].role === 'user') {
        this.messages.pop();
      }
    } finally {
      this.isLoading = false;
    }
  }

  showToast(message: string) {
    promptAction.showToast({
      message: message,
      duration: 2000
    });
  }
}
