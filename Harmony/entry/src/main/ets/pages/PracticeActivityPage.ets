
import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { getString } from '../utils/ResourceUtil';
import { AppConstants } from '../constants/AppConstants';
import { QuestionRepository } from '../repository/QuestionRepository';
import { UserRepository } from '../repository/UserRepository';
import { Question } from '../model/Question';
import { AnswerChecker } from '../utils/AnswerChecker';
import { AnswerEntity } from '../database/dao/AnswerDao';
import { Logger } from '../utils/Logger';
import { InputValidator } from '../utils/InputValidator';
import { ResourceCleaner } from '../utils/ResourceCleaner';


/**
 * 答题页面
 */
@Entry
@Component
export struct PracticeActivityPage {
  @State questions: Question[] = [];
  @State currentIndex: number = 0;
  @State selectedAnswer: string = '';
  @State fillAnswer: string = '';
  @State allSubmitted: boolean = false;
  @State isLoading: boolean = true;
  @State showResult: boolean = false;
  @State isCorrect: boolean = false;
  @State explanation: string = '';
  @State currentQuestion: Question | null = null; // 用于强制UI更新
  @State currentQuestionKey: string = ''; // 用于强制UI更新
  
  private subjectId: number = AppConstants.SUBJECT_MATH;
  private grade: number = 1;
  private isReviewMode: boolean = false;
  private wrongQuestionIds: number[] = [];
  private userId: number = -1;
  private tempAnswers: Map<number, string> = new Map();
  private questionRepository: QuestionRepository = new QuestionRepository();
  private userRepository: UserRepository = new UserRepository();

  aboutToAppear() {
    this.questionRepository.init();
    this.userRepository.init();
    this.initParams();
    this.userRepository.getCurrentUserId().then((id) => {
      this.userId = id;
      this.loadQuestions();
    });
  }

  initParams() {
    const params = router.getParams() as Record<string, Object>;
    if (params) {
      this.subjectId = (params['subjectId'] as number) || AppConstants.SUBJECT_MATH;
      this.grade = (params['grade'] as number) || 1;
      this.isReviewMode = (params['isReviewMode'] as boolean) || false;
      this.wrongQuestionIds = (params['wrongQuestionIds'] as number[]) || [];
      
      // 验证输入
      if (!InputValidator.isValidSubjectId(this.subjectId)) {
        this.subjectId = AppConstants.SUBJECT_MATH;
      }
      if (!InputValidator.isValidGrade(this.grade)) {
        this.grade = 1;
      }
    }
    
  }

