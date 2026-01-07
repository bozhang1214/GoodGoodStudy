if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AIAssistantPage_Params {
    messages?: Array<Message>;
    inputText?: string;
    isLoading?: boolean;
    aiRepository?: AIRepository;
    userRepository?: UserRepository;
}
import promptAction from "@ohos:promptAction";
import { getString } from "@normalized:N&&&entry/src/main/ets/utils/ResourceUtil&";
import { AIRepository } from "@normalized:N&&&entry/src/main/ets/repository/AIRepository&";
import { UserRepository } from "@normalized:N&&&entry/src/main/ets/repository/UserRepository&";
/**
 * 消息接口
 */
interface Message {
    role: string;
    content: string;
}
export class AIAssistantPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__messages = new ObservedPropertyObjectPU([], this, "messages");
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.aiRepository = new AIRepository();
        this.userRepository = new UserRepository();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AIAssistantPage_Params) {
        if (params.messages !== undefined) {
            this.messages = params.messages;
        }
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.aiRepository !== undefined) {
            this.aiRepository = params.aiRepository;
        }
        if (params.userRepository !== undefined) {
            this.userRepository = params.userRepository;
        }
    }
    updateStateVars(params: AIAssistantPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__messages.purgeDependencyOnElmtId(rmElmtId);
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__messages.aboutToBeDeleted();
        this.__inputText.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __messages: ObservedPropertyObjectPU<Array<Message>>;
    get messages() {
        return this.__messages.get();
    }
    set messages(newValue: Array<Message>) {
        this.__messages.set(newValue);
    }
    private __inputText: ObservedPropertySimplePU<string>;
    get inputText() {
        return this.__inputText.get();
    }
    set inputText(newValue: string) {
        this.__inputText.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private aiRepository: AIRepository;
    private userRepository: UserRepository;
    aboutToAppear() {
        this.aiRepository.init();
        this.userRepository.init();
        this.loadChatHistory();
    }
    async loadChatHistory() {
        try {
            const userId = await this.userRepository.getCurrentUserId();
            if (userId !== -1) {
                const history = await this.aiRepository.getChatHistory(userId);
                this.messages = history.map((msg): Message => ({
                    role: msg.role,
                    content: msg.content
                }));
            }
        }
        catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(47:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 消息列表
            List.create();
            List.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(49:7)", "entry");
            // 消息列表
            List.width('100%');
            // 消息列表
            List.layoutWeight(1);
            // 消息列表
            List.padding(10);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const message = _item;
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
                        ListItem.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(51:11)", "entry");
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(52:13)", "entry");
                            Row.width('100%');
                            Row.padding(10);
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (message.role === 'user') {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(54:17)", "entry");
                                        Column.alignItems(HorizontalAlign.End);
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(message.content);
                                        Text.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(55:19)", "entry");
                                        Text.fontSize(14);
                                        Text.padding(10);
                                        Text.backgroundColor('#007DFF');
                                        Text.fontColor('#FFFFFF');
                                        Text.borderRadius(8);
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(65:17)", "entry");
                                        Column.alignItems(HorizontalAlign.Start);
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(message.content);
                                        Text.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(66:19)", "entry");
                                        Text.fontSize(14);
                                        Text.padding(10);
                                        Text.backgroundColor('#F0F0F0');
                                        Text.fontColor('#000000');
                                        Text.borderRadius(8);
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                });
                            }
                        }, If);
                        If.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.messages, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // 消息列表
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 输入区域
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(87:7)", "entry");
            // 输入区域
            Row.width('100%');
            // 输入区域
            Row.padding(10);
            // 输入区域
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: getString('input_message_hint') });
            TextInput.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(88:9)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(40);
            TextInput.onChange((value: string) => {
                this.inputText = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(getString('send'));
            Button.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(95:9)", "entry");
            Button.width(60);
            Button.height(40);
            Button.enabled(!this.isLoading && this.inputText.trim() !== '');
            Button.onClick(() => {
                this.sendMessage();
            });
            Button.margin({ left: 10 });
        }, Button);
        Button.pop();
        // 输入区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(109:9)", "entry");
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.padding(10);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(110:11)", "entry");
                        LoadingProgress.width(20);
                        LoadingProgress.height(20);
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(getString('thinking'));
                        Text.debugLine("entry/src/main/ets/pages/AIAssistantPage.ets(113:11)", "entry");
                        Text.fontSize(14);
                        Text.margin({ left: 10 });
                    }, Text);
                    Text.pop();
                    Row.pop();
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
    async sendMessage() {
        if (this.inputText.trim() === '') {
            return;
        }
        const message = this.inputText.trim();
        this.inputText = '';
        // 添加用户消息到列表
        this.messages.push({ role: 'user', content: message } as Message);
        this.isLoading = true;
        try {
            const userId = await this.userRepository.getCurrentUserId();
            if (userId === -1) {
                this.showToast(getString('please_login'));
                return;
            }
            const response = await this.aiRepository.sendMessage(userId, message);
            this.messages.push({ role: 'assistant', content: response } as Message);
        }
        catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            this.showToast(`${getString('send_failed')}: ${errorMsg}`);
            // 移除最后添加的用户消息（因为发送失败）
            this.messages.pop();
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
