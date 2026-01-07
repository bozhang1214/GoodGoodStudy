import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { getString } from '../utils/ResourceUtil';
import { AIRepository } from '../repository/AIRepository';

/**
 * 设置页面
 */
@Entry
@Component
export struct SettingsPage {
  @State apiKey: string = '';
  private aiRepository: AIRepository = new AIRepository();

  aboutToAppear() {
    this.aiRepository.init();
    this.loadApiKey();
  }

  async loadApiKey() {
    try {
      this.apiKey = await this.aiRepository.getApiKey();
    } catch (error) {
      console.error('Failed to load API key:', error);
    }
  }

  build() {
    Column() {
      Text(getString('settings'))
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 30, bottom: 30 })

      Column() {
        Text(getString('deepseek_api_key'))
          .fontSize(16)
          .margin({ bottom: 10 })

        TextInput({ placeholder: getString('api_key_hint'), text: this.apiKey })
          .width('100%')
          .height(50)
          .onChange((value: string) => {
            this.apiKey = value;
          })
          .margin({ bottom: 20 })

        Button(getString('save'))
          .width('100%')
          .height(50)
          .onClick(() => {
            this.saveApiKey();
          })
      }
      .width('90%')
      .padding(20)
      .backgroundColor('#FFFFFF')
      .borderRadius(10)
    }
    .width('100%')
    .height('100%')
    .padding(20)
    .backgroundColor('#F5F5F5')
  }

  async saveApiKey() {
    if (this.apiKey.trim() === '') {
      this.showToast(getString('please_input_api_key'));
      return;
    }

    try {
      await this.aiRepository.setApiKey(this.apiKey.trim());
      this.showToast(getString('api_key_saved'));
      router.back();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.showToast(`${getString('error')}: ${errorMsg}`);
    }
  }

  showToast(message: string) {
    promptAction.showToast({
      message: message,
      duration: 2000
    });
  }
}