  async loadQuestions() {
    this.isLoading = true;
    try {
      if (this.isReviewMode && this.wrongQuestionIds.length > 0) {
        // 复习模式：加载错题
        this.questions = await this.questionRepository.getQuestionsByIds(this.wrongQuestionIds);
        // 打乱错题顺序，避免每次都是相同顺序
        for (let i = this.questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = this.questions[i];
          this.questions[i] = this.questions[j];
          this.questions[j] = temp;
        }
      } else {
        // 正常模式：加载所有题目
        let allQuestions = await this.questionRepository.getQuestions(this.subjectId, this.grade);
        
        // 限制题目数量
        const maxQuestions = AppConstants.DEBUG_QUESTIONS_PER_PRACTICE;
        
        // 确保题型多样化：使用分层抽样
        // 将题目按类型分组
        const questionsByType: Map<string, Question[]> = new Map();
        allQuestions.forEach(q => {
          if (!questionsByType.has(q.type)) {
            questionsByType.set(q.type, []);
          }
          questionsByType.get(q.type)!.push(q);
        });
        
        // 从每种类型中随机选择题目，确保题型多样化
        const selectedQuestions: Question[] = [];
        const availableTypes: string[] = Array.from(questionsByType.keys());
        
        // 如果题目总数不超过maxQuestions，直接使用所有题目
        if (allQuestions.length <= maxQuestions) {
          // 打乱顺序
          for (let i = allQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = allQuestions[i];
            allQuestions[i] = allQuestions[j];
            allQuestions[j] = temp;
          }
          this.questions = allQuestions;
        } else {
          // 需要选择maxQuestions道题目，确保题型多样化
          // 计算每种类型应该选择的题目数量（尽量平均分配）
          const questionsPerType = Math.floor(maxQuestions / availableTypes.length);
          const remainder = maxQuestions % availableTypes.length;
          
          // 从每种类型中选择题目
          let selectedCount = 0;
          for (let i = 0; i < availableTypes.length && selectedCount < maxQuestions; i++) {
            const type = availableTypes[i];
            const typeQuestions = questionsByType.get(type) || [];
            
            // 计算这种类型应该选择的题目数量
            let countToSelect = questionsPerType;
            if (i < remainder) {
              countToSelect += 1; // 余数分配给前几种类型
            }
            
            // 确保不超过可用题目数量和剩余需要的题目数量
            countToSelect = Math.min(countToSelect, typeQuestions.length, maxQuestions - selectedCount);
            
            // 打乱这种类型的题目
            const shuffled = [...typeQuestions];
            for (let j = shuffled.length - 1; j > 0; j--) {
              const k = Math.floor(Math.random() * (j + 1));
              const temp = shuffled[j];
              shuffled[j] = shuffled[k];
              shuffled[k] = temp;
            }
            
            // 选择前countToSelect道题目
            selectedQuestions.push(...shuffled.slice(0, countToSelect));
            selectedCount += countToSelect;
          }
          
          // 如果选择的题目还不够，从剩余题目中随机补充
          if (selectedCount < maxQuestions) {
            const remainingQuestions: Question[] = [];
            questionsByType.forEach((questions, type) => {
              const alreadySelected = selectedQuestions.filter(q => q.type === type).length;
              const available = questions.slice(alreadySelected);
              remainingQuestions.push(...available);
            });
            
            // 打乱剩余题目
            for (let i = remainingQuestions.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              const temp = remainingQuestions[i];
              remainingQuestions[i] = remainingQuestions[j];
              remainingQuestions[j] = temp;
            }
            
            // 补充到maxQuestions道
            const needMore = maxQuestions - selectedCount;
            selectedQuestions.push(...remainingQuestions.slice(0, needMore));
          }
          
          // 最后打乱所有选中的题目顺序
          for (let i = selectedQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = selectedQuestions[i];
            selectedQuestions[i] = selectedQuestions[j];
            selectedQuestions[j] = temp;
          }
          
          this.questions = selectedQuestions;
        }
      }
      
      if (this.questions.length === 0) {
        this.showToast(getString('no_questions'));
        router.back();
        return;
      }
      
      // 初始化currentQuestion和currentQuestionKey
      if (this.questions.length > 0) {
        this.currentQuestion = this.questions[0];
        this.currentQuestionKey = `question-${this.questions[0].id}-0`;
      }
      
      // 加载第一题
      this.loadQuestion();
    } catch (error) {
      Logger.errorWithTag('PracticeActivityPage', 'Failed to load questions', error as Error);
      this.showToast(getString('load_failed'));
      router.back();
    } finally {
      this.isLoading = false;
    }
  }

  async loadSubmittedAnswer() {
    if (this.userId === -1 || this.currentIndex >= this.questions.length) {
      return;
    }
    const question = this.questions[this.currentIndex];
    try {
      const answer = await this.questionRepository.getAnswer(this.userId, question.id);
      if (answer) {
        // 根据题目类型设置答案
        if (question.type === AppConstants.QUESTION_TYPE_FILL_BLANK) {
          this.fillAnswer = answer.userAnswer;
        } else {
          this.selectedAnswer = answer.userAnswer;
        }
        this.isCorrect = answer.isCorrect;
        this.showResult = true;
        this.explanation = question.explanation || '';
      }
    } catch (error) {
      Logger.errorWithTag('PracticeActivityPage', 'Failed to load submitted answer', error as Error);
    }
  }

