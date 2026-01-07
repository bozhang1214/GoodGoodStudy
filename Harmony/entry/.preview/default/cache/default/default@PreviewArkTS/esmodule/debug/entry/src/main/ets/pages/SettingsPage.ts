if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SettingsPage_Params {
    apiKey?: string;
    aiRepository?: AIRepository;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { getString } from "@normalized:N&&&entry/src/main/ets/utils/ResourceUtil&";
import { AIRepository } from "@normalized:N&&&entry/src/main/ets/repository/AIRepository&";
export class SettingsPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__apiKey = new ObservedPropertySimplePU('', this, "apiKey");
        this.aiRepository = new AIRepository();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingsPage_Params) {
        if (params.apiKey !== undefined) {
            this.apiKey = params.apiKey;
        }
        if (params.aiRepository !== undefined) {
            this.aiRepository = params.aiRepository;
        }
    }
    updateStateVars(params: SettingsPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__apiKey.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__apiKey.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __apiKey: ObservedPropertySimplePU<string>;
    get apiKey() {
        return this.__apiKey.get();
    }
    set apiKey(newValue: string) {
        this.__apiKey.set(newValue);
    }
    private aiRepository: AIRepository;
    aboutToAppear() {
        this.aiRepository.init();
        this.loadApiKey();
    }
    async loadApiKey() {
        try {
            this.apiKey = await this.aiRepository.getApiKey();
        }
        catch (error) {
            console.error('Failed to load API key:', error);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(29:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.padding(20);
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString('settings'));
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(30:7)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 30, bottom: 30 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SettingsPage.ets(35:7)", "entry");
            Column.width('90%');
            Column.padding(20);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(10);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString('deepseek_api_key'));
            Text.debugLine("entry/src/main/ets/pages/SettingsPage.ets(36:9)", "entry");
            Text.fontSize(16);
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: getString('api_key_hint'), text: this.apiKey });
            TextInput.debugLine("entry/src/main/ets/pages/SettingsPage.ets(40:9)", "entry");
            TextInput.width('100%');
            TextInput.height(50);
            TextInput.onChange((value: string) => {
                this.apiKey = value;
            });
            TextInput.margin({ bottom: 20 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(getString('save'));
            Button.debugLine("entry/src/main/ets/pages/SettingsPage.ets(48:9)", "entry");
            Button.width('100%');
            Button.height(50);
            Button.onClick(() => {
                this.saveApiKey();
            });
        }, Button);
        Button.pop();
        Column.pop();
        Column.pop();
    }
    async saveApiKey() {
        if (this.apiKey.trim() === '') {
            this.showToast(getString('please_input_api_key'));
            return;
        }
        try {
            await this.aiRepository.setApiKey(this.apiKey.trim());
            this.showToast(getString('api_key_saved'));
            router.back();
        }
        catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            this.showToast(`${getString('error')}: ${errorMsg}`);
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
        return "SettingsPage";
    }
}
registerNamedRoute(() => new SettingsPage(undefined, {}), "", { bundleName: "com.edu.primary", moduleName: "entry", pagePath: "pages/SettingsPage", pageFullPath: "entry/src/main/ets/pages/SettingsPage", integratedHsp: "false", moduleType: "followWithHap" });
