import router from '@ohos.router';
import { getString } from '../utils/ResourceUtil';
import { UserRepository } from '../repository/UserRepository';
import { QuestionRepository } from '../repository/QuestionRepository';
import { WrongQuestionEntity } from '../database/dao/WrongQuestionDao';
import { Logger } from '../utils/Logger';

/**
 * 错题本页面
 */
@Component
export struct WrongBookPage {
  @State wrongQuestions: Array<WrongQuestionEntity> = [];
  private userRepository: UserRepository = new UserRepository();
  private questionRepository: QuestionRepository = new QuestionRepository();

  aboutToAppear() {
    this.userRepository.init();
    this.questionRepository.init();
    this.loadWrongQuestions();
  }

  async loadWrongQuestions() {
    try {
      const userId = await this.userRepository.getCurrentUserId();
      if (userId === -1) {
        return;
      }
      this.wrongQuestions = await this.questionRepository.getWrongQuestions(userId);
    } catch (error) {
      Logger.errorWithTag('WrongBookPage', 'Failed to load wrong questions', error as Error);
    }
  }

  build() {
    Column() {
      Text(getString('wrong_questions'))
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 30, bottom: 20 })

      if (this.wrongQuestions.length === 0) {
        Column() {
          Text(getString('no_wrong_questions'))
            .fontSize(16)
            .fontColor('#999999')
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      } else {
        List() {
          ForEach(this.wrongQuestions, (item: WrongQuestionEntity, index: number) => {
            ListItem() {
              Column() {
                Text(`题目ID: ${item.questionId}`)
                  .fontSize(16)
                  .fontWeight(FontWeight.Bold)
                  .margin({ bottom: 5 })
                Text(`你的答案: ${item.userAnswer}`)
                  .fontSize(14)
                  .fontColor('#666666')
                  .margin({ bottom: 5 })
                Text(`时间: ${new Date(item.wrongTime).toLocaleString()}`)
                  .fontSize(12)
                  .fontColor('#999999')
                if (item.reviewCount > 0) {
                  Text(`复习次数: ${item.reviewCount}`)
                    .fontSize(12)
                    .fontColor('#999999')
                    .margin({ top: 5 })
                }
              }
              .width('100%')
              .padding(15)
              .backgroundColor('#FFFFFF')
              .borderRadius(8)
              .margin({ bottom: 10 })
              .onClick(() => {
                this.startReview(item);
              })
            }
          })
        }
        .width('100%')
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
    .padding(20)
  }

  async startReview(wrongQuestion: WrongQuestionEntity) {
    try {
      // 获取题目信息
      const question = await this.questionRepository.getQuestionById(wrongQuestion.questionId);
      if (!question) {
        return;
      }
      
      // 跳转到复习页面
      router.pushUrl({
        url: 'pages/PracticeActivityPage',
        params: {
          subjectId: question.subjectId,
          grade: question.grade,
          isReviewMode: true,
          wrongQuestionIds: [wrongQuestion.questionId]
        }
      });
    } catch (error) {
      Logger.errorWithTag('WrongBookPage', 'Failed to start review', error as Error);
    }
  }
}