  build() {
    Column() {
      if (this.isLoading) {
        Column() {
          LoadingProgress()
          Text(getString('loading'))
            .margin({ top: 10 })
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      } else if (this.questions.length > 0 && this.currentIndex < this.questions.length) {
        // 确保currentIndex有效，直接使用questions数组和currentIndex来确保响应式更新
        // 直接使用questions数组中的题目，确保响应式更新
        // 注意：ArkUI会检测到currentIndex的变化并重新渲染
        this.buildQuestionContent(this.questions[this.currentIndex])
      }
    }
    .width('100%')
    .height('100%')
    .padding(20)
  }
  @Builder
  buildQuestionContent(question: Question) {
    // 直接使用questions数组和currentIndex，不依赖question参数，确保响应式更新
    // 注意：在@Builder方法中不能使用const变量声明和if语句，所以直接使用this.questions[this.currentIndex]
    Column() {
      // 题目编号 - 直接使用currentIndex确保响应式更新
      Text(`第 ${this.currentIndex + 1} 题 / 共 ${this.questions.length} 题`)
        .fontSize(16)
        .fontColor('#666666')
        .margin({ bottom: 20 })
      
      // 题目内容 - 直接使用questions数组和currentIndex来确保响应式更新
      Text(this.questions[this.currentIndex]?.content || question.content)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 30 })
        .id(`question-content-${this.questions[this.currentIndex]?.id || question.id}-${this.currentIndex}`)
      
      // 根据题目类型显示不同的输入方式
      // 注意：在@Builder方法中不能使用const变量声明，所以直接使用this.questions[this.currentIndex]
      if ((this.questions[this.currentIndex]?.type || question.type) === AppConstants.QUESTION_TYPE_SINGLE_CHOICE || 
          (this.questions[this.currentIndex]?.type || question.type) === AppConstants.QUESTION_TYPE_JUDGMENT) {
        this.buildOptions(this.questions[this.currentIndex] || question)
      } else if ((this.questions[this.currentIndex]?.type || question.type) === AppConstants.QUESTION_TYPE_FILL_BLANK) {
        this.buildFillBlank(this.questions[this.currentIndex] || question)
      }
      
      // 结果显示
      if (this.showResult) {
        this.buildResult(this.questions[this.currentIndex] || question)
      }
      
      // 导航按钮
      Row() {
        Button(getString('previous'))
          .enabled(this.currentIndex > 0 && !this.allSubmitted)
          .onClick(() => {
            // previousQuestion方法内部已经调用了saveCurrentAnswer，这里不需要重复调用
            this.previousQuestion();
          })
          .margin({ right: 10 })
        
        Button(getString('next'))
          .enabled(this.currentIndex < this.questions.length - 1 && !this.allSubmitted)
          .onClick(() => {
            // nextQuestion方法内部已经调用了saveCurrentAnswer，这里不需要重复调用
            this.nextQuestion();
          })
          .margin({ left: 10 })
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .margin({ top: 30 })
      
      // 提交按钮
      if (!this.allSubmitted) {
        Button(this.checkAllAnswered() ? getString('submit_all') : getString('submit_all'))
          .width('80%')
          .enabled(this.checkAllAnswered())
          .onClick(() => {
            this.submitAllAnswers();
          })
          .margin({ top: 20 })
      } else {
        Text(getString('practice_completed'))
          .fontSize(16)
          .fontColor('#52C41A')
          .margin({ top: 20 })
      }
    }
    .width('100%')
  }

