import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { getString } from '../utils/ResourceUtil';
import { AppConstants } from '../constants/AppConstants';
import { QuestionRepository } from '../repository/QuestionRepository';
import { Logger } from '../utils/Logger';

/**
 * 练习页面
 */
@Component
export struct PracticePage {
  @State selectedSubject: number = AppConstants.SUBJECT_CHINESE;
  @State selectedGrade: number = 1;
  @State isLoading: boolean = false;
  private questionRepository: QuestionRepository = new QuestionRepository();

  aboutToAppear() {
    this.questionRepository.init();
  }

  build() {
    Column() {
      Text(getString('select_subject'))
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 10 })

      Row() {
        Button(getString('subject_chinese'))
          .type(ButtonType.Normal)
          .backgroundColor(this.selectedSubject === AppConstants.SUBJECT_CHINESE ? '#007DFF' : '#F0F0F0')
          .onClick(() => {
            this.selectedSubject = AppConstants.SUBJECT_CHINESE;
          })
          .margin({ right: 10 })

        Button(getString('subject_math'))
          .type(ButtonType.Normal)
          .backgroundColor(this.selectedSubject === AppConstants.SUBJECT_MATH ? '#007DFF' : '#F0F0F0')
          .onClick(() => {
            this.selectedSubject = AppConstants.SUBJECT_MATH;
          })
          .margin({ right: 10 })

        Button(getString('subject_english'))
          .type(ButtonType.Normal)
          .backgroundColor(this.selectedSubject === AppConstants.SUBJECT_ENGLISH ? '#007DFF' : '#F0F0F0')
          .onClick(() => {
            this.selectedSubject = AppConstants.SUBJECT_ENGLISH;
          })
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .margin({ bottom: 20 })

      Text(getString('select_grade'))
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 10 })

      Row() {
        ForEach([1, 2, 3, 4, 5, 6], (grade: number) => {
          Button(getString(`grade_${this.getGradeName(grade)}`))
            .type(ButtonType.Normal)
            .backgroundColor(this.selectedGrade === grade ? '#007DFF' : '#F0F0F0')
            .onClick(() => {
              this.selectedGrade = grade;
            })
            .margin({ right: 5 })
        })
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .margin({ bottom: 30 })

      Button(getString('start_practice'))
        .width('80%')
        .height(50)
        .enabled(!this.isLoading)
        .onClick(() => {
          this.startPractice();
        })
    }
    .width('100%')
    .height('100%')
    .padding(20)
  }

  getGradeName(grade: number): string {
    const names = ['', 'one', 'two', 'three', 'four', 'five', 'six'];
    return names[grade] || '';
  }

  async startPractice() {
    this.isLoading = true;
    try {
      // 检查题目数量
      const count = await this.questionRepository.getQuestionCount(this.selectedSubject, this.selectedGrade);
      if (count === 0) {
        this.showToast(getString('no_questions'));
        return;
      }
      
      // 跳转到答题页面
      router.pushUrl({
        url: 'pages/PracticeActivityPage',
        params: {
          subjectId: this.selectedSubject,
          grade: this.selectedGrade
        }
      });
    } catch (error) {
      Logger.errorWithTag('PracticePage', 'Failed to start practice', error as Error);
      this.showToast(getString('load_failed'));
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
