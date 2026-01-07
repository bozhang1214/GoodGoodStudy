if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProgressPage_Params {
    totalQuestions?: number;
    completedQuestions?: number;
    accuracyRate?: number;
    userRepository?: UserRepository;
    questionRepository?: QuestionRepository;
}
import { getString } from "@normalized:N&&&entry/src/main/ets/utils/ResourceUtil&";
import { UserRepository } from "@normalized:N&&&entry/src/main/ets/repository/UserRepository&";
import { QuestionRepository } from "@normalized:N&&&entry/src/main/ets/repository/QuestionRepository&";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
export class ProgressPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__totalQuestions = new ObservedPropertySimplePU(0, this, "totalQuestions");
        this.__completedQuestions = new ObservedPropertySimplePU(0, this, "completedQuestions");
        this.__accuracyRate = new ObservedPropertySimplePU(0, this, "accuracyRate");
        this.userRepository = new UserRepository();
        this.questionRepository = new QuestionRepository();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProgressPage_Params) {
        if (params.totalQuestions !== undefined) {
            this.totalQuestions = params.totalQuestions;
        }
        if (params.completedQuestions !== undefined) {
            this.completedQuestions = params.completedQuestions;
        }
        if (params.accuracyRate !== undefined) {
            this.accuracyRate = params.accuracyRate;
        }
        if (params.userRepository !== undefined) {
            this.userRepository = params.userRepository;
        }
        if (params.questionRepository !== undefined) {
            this.questionRepository = params.questionRepository;
        }
    }
    updateStateVars(params: ProgressPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__totalQuestions.purgeDependencyOnElmtId(rmElmtId);
        this.__completedQuestions.purgeDependencyOnElmtId(rmElmtId);
        this.__accuracyRate.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__totalQuestions.aboutToBeDeleted();
        this.__completedQuestions.aboutToBeDeleted();
        this.__accuracyRate.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __totalQuestions: ObservedPropertySimplePU<number>;
    get totalQuestions() {
        return this.__totalQuestions.get();
    }
    set totalQuestions(newValue: number) {
        this.__totalQuestions.set(newValue);
    }
    private __completedQuestions: ObservedPropertySimplePU<number>;
    get completedQuestions() {
        return this.__completedQuestions.get();
    }
    set completedQuestions(newValue: number) {
        this.__completedQuestions.set(newValue);
    }
    private __accuracyRate: ObservedPropertySimplePU<number>;
    get accuracyRate() {
        return this.__accuracyRate.get();
    }
    set accuracyRate(newValue: number) {
        this.__accuracyRate.set(newValue);
    }
    private userRepository: UserRepository;
    private questionRepository: QuestionRepository;
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
        }
        catch (error) {
            Logger.errorWithTag('ProgressPage', 'Failed to load progress', error as Error);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ProgressPage.ets(39:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString('learning_progress'));
            Text.debugLine("entry/src/main/ets/pages/ProgressPage.ets(40:7)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 30, bottom: 40 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ProgressPage.ets(45:7)", "entry");
            Row.width('90%');
            Row.padding(20);
            Row.backgroundColor('#F5F5F5');
            Row.borderRadius(10);
            Row.margin({ bottom: 30 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ProgressPage.ets(46:9)", "entry");
            Column.flexGrow(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.totalQuestions.toString());
            Text.debugLine("entry/src/main/ets/pages/ProgressPage.ets(47:11)", "entry");
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#007DFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString('total_questions'));
            Text.debugLine("entry/src/main/ets/pages/ProgressPage.ets(51:11)", "entry");
            Text.fontSize(14);
            Text.margin({ top: 5 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ProgressPage.ets(57:9)", "entry");
            Column.flexGrow(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.completedQuestions.toString());
            Text.debugLine("entry/src/main/ets/pages/ProgressPage.ets(58:11)", "entry");
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#52C41A');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString('completed_questions'));
            Text.debugLine("entry/src/main/ets/pages/ProgressPage.ets(62:11)", "entry");
            Text.fontSize(14);
            Text.margin({ top: 5 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ProgressPage.ets(68:9)", "entry");
            Column.flexGrow(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.accuracyRate.toFixed(1)}%`);
            Text.debugLine("entry/src/main/ets/pages/ProgressPage.ets(69:11)", "entry");
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FF6B6B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString('accuracy_rate'));
            Text.debugLine("entry/src/main/ets/pages/ProgressPage.ets(73:11)", "entry");
            Text.fontSize(14);
            Text.margin({ top: 5 });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