  @Builder
  buildOptions(question: Question) {
    // 注意：在@Builder方法中不能使用const变量声明，所以直接使用this.questions[this.currentIndex]来确保使用当前题目
    // 优先使用当前索引的题目，确保类型判断正确
    Column() {
      // 使用当前题目的类型来判断，而不是传入的question参数
      if ((this.questions[this.currentIndex]?.type || question.type) === AppConstants.QUESTION_TYPE_JUDGMENT) {
        // 判断题：正确/错误
        Column() {
          Toggle({ type: ToggleType.Checkbox, isOn: this.selectedAnswer === '正确' })
            .onChange((isOn: boolean) => {
              if (isOn) {
                this.selectedAnswer = '正确';
                this.saveCurrentAnswer();
              } else if (this.selectedAnswer === '正确') {
                // 如果取消选中"正确"，清空答案
                this.selectedAnswer = '';
                this.saveCurrentAnswer();
              }
            })
            .margin({ bottom: 10 })
          Text('正确')
            .fontSize(14)
            .margin({ left: 10 })
          
          Toggle({ type: ToggleType.Checkbox, isOn: this.selectedAnswer === '错误' })
            .onChange((isOn: boolean) => {
              if (isOn) {
                this.selectedAnswer = '错误';
                this.saveCurrentAnswer();
              } else if (this.selectedAnswer === '错误') {
                // 如果取消选中"错误"，清空答案
                this.selectedAnswer = '';
                this.saveCurrentAnswer();
              }
            })
            .margin({ bottom: 10 })
          Text('错误')
            .fontSize(14)
            .margin({ left: 10 })
        }
      } else {
        // 单选题：显示选项
        // 使用当前题目的选项，而不是传入的question参数
        Column() {
          ForEach((this.questions[this.currentIndex]?.options || question.options), (option: string, index: number) => {
            Row() {
              Toggle({ type: ToggleType.Checkbox, isOn: this.selectedAnswer === option })
                .onChange((isOn: boolean) => {
                  if (isOn) {
                    this.selectedAnswer = option;
                    this.saveCurrentAnswer();
                  }
                })
              Text(option)
                .fontSize(14)
                .margin({ left: 10 })
            }
            .width('100%')
            .margin({ bottom: 10 })
          })
        }
      }
    }
    .width('100%')
  }

  @Builder
  buildFillBlank(question: Question) {
    // 使用question.id作为key，确保TextInput在切换题目时能正确更新
    // TextInput的text属性直接绑定到fillAnswer @State变量，确保响应式更新和onChange事件正确触发
    TextInput({ placeholder: getString('input_answer'), text: this.fillAnswer })
      .width('100%')
      .height(50)
      .enabled(!this.allSubmitted)
      .id(`fill-input-${question.id}`)
      .onChange((value: string) => {
        // 立即更新fillAnswer状态（这会触发UI更新）
        this.fillAnswer = value;
        // 立即保存答案到tempAnswers（无论是否为空都保存，以便后续加载）
        // 注意：保存时使用trim()去除首尾空格，但fillAnswer保留原始值以便用户继续编辑
        this.tempAnswers.set(question.id, value.trim());
        // 调用saveCurrentAnswer确保答案被保存
        this.saveCurrentAnswer();
      })
      .onSubmit((enterKey: number) => {
        // 当用户按回车提交时，确保答案被保存
        const answerToSave = this.fillAnswer.trim();
        if (answerToSave.length > 0) {
          this.tempAnswers.set(question.id, answerToSave);
        } else {
          // 即使答案为空，也保存（用于标记用户已经操作过）
          this.tempAnswers.set(question.id, '');
        }
        this.saveCurrentAnswer();
      })
      .onEditChange((isEditing: boolean) => {
        // 当输入框失去焦点时，确保答案被保存
        if (!isEditing) {
          // 失去焦点时，确保答案被保存
          const answerToSave = this.fillAnswer.trim();
          if (answerToSave.length > 0) {
            this.tempAnswers.set(question.id, answerToSave);
          } else {
            // 即使答案为空，也保存（用于标记用户已经操作过）
            this.tempAnswers.set(question.id, '');
          }
          this.saveCurrentAnswer();
        }
      })
      .margin({ bottom: 20 })
  }

