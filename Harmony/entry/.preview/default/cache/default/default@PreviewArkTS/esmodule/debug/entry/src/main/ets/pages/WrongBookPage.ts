if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WrongBookPage_Params {
    wrongQuestions?: Array<WrongQuestionEntity>;
    userRepository?: UserRepository;
    questionRepository?: QuestionRepository;
}
import router from "@ohos:router";
import { getString } from "@normalized:N&&&entry/src/main/ets/utils/ResourceUtil&";
import { UserRepository } from "@normalized:N&&&entry/src/main/ets/repository/UserRepository&";
import { QuestionRepository } from "@normalized:N&&&entry/src/main/ets/repository/QuestionRepository&";
import type { WrongQuestionEntity } from '../database/dao/WrongQuestionDao';
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
export class WrongBookPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__wrongQuestions = new ObservedPropertyObjectPU([], this, "wrongQuestions");
        this.userRepository = new UserRepository();
        this.questionRepository = new QuestionRepository();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WrongBookPage_Params) {
        if (params.wrongQuestions !== undefined) {
            this.wrongQuestions = params.wrongQuestions;
        }
        if (params.userRepository !== undefined) {
            this.userRepository = params.userRepository;
        }
        if (params.questionRepository !== undefined) {
            this.questionRepository = params.questionRepository;
        }
    }
    updateStateVars(params: WrongBookPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__wrongQuestions.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__wrongQuestions.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __wrongQuestions: ObservedPropertyObjectPU<Array<WrongQuestionEntity>>;
    get wrongQuestions() {
        return this.__wrongQuestions.get();
    }
    set wrongQuestions(newValue: Array<WrongQuestionEntity>) {
        this.__wrongQuestions.set(newValue);
    }
    private userRepository: UserRepository;
    private questionRepository: QuestionRepository;
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
        }
        catch (error) {
            Logger.errorWithTag('WrongBookPage', 'Failed to load wrong questions', error as Error);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(36:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString('wrong_questions'));
            Text.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(37:7)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 30, bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.wrongQuestions.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(43:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(getString('no_wrong_questions'));
                        Text.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(44:11)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(52:9)", "entry");
                        List.width('100%');
                        List.layoutWeight(1);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                    ListItem.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(54:13)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(55:15)", "entry");
                                        Column.width('100%');
                                        Column.padding(15);
                                        Column.backgroundColor('#FFFFFF');
                                        Column.borderRadius(8);
                                        Column.margin({ bottom: 10 });
                                        Column.onClick(() => {
                                            this.startReview(item);
                                        });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`题目ID: ${item.questionId}`);
                                        Text.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(56:17)", "entry");
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Bold);
                                        Text.margin({ bottom: 5 });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`你的答案: ${item.userAnswer}`);
                                        Text.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(60:17)", "entry");
                                        Text.fontSize(14);
                                        Text.fontColor('#666666');
                                        Text.margin({ bottom: 5 });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`时间: ${new Date(item.wrongTime).toLocaleString()}`);
                                        Text.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(64:17)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#999999');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.reviewCount > 0) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(`复习次数: ${item.reviewCount}`);
                                                    Text.debugLine("entry/src/main/ets/pages/WrongBookPage.ets(68:19)", "entry");
                                                    Text.fontSize(12);
                                                    Text.fontColor('#999999');
                                                    Text.margin({ top: 5 });
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
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.wrongQuestions, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
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
        }
        catch (error) {
            Logger.errorWithTag('WrongBookPage', 'Failed to start review', error as Error);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
