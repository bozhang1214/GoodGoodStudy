if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PracticeActivityPage_Params {
    questions?: Question[];
    currentIndex?: number;
    selectedAnswer?: string;
    fillAnswer?: string;
    allSubmitted?: boolean;
    isLoading?: boolean;
    showResult?: boolean;
    isCorrect?: boolean;
    explanation?: string;
    subjectId?: number;
    grade?: number;
    isReviewMode?: boolean;
    wrongQuestionIds?: number[];
    userId?: number;
    tempAnswers?: Map<number, string>;
    questionRepository?: QuestionRepository;
    userRepository?: UserRepository;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { getString } from "@normalized:N&&&entry/src/main/ets/utils/ResourceUtil&";
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
import { QuestionRepository } from "@normalized:N&&&entry/src/main/ets/repository/QuestionRepository&";
import { UserRepository } from "@normalized:N&&&entry/src/main/ets/repository/UserRepository&";
import type { Question } from '../model/Question';
import { AnswerChecker } from "@normalized:N&&&entry/src/main/ets/utils/AnswerChecker&";
import type { AnswerEntity } from '../database/dao/AnswerDao';
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
import { InputValidator } from "@normalized:N&&&entry/src/main/ets/utils/InputValidator&";
export class PracticeActivityPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__questions = new ObservedPropertyObjectPU([], this, "questions");
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__selectedAnswer = new ObservedPropertySimplePU('', this, "selectedAnswer");
        this.__fillAnswer = new ObservedPropertySimplePU('', this, "fillAnswer");
        this.__allSubmitted = new ObservedPropertySimplePU(false, this, "allSubmitted");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__showResult = new ObservedPropertySimplePU(false, this, "showResult");
        this.__isCorrect = new ObservedPropertySimplePU(false, this, "isCorrect");
        this.__explanation = new ObservedPropertySimplePU('', this, "explanation");
        this.subjectId = AppConstants.SUBJECT_MATH;
        this.grade = 1;
        this.isReviewMode = false;
        this.wrongQuestionIds = [];
        this.userId = -1;
        this.tempAnswers = new Map();
        this.questionRepository = new QuestionRepository();
        this.userRepository = new UserRepository();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PracticeActivityPage_Params) {
        if (params.questions !== undefined) {
            this.questions = params.questions;
        }
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.selectedAnswer !== undefined) {
            this.selectedAnswer = params.selectedAnswer;
        }
        if (params.fillAnswer !== undefined) {
            this.fillAnswer = params.fillAnswer;
        }
        if (params.allSubmitted !== undefined) {
            this.allSubmitted = params.allSubmitted;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.showResult !== undefined) {
            this.showResult = params.showResult;
        }
        if (params.isCorrect !== undefined) {
            this.isCorrect = params.isCorrect;
        }
        if (params.explanation !== undefined) {
            this.explanation = params.explanation;
        }
        if (params.subjectId !== undefined) {
            this.subjectId = params.subjectId;
        }
        if (params.grade !== undefined) {
            this.grade = params.grade;
        }
        if (params.isReviewMode !== undefined) {
            this.isReviewMode = params.isReviewMode;
        }
        if (params.wrongQuestionIds !== undefined) {
            this.wrongQuestionIds = params.wrongQuestionIds;
        }
        if (params.userId !== undefined) {
            this.userId = params.userId;
        }
        if (params.tempAnswers !== undefined) {
            this.tempAnswers = params.tempAnswers;
        }
        if (params.questionRepository !== undefined) {
            this.questionRepository = params.questionRepository;
        }
        if (params.userRepository !== undefined) {
            this.userRepository = params.userRepository;
        }
    }
    updateStateVars(params: PracticeActivityPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__questions.purgeDependencyOnElmtId(rmElmtId);
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedAnswer.purgeDependencyOnElmtId(rmElmtId);
        this.__fillAnswer.purgeDependencyOnElmtId(rmElmtId);
        this.__allSubmitted.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__showResult.purgeDependencyOnElmtId(rmElmtId);
        this.__isCorrect.purgeDependencyOnElmtId(rmElmtId);
        this.__explanation.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__questions.aboutToBeDeleted();
        this.__currentIndex.aboutToBeDeleted();
        this.__selectedAnswer.aboutToBeDeleted();
        this.__fillAnswer.aboutToBeDeleted();
        this.__allSubmitted.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__showResult.aboutToBeDeleted();
        this.__isCorrect.aboutToBeDeleted();
        this.__explanation.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __questions: ObservedPropertyObjectPU<Question[]>;
    get questions() {
        return this.__questions.get();
    }
    set questions(newValue: Question[]) {
        this.__questions.set(newValue);
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __selectedAnswer: ObservedPropertySimplePU<string>;
    get selectedAnswer() {
        return this.__selectedAnswer.get();
    }
    set selectedAnswer(newValue: string) {
        this.__selectedAnswer.set(newValue);
    }
    private __fillAnswer: ObservedPropertySimplePU<string>;
    get fillAnswer() {
        return this.__fillAnswer.get();
    }
    set fillAnswer(newValue: string) {
        this.__fillAnswer.set(newValue);
    }
    private __allSubmitted: ObservedPropertySimplePU<boolean>;
    get allSubmitted() {
        return this.__allSubmitted.get();
    }
    set allSubmitted(newValue: boolean) {
        this.__allSubmitted.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __showResult: ObservedPropertySimplePU<boolean>;
    get showResult() {
        return this.__showResult.get();
    }
    set showResult(newValue: boolean) {
        this.__showResult.set(newValue);
    }
    private __isCorrect: ObservedPropertySimplePU<boolean>;
    get isCorrect() {
        return this.__isCorrect.get();
    }
    set isCorrect(newValue: boolean) {
        this.__isCorrect.set(newValue);
    }
    private __explanation: ObservedPropertySimplePU<string>;
    get explanation() {
        return this.__explanation.get();
    }
    set explanation(newValue: string) {
        this.__explanation.set(newValue);
    }
    private subjectId: number;
    private grade: number;
    private isReviewMode: boolean;
    private wrongQuestionIds: number[];
    private userId: number;
    private tempAnswers: Map<number, string>;
    private questionRepository: QuestionRepository;
    private userRepository: UserRepository;
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
            }
            else {
                // 正常模式：加载所有题目
                let allQuestions = await this.questionRepository.getQuestions(this.subjectId, this.grade);
                // 限制题目数量
                const maxQuestions = AppConstants.DEBUG_QUESTIONS_PER_PRACTICE;
                if (allQuestions.length > maxQuestions) {
                    // 打乱顺序并取前maxQuestions道
                    for (let i = allQuestions.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        const temp = allQuestions[i];
                        allQuestions[i] = allQuestions[j];
                        allQuestions[j] = temp;
                    }
                    this.questions = allQuestions.slice(0, maxQuestions);
                }
                else {
                    this.questions = allQuestions;
                }
            }
            if (this.questions.length === 0) {
                this.showToast(getString('no_questions'));
                router.back();
                return;
            }
            // 加载第一题
            this.loadQuestion();
        }
        catch (error) {
            Logger.errorWithTag('PracticeActivityPage', 'Failed to load questions', error as Error);
            this.showToast(getString('load_failed'));
            router.back();
        }
        finally {
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
                this.selectedAnswer = answer.userAnswer;
                this.fillAnswer = answer.userAnswer;
                this.isCorrect = answer.isCorrect;
                this.showResult = true;
                this.explanation = question.explanation || '';
            }
        }
        catch (error) {
            Logger.errorWithTag('PracticeActivityPage', 'Failed to load submitted answer', error as Error);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(131:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(133:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(134:11)", "entry");
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(getString('loading'));
                        Text.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(135:11)", "entry");
                        Text.margin({ top: 10 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else if (this.questions.length > 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildQuestionContent.bind(this)(this.questions[this.currentIndex]);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    buildQuestionContent(question: Question, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(151:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 题目编号
            Text.create(`第 ${this.currentIndex + 1} 题 / 共 ${this.questions.length} 题`);
            Text.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(153:7)", "entry");
            // 题目编号
            Text.fontSize(16);
            // 题目编号
            Text.fontColor('#666666');
            // 题目编号
            Text.margin({ bottom: 20 });
        }, Text);
        // 题目编号
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 题目内容
            Text.create(question.content);
            Text.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(159:7)", "entry");
            // 题目内容
            Text.fontSize(18);
            // 题目内容
            Text.fontWeight(FontWeight.Bold);
            // 题目内容
            Text.margin({ bottom: 30 });
        }, Text);
        // 题目内容
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 根据题目类型显示不同的输入方式
            if (question.type === AppConstants.QUESTION_TYPE_SINGLE_CHOICE ||
                question.type === AppConstants.QUESTION_TYPE_JUDGMENT) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildOptions.bind(this)(question);
                });
            }
            else if (question.type === AppConstants.QUESTION_TYPE_FILL_BLANK) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildFillBlank.bind(this)(question);
                });
            }
            // 结果显示
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 结果显示
            if (this.showResult) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildResult.bind(this)(question);
                });
            }
            // 导航按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 导航按钮
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(178:7)", "entry");
            // 导航按钮
            Row.width('100%');
            // 导航按钮
            Row.justifyContent(FlexAlign.Center);
            // 导航按钮
            Row.margin({ top: 30 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(getString('previous'));
            Button.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(179:9)", "entry");
            Button.enabled(this.currentIndex > 0 && !this.allSubmitted);
            Button.onClick(() => {
                this.saveCurrentAnswer();
                this.previousQuestion();
            });
            Button.margin({ right: 10 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(getString('next'));
            Button.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(187:9)", "entry");
            Button.enabled(this.currentIndex < this.questions.length - 1 && !this.allSubmitted);
            Button.onClick(() => {
                this.saveCurrentAnswer();
                this.nextQuestion();
            });
            Button.margin({ left: 10 });
        }, Button);
        Button.pop();
        // 导航按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 提交按钮
            if (!this.allSubmitted) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.checkAllAnswered() ? getString('submit_all') : getString('submit_all'));
                        Button.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(201:9)", "entry");
                        Button.width('80%');
                        Button.enabled(this.checkAllAnswered());
                        Button.onClick(() => {
                            this.submitAllAnswers();
                        });
                        Button.margin({ top: 20 });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(getString('practice_completed'));
                        Text.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(209:9)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#52C41A');
                        Text.margin({ top: 20 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    buildOptions(question: Question, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(220:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (question.type === AppConstants.QUESTION_TYPE_JUDGMENT) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 判断题：正确/错误
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(223:9)", "entry");
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Toggle.create({ type: ToggleType.Checkbox, isOn: this.selectedAnswer === '正确' });
                        Toggle.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(224:11)", "entry");
                        Toggle.onChange((isOn: boolean) => {
                            if (isOn) {
                                this.selectedAnswer = '正确';
                                this.saveCurrentAnswer();
                            }
                        });
                        Toggle.margin({ bottom: 10 });
                    }, Toggle);
                    Toggle.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正确');
                        Text.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(232:11)", "entry");
                        Text.fontSize(14);
                        Text.margin({ left: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Toggle.create({ type: ToggleType.Checkbox, isOn: this.selectedAnswer === '错误' });
                        Toggle.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(236:11)", "entry");
                        Toggle.onChange((isOn: boolean) => {
                            if (isOn) {
                                this.selectedAnswer = '错误';
                                this.saveCurrentAnswer();
                            }
                        });
                        Toggle.margin({ bottom: 10 });
                    }, Toggle);
                    Toggle.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('错误');
                        Text.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(244:11)", "entry");
                        Text.fontSize(14);
                        Text.margin({ left: 10 });
                    }, Text);
                    Text.pop();
                    // 判断题：正确/错误
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 单选题：显示选项
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(250:9)", "entry");
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const option = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(252:13)", "entry");
                                Row.width('100%');
                                Row.margin({ bottom: 10 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Toggle.create({ type: ToggleType.Checkbox, isOn: this.selectedAnswer === option });
                                Toggle.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(253:15)", "entry");
                                Toggle.onChange((isOn: boolean) => {
                                    if (isOn) {
                                        this.selectedAnswer = option;
                                        this.saveCurrentAnswer();
                                    }
                                });
                            }, Toggle);
                            Toggle.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(option);
                                Text.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(260:15)", "entry");
                                Text.fontSize(14);
                                Text.margin({ left: 10 });
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, question.options, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    // 单选题：显示选项
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    buildFillBlank(question: Question, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: getString('input_answer'), text: this.fillAnswer });
            TextInput.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(275:5)", "entry");
            TextInput.width('100%');
            TextInput.height(50);
            TextInput.enabled(!this.allSubmitted);
            TextInput.onChange((value: string) => {
                this.fillAnswer = value;
                this.saveCurrentAnswer();
            });
            TextInput.margin({ bottom: 20 });
        }, TextInput);
    }
    buildResult(question: Question, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(288:5)", "entry");
            Column.width('100%');
            Column.padding(15);
            Column.backgroundColor('#F5F5F5');
            Column.borderRadius(8);
            Column.margin({ top: 20, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isCorrect ? getString('answer_correct') : getString('answer_wrong'));
            Text.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(289:7)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.isCorrect ? '#52C41A' : '#FF4D4F');
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isCorrect) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${getString('correct_answer')}: ${question.correctAnswer}`);
                        Text.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(296:9)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.explanation) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.explanation);
                        Text.debugLine("entry/src/main/ets/pages/PracticeActivityPage.ets(303:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    saveCurrentAnswer() {
        if (this.allSubmitted || this.currentIndex >= this.questions.length) {
            return;
        }
        const question = this.questions[this.currentIndex];
        let answer = '';
        if (question.type === AppConstants.QUESTION_TYPE_FILL_BLANK) {
            answer = this.fillAnswer.trim();
        }
        else {
            answer = this.selectedAnswer;
        }
        if (answer) {
            this.tempAnswers.set(question.id, answer);
        }
        else {
            this.tempAnswers.delete(question.id);
        }
    }
    checkAllAnswered(): boolean {
        if (this.questions.length === 0) {
            return false;
        }
        for (const question of this.questions) {
            const answer = this.tempAnswers.get(question.id);
            if (!answer || answer.trim().length === 0) {
                return false;
            }
        }
        return true;
    }
    async submitAllAnswers() {
        if (!this.checkAllAnswered()) {
            this.showToast(getString('please_answer_all'));
            return;
        }
        // 保存所有答案
        this.saveCurrentAnswer();
        let correctCount = 0;
        let wrongCount = 0;
        const wrongQuestionIds: number[] = [];
        // 提交所有答案
        for (const question of this.questions) {
            const answer = this.tempAnswers.get(question.id) || '';
            const isCorrect = AnswerChecker.checkAnswer(question, answer, '正确');
            // 保存答案
            const answerEntity: AnswerEntity = {
                userId: this.userId,
                questionId: question.id,
                userAnswer: answer,
                isCorrect: isCorrect,
                answerTime: Date.now()
            };
            try {
                await this.questionRepository.insertAnswer(answerEntity);
                if (isCorrect) {
                    correctCount++;
                    // 如果是复习模式且答对了，从错题本中移除
                    if (this.isReviewMode) {
                        await this.questionRepository.removeWrongQuestion(this.userId, question.id);
                    }
                }
                else {
                    wrongCount++;
                    wrongQuestionIds.push(question.id);
                    // 添加到错题本
                    await this.questionRepository.addWrongQuestion(this.userId, question.id, answer);
                    // 如果是复习模式且答错了，增加复习次数
                    if (this.isReviewMode) {
                        await this.questionRepository.incrementReviewCount(this.userId, question.id);
                    }
                }
            }
            catch (error) {
                Logger.errorWithTag('PracticeActivityPage', 'Failed to save answer', error as Error);
            }
        }
        this.allSubmitted = true;
        this.tempAnswers.clear();
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
        // 刷新当前题目显示
        this.loadQuestion();
    }
    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.loadQuestion();
        }
    }
    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.loadQuestion();
        }
    }
    loadQuestion() {
        if (this.currentIndex >= this.questions.length) {
            return;
        }
        const question = this.questions[this.currentIndex];
        this.showResult = false;
        this.explanation = '';
        // 加载临时答案或已提交的答案
        const tempAnswer = this.tempAnswers.get(question.id);
        if (tempAnswer) {
            if (question.type === AppConstants.QUESTION_TYPE_FILL_BLANK) {
                this.fillAnswer = tempAnswer;
            }
            else {
                this.selectedAnswer = tempAnswer;
            }
        }
        else {
            this.fillAnswer = '';
            this.selectedAnswer = '';
        }
        // 如果已提交，加载结果
        if (this.allSubmitted) {
            this.loadSubmittedAnswer();
        }
    }
    showToast(message: string) {
        promptAction.showToast({
            message: message,
            duration: 2000
        });
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PracticeActivityPage";
    }
}
registerNamedRoute(() => new PracticeActivityPage(undefined, {}), "", { bundleName: "com.edu.primary", moduleName: "entry", pagePath: "pages/PracticeActivityPage", pageFullPath: "entry/src/main/ets/pages/PracticeActivityPage", integratedHsp: "false", moduleType: "followWithHap" });
