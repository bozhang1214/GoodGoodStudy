if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MainPage_Params {
    currentIndex?: number;
    userRepository?: UserRepository;
}
import router from "@ohos:router";
import { UserRepository } from "@normalized:N&&&entry/src/main/ets/repository/UserRepository&";
import { PracticePage } from "@normalized:N&&&entry/src/main/ets/pages/PracticePage&";
import { ProgressPage } from "@normalized:N&&&entry/src/main/ets/pages/ProgressPage&";
import { WrongBookPage } from "@normalized:N&&&entry/src/main/ets/pages/WrongBookPage&";
import { AIAssistantPage } from "@normalized:N&&&entry/src/main/ets/pages/AIAssistantPage&";
import { getString } from "@normalized:N&&&entry/src/main/ets/utils/ResourceUtil&";
import { DatabaseInitializer } from "@normalized:N&&&entry/src/main/ets/utils/DatabaseInitializer&";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
class MainPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.userRepository = new UserRepository();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MainPage_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.userRepository !== undefined) {
            this.userRepository = params.userRepository;
        }
    }
    updateStateVars(params: MainPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private userRepository: UserRepository;
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MainPage.ets(40:5)", "entry");
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Tabs.create({ barPosition: BarPosition.End });
            Tabs.debugLine("entry/src/main/ets/pages/MainPage.ets(41:7)", "entry");
            Tabs.onChange((index: number) => {
                this.currentIndex = index;
            });
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new 
                            // 练习页面
                            PracticePage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 44, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {};
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "PracticePage" });
                }
            });
            TabContent.tabBar({ builder: () => {
                    this.getTabBuilder.call(this, 'nav_practice', 0);
                } });
            TabContent.debugLine("entry/src/main/ets/pages/MainPage.ets(42:9)", "entry");
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new 
                            // 进度页面
                            ProgressPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 50, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {};
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "ProgressPage" });
                }
            });
            TabContent.tabBar({ builder: () => {
                    this.getTabBuilder.call(this, 'nav_progress', 1);
                } });
            TabContent.debugLine("entry/src/main/ets/pages/MainPage.ets(48:9)", "entry");
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new 
                            // 错题本页面
                            WrongBookPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 56, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {};
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "WrongBookPage" });
                }
            });
            TabContent.tabBar({ builder: () => {
                    this.getTabBuilder.call(this, 'nav_wrong_book', 2);
                } });
            TabContent.debugLine("entry/src/main/ets/pages/MainPage.ets(54:9)", "entry");
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new 
                            // AI助手页面
                            AIAssistantPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 62, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {};
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "AIAssistantPage" });
                }
            });
            TabContent.tabBar({ builder: () => {
                    this.getTabBuilder.call(this, 'nav_ai_assistant', 3);
                } });
            TabContent.debugLine("entry/src/main/ets/pages/MainPage.ets(60:9)", "entry");
        }, TabContent);
        TabContent.pop();
        Tabs.pop();
        Column.pop();
    }
    getTabBuilder(name: string, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MainPage.ets(76:5)", "entry");
            Column.width('100%');
            Column.height(50);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString(name));
            Text.debugLine("entry/src/main/ets/pages/MainPage.ets(77:7)", "entry");
            Text.fontSize(14);
            Text.fontColor(this.currentIndex === index ? '#007DFF' : '#999999');
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "MainPage";
    }
}
registerNamedRoute(() => new MainPage(undefined, {}), "", { bundleName: "com.edu.primary", moduleName: "entry", pagePath: "pages/MainPage", pageFullPath: "entry/src/main/ets/pages/MainPage", integratedHsp: "false", moduleType: "followWithHap" });
