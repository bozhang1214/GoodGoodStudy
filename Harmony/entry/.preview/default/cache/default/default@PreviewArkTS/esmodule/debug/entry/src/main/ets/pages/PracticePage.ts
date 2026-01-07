if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PracticePage_Params {
    selectedSubject?: number;
    selectedGrade?: number;
    isLoading?: boolean;
    questionRepository?: QuestionRepository;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { getString } from "@normalized:N&&&entry/src/main/ets/utils/ResourceUtil&";
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
import { QuestionRepository } from "@normalized:N&&&entry/src/main/ets/repository/QuestionRepository&";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
export class PracticePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__selectedSubject = new ObservedPropertySimplePU(AppConstants.SUBJECT_CHINESE, this, "selectedSubject");
        this.__selectedGrade = new ObservedPropertySimplePU(1, this, "selectedGrade");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.questionRepository = new QuestionRepository();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PracticePage_Params) {
        if (params.selectedSubject !== undefined) {
            this.selectedSubject = params.selectedSubject;
        }
        if (params.selectedGrade !== undefined) {
            this.selectedGrade = params.selectedGrade;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.questionRepository !== undefined) {
            this.questionRepository = params.questionRepository;
        }
    }
    updateStateVars(params: PracticePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__selectedSubject.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedGrade.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__selectedSubject.aboutToBeDeleted();
        this.__selectedGrade.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __selectedSubject: ObservedPropertySimplePU<number>;
    get selectedSubject() {
        return this.__selectedSubject.get();
    }
    set selectedSubject(newValue: number) {
        this.__selectedSubject.set(newValue);
    }
    private __selectedGrade: ObservedPropertySimplePU<number>;
    get selectedGrade() {
        return this.__selectedGrade.get();
    }
    set selectedGrade(newValue: number) {
        this.__selectedGrade.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private questionRepository: QuestionRepository;
    aboutToAppear() {
        this.questionRepository.init();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PracticePage.ets(23:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString('select_subject'));
            Text.debugLine("entry/src/main/ets/pages/PracticePage.ets(24:7)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 20, bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/PracticePage.ets(29:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(getString('subject_chinese'));
            Button.debugLine("entry/src/main/ets/pages/PracticePage.ets(30:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(this.selectedSubject === AppConstants.SUBJECT_CHINESE ? '#007DFF' : '#F0F0F0');
            Button.onClick(() => {
                this.selectedSubject = AppConstants.SUBJECT_CHINESE;
            });
            Button.margin({ right: 10 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(getString('subject_math'));
            Button.debugLine("entry/src/main/ets/pages/PracticePage.ets(38:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(this.selectedSubject === AppConstants.SUBJECT_MATH ? '#007DFF' : '#F0F0F0');
            Button.onClick(() => {
                this.selectedSubject = AppConstants.SUBJECT_MATH;
            });
            Button.margin({ right: 10 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(getString('subject_english'));
            Button.debugLine("entry/src/main/ets/pages/PracticePage.ets(46:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(this.selectedSubject === AppConstants.SUBJECT_ENGLISH ? '#007DFF' : '#F0F0F0');
            Button.onClick(() => {
                this.selectedSubject = AppConstants.SUBJECT_ENGLISH;
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString('select_grade'));
            Text.debugLine("entry/src/main/ets/pages/PracticePage.ets(57:7)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/PracticePage.ets(62:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.margin({ bottom: 30 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const grade = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(getString(`grade_${this.getGradeName(grade)}`));
                    Button.debugLine("entry/src/main/ets/pages/PracticePage.ets(64:11)", "entry");
                    Button.type(ButtonType.Normal);
                    Button.backgroundColor(this.selectedGrade === grade ? '#007DFF' : '#F0F0F0');
                    Button.onClick(() => {
                        this.selectedGrade = grade;
                    });
                    Button.margin({ right: 5 });
                }, Button);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, [1, 2, 3, 4, 5, 6], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(getString('start_practice'));
            Button.debugLine("entry/src/main/ets/pages/PracticePage.ets(77:7)", "entry");
            Button.width('80%');
            Button.height(50);
            Button.enabled(!this.isLoading);
            Button.onClick(() => {
                this.startPractice();
            });
        }, Button);
        Button.pop();
        Column.pop();
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
        }
        catch (error) {
            Logger.errorWithTag('PracticePage', 'Failed to start practice', error as Error);
            this.showToast(getString('load_failed'));
        }
        finally {
            this.isLoading = false;
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
}