  @Builder
  buildResult(question: Question) {
    Column() {
      Text(this.isCorrect ? getString('answer_correct') : getString('answer_wrong'))
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor(this.isCorrect ? '#52C41A' : '#FF4D4F')
        .margin({ bottom: 10 })
      
      if (!this.isCorrect) {
        Text(`${getString('correct_answer')}: ${question.correctAnswer}`)
          .fontSize(16)
          .fontColor('#666666')
          .margin({ bottom: 10 })
      }
      
      if (this.explanation) {
        Text(this.explanation)
          .fontSize(14)
          .fontColor('#999999')
      }
    }
    .width('100%')
    .padding(15)
    .backgroundColor('#F5F5F5')
    .borderRadius(8)
    .margin({ top: 20, bottom: 20 })
  }

  saveCurrentAnswer() {
    if (this.allSubmitted || this.currentIndex >= this.questions.length) {
      return;
    }
    const question = this.questions[this.currentIndex];
    
    // 检查question.id是否有效
    if (!question.id || question.id <= 0) {
      Logger.warnWithTag('PracticeActivityPage', `Cannot save answer: question has invalid id: ${question.id}`);
      return;
    }
    
    let answer = '';
    
    if (question.type === AppConstants.QUESTION_TYPE_FILL_BLANK) {
      // 对于填空题，优先从tempAnswers获取（因为onChange已经保存了），如果tempAnswers中没有，再使用fillAnswer
      answer = this.tempAnswers.get(question.id) || this.fillAnswer.trim();
    } else {
      answer = this.selectedAnswer.trim();
    }
    
    // 保存答案，即使为空也保存（用于标记用户已查看过该题目）
    // 但只有非空答案才真正保存到tempAnswers中
    if (answer && answer.length > 0) {
      this.tempAnswers.set(question.id, answer);
      Logger.debugWithTag('PracticeActivityPage', `Saved answer for question ${question.id}: ${answer.substring(0, 20)}`);
    } else {
      // 如果答案为空，不删除已保存的答案（保留用户之前的选择）
      // 只有在用户明确清空答案时才删除
      if (this.tempAnswers.has(question.id)) {
        // 如果之前有答案，但现在为空，可能是用户清空了，保留之前的答案
        Logger.debugWithTag('PracticeActivityPage', `Answer is empty for question ${question.id}, keeping previous answer if exists`);
      }
    }
  }

  checkAllAnswered(): boolean {
    if (this.questions.length === 0) {
      Logger.debugWithTag('PracticeActivityPage', 'No questions to check');
      return false;
    }
    
    // 先保存当前题目的答案
    this.saveCurrentAnswer();
    
    for (const question of this.questions) {
      // 检查question.id是否有效
      if (!question.id || question.id <= 0) {
        Logger.warnWithTag('PracticeActivityPage', `Question has invalid id: ${question.id}, content: ${question.content}`);
        return false;
      }
      
      const answer = this.tempAnswers.get(question.id);
      // 检查答案是否存在且不为空
      if (!this.tempAnswers.has(question.id) || answer === undefined || answer === null || answer.trim().length === 0) {
        Logger.debugWithTag('PracticeActivityPage', `Question ${question.id} (${question.content.substring(0, 20)}...) has no answer`);
        return false;
      }
    }
    
    Logger.debugWithTag('PracticeActivityPage', `All ${this.questions.length} questions answered`);
    return true;
  }

