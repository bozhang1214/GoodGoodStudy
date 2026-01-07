import router from '@ohos.router';
import { UserRepository } from '../repository/UserRepository';
import { PracticePage } from './PracticePage';
import { ProgressPage } from './ProgressPage';
import { WrongBookPage } from './WrongBookPage';
import { AIAssistantPage } from './AIAssistantPage';
import { getString } from '../utils/ResourceUtil';
import { DatabaseInitializer } from '../utils/DatabaseInitializer';
import { Logger } from '../utils/Logger';

/**
 * 主页面
 */
@Entry
@Component
struct MainPage {
  @State currentIndex: number = 0;
  private userRepository: UserRepository = new UserRepository();

  aboutToAppear() {
    this.userRepository.init().then(() => {
      this.checkLogin();
      // 初始化数学题目数据
      DatabaseInitializer.initializeMathQuestions().then(() => {
        Logger.debugWithTag('MainPage', 'Math questions initialized');
      }).catch((error: Error) => {
        Logger.errorWithTag('MainPage', 'Failed to initialize math questions', error);
      });
    });
  }

  async checkLogin() {
    const isLoggedIn = await this.userRepository.isLoggedIn();
    if (!isLoggedIn) {
      router.replaceUrl({ url: 'pages/LoginPage' });
    }
  }

  build() {
    Column() {
      Tabs({ barPosition: BarPosition.End }) {
        TabContent() {
          // 练习页面
          PracticePage()
        }
        .tabBar(this.getTabBuilder('nav_practice', 0))

        TabContent() {
          // 进度页面
          ProgressPage()
        }
        .tabBar(this.getTabBuilder('nav_progress', 1))

        TabContent() {
          // 错题本页面
          WrongBookPage()
        }
        .tabBar(this.getTabBuilder('nav_wrong_book', 2))

        TabContent() {
          // AI助手页面
          AIAssistantPage()
        }
        .tabBar(this.getTabBuilder('nav_ai_assistant', 3))
      }
      .onChange((index: number) => {
        this.currentIndex = index;
      })
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  getTabBuilder(name: string, index: number) {
    Column() {
      Text(getString(name))
        .fontSize(14)
        .fontColor(this.currentIndex === index ? '#007DFF' : '#999999')
    }
    .width('100%')
    .height(50)
    .justifyContent(FlexAlign.Center)
  }
}
