import { getString } from '../utils/ResourceUtil';
import { UserRepository } from '../repository/UserRepository';
import { QuestionRepository } from '../repository/QuestionRepository';
import { Logger } from '../utils/Logger';

/**
 * 进度页面
 */
@Component
export struct ProgressPage {
  @State totalQuestions: number = 0;
  @State completedQuestions: number = 0;
  @State accuracyRate: number = 0;
  private userRepository: UserRepository = new UserRepository();
  private questionRepository: QuestionRepository = new QuestionRepository();

  aboutToAppear() {
    this.userRepository.init();
    this.questionRepository.init();
    this.loadProgress();
  }

  async loadProgress() {
    try {
      const userId = await this.userRepository.getCurrentUserId();
      if (userId === -1) {
        return;
      }
      const progressData = await this.questionRepository.getProgressData(userId);
      this.totalQuestions = progressData.total;
      this.completedQuestions = progressData.correct;
      this.accuracyRate = progressData.accuracy;
    } catch (error) {
      Logger.errorWithTag('ProgressPage', 'Failed to load progress', error as Error);
    }
  }

  build() {
    Column() {
      Text(getString('learning_progress'))
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 30, bottom: 40 })

      Row() {
        Column() {
          Text(this.totalQuestions.toString())
            .fontSize(32)
            .fontWeight(FontWeight.Bold)
            .fontColor('#007DFF')
          Text(getString('total_questions'))
            .fontSize(14)
            .margin({ top: 5 })
        }
        .flexGrow(1)

        Column() {
          Text(this.completedQuestions.toString())
            .fontSize(32)
            .fontWeight(FontWeight.Bold)
            .fontColor('#52C41A')
          Text(getString('completed_questions'))
            .fontSize(14)
            .margin({ top: 5 })
        }
        .flexGrow(1)

        Column() {
          Text(`${this.accuracyRate.toFixed(1)}%`)
            .fontSize(32)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF6B6B')
          Text(getString('accuracy_rate'))
            .fontSize(14)
            .margin({ top: 5 })
        }
        .flexGrow(1)
      }
      .width('90%')
      .padding(20)
      .backgroundColor('#F5F5F5')
      .borderRadius(10)
      .margin({ bottom: 30 })
    }
    .width('100%')
    .height('100%')
    .padding(20)
  }
}