  async submitAllAnswers() {
    if (!this.checkAllAnswered()) {
      this.showToast(getString('please_answer_all'));
      return;
    }
    
    // 保存当前题目的答案
    this.saveCurrentAnswer();
    
    // 检查userId是否有效
    if (this.userId === -1 || this.userId <= 0) {
      this.showToast('用户未登录，无法提交答案');
      Logger.warnWithTag('PracticeActivityPage', 'Cannot submit answers: userId is invalid');
      return;
    }
    
    let correctCount = 0;
    let wrongCount = 0;
    const wrongQuestionIds: number[] = [];
    
    // 提交所有答案
    Logger.debugWithTag('PracticeActivityPage', `Starting to submit ${this.questions.length} answers`);
    
    for (const question of this.questions) {
      // 检查question.id是否有效
      if (!question.id || question.id <= 0) {
        Logger.errorWithTag('PracticeActivityPage', `Cannot submit: question has invalid id: ${question.id}, content: ${question.content}`);
        continue;
      }
      
      const answer = this.tempAnswers.get(question.id) || '';
      if (!answer || answer.trim().length === 0) {
        Logger.warnWithTag('PracticeActivityPage', `Question ${question.id} has no answer, skipping`);
        continue;
      }
      
      const isCorrect = AnswerChecker.checkAnswer(question, answer);
      Logger.debugWithTag('PracticeActivityPage', `Question ${question.id}: answer=${answer}, isCorrect=${isCorrect}`);
      
      // 保存答案
      const answerEntity: AnswerEntity = {
        userId: this.userId,
        questionId: question.id,
        userAnswer: answer.trim(),
        isCorrect: isCorrect,
        answerTime: Date.now()
      };
      
      try {
        await this.questionRepository.insertAnswer(answerEntity);
        Logger.debugWithTag('PracticeActivityPage', `Successfully saved answer for question ${question.id}`);
        
        if (isCorrect) {
          correctCount++;
          // 如果是复习模式且答对了，从错题本中移除
          if (this.isReviewMode) {
            await this.questionRepository.removeWrongQuestion(this.userId, question.id);
          }
        } else {
          wrongCount++;
          wrongQuestionIds.push(question.id);
          // 添加到错题本
          await this.questionRepository.addWrongQuestion(this.userId, question.id, answer.trim());
          // 如果是复习模式且答错了，增加复习次数
          if (this.isReviewMode) {
            await this.questionRepository.incrementReviewCount(this.userId, question.id);
          }
        }
      } catch (error) {
        Logger.errorWithTag('PracticeActivityPage', `Failed to save answer for question ${question.id}`, error as Error);
        // 即使保存失败，也继续处理其他题目
      }
    }
    
    this.allSubmitted = true;
    // 不清空tempAnswers，保留答案用于显示
    // 注意：在页面销毁时应该清理资源
    
    // 显示结果
    const total = this.questions.length;
    const accuracy = total > 0 ? (correctCount * 100.0 / total) : 0;
    const message = `${getString('total_answered')}: ${total}\n${getString('correct_count')}: ${correctCount}\n${getString('wrong_count')}: ${wrongCount}\n${getString('accuracy_display')}: ${accuracy.toFixed(1)}%`;
    
    promptAction.showDialog({
      title: getString('grading_result'),
      message: message,
      buttons: [
        {
          text: getString('confirm'),
          color: '#007DFF'
        }
      ]
    });
    
    // 刷新当前题目显示，显示提交后的结果
    this.loadQuestion();
  }

  previousQuestion() {
    if (this.currentIndex > 0) {
      // 在切换题目前，先保存当前题目的答案
      // 必须在修改currentIndex之前保存，因为saveCurrentAnswer依赖currentIndex
      const oldIndex = this.currentIndex;
      const oldQuestion = this.questions[oldIndex];
      
      // 先尝试从当前状态获取答案（可能在TextInput中但还没有同步到fillAnswer）
      let currentAnswer = '';
      if (oldQuestion.type === AppConstants.QUESTION_TYPE_FILL_BLANK) {
        currentAnswer = this.fillAnswer.trim();
      } else {
        currentAnswer = this.selectedAnswer.trim();
      }
      
      // 如果有输入但还没有保存，立即保存
      if (currentAnswer && currentAnswer.length > 0) {
        this.tempAnswers.set(oldQuestion.id, currentAnswer);
      }
      
      // 然后调用saveCurrentAnswer（可能会再次保存，但这是安全的）
      this.saveCurrentAnswer();
      
      this.currentIndex--;
      this.loadQuestion();
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      // 在切换题目前，先保存当前题目的答案
      // 必须在修改currentIndex之前保存，因为saveCurrentAnswer依赖currentIndex
      const oldIndex = this.currentIndex;
      const oldQuestion = this.questions[oldIndex];
      
      // 先尝试从当前状态获取答案（可能在TextInput中但还没有同步到fillAnswer）
      // 对于填空题，优先从tempAnswers获取（因为onChange已经保存了），如果tempAnswers中没有，再使用fillAnswer
      let currentAnswer = '';
      if (oldQuestion.type === AppConstants.QUESTION_TYPE_FILL_BLANK) {
        // 优先从tempAnswers获取，因为onChange已经保存了
        currentAnswer = this.tempAnswers.get(oldQuestion.id) || this.fillAnswer.trim();
      } else {
        currentAnswer = this.selectedAnswer.trim();
      }
      
      // 如果有输入但还没有保存，立即保存
      if (currentAnswer && currentAnswer.length > 0) {
        this.tempAnswers.set(oldQuestion.id, currentAnswer);
      }
      
      // 然后调用saveCurrentAnswer（可能会再次保存，但这是安全的）
      this.saveCurrentAnswer();
      
      this.currentIndex++;
      this.loadQuestion();
    }
  }

  loadQuestion() {
    if (this.currentIndex >= this.questions.length) {
      Logger.warnWithTag('PracticeActivityPage', `Invalid currentIndex: ${this.currentIndex}, questions length: ${this.questions.length}`);
      return;
    }
    
    const question = this.questions[this.currentIndex];
    
    // 检查question.id是否有效
    if (!question.id || question.id <= 0) {
      Logger.errorWithTag('PracticeActivityPage', `Question at index ${this.currentIndex} has invalid id: ${question.id}, content: ${question.content}`);
    }
    
    // 更新currentQuestion @State变量以强制UI更新
    // 注意：在ArkUI中，直接修改@State变量会自动触发build()方法重新执行
    this.currentQuestion = question;
    // 更新currentQuestionKey以强制UI重新渲染
    this.currentQuestionKey = `question-${question.id}-${this.currentIndex}`;
    
    this.showResult = false;
    this.explanation = '';
    
    // 重置答案状态（准备加载新题目的答案）
    // 注意：在previousQuestion/nextQuestion中已经保存了旧题目的答案，所以这里直接重置即可
    // 根据题目类型，只重置对应的答案状态，避免状态混乱
    if (question.type === AppConstants.QUESTION_TYPE_FILL_BLANK) {
      // 填空题：重置fillAnswer，清空selectedAnswer（避免之前选择题的答案残留）
      this.fillAnswer = '';
      this.selectedAnswer = '';
    } else {
      // 选择题/判断题：重置selectedAnswer，清空fillAnswer（避免之前填空题的答案残留）
      this.selectedAnswer = '';
      this.fillAnswer = '';
    }
    
    // 如果已提交，加载已提交的答案和结果
    if (this.allSubmitted) {
      this.loadSubmittedAnswer();
    } else {
      // 未提交时，加载临时答案（用户之前选择的答案）
      if (question.id && question.id > 0) {
        const tempAnswer = this.tempAnswers.get(question.id);
        if (tempAnswer !== undefined && tempAnswer !== null) {
          // 即使答案为空字符串，也要加载（用于标记用户已经操作过）
          if (question.type === AppConstants.QUESTION_TYPE_FILL_BLANK) {
            this.fillAnswer = tempAnswer;
            // 确保selectedAnswer为空（避免显示错误）
            this.selectedAnswer = '';
          } else {
            this.selectedAnswer = tempAnswer;
            // 确保fillAnswer为空（避免显示错误）
            this.fillAnswer = '';
          }
          if (tempAnswer.trim().length > 0) {
            Logger.debugWithTag('PracticeActivityPage', `Loaded saved answer for question ${question.id}: ${tempAnswer.substring(0, 20)}`);
          } else {
            Logger.debugWithTag('PracticeActivityPage', `Loaded empty answer for question ${question.id} (user has interacted)`);
          }
        } else {
          Logger.debugWithTag('PracticeActivityPage', `No saved answer found for question ${question.id}`);
        }
      }
    }
  }

  showToast(message: string) {
    promptAction.showToast({
      message: message,
      duration: 2000
    });
  }
}
