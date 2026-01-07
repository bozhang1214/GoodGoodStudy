if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginPage_Params {
    username?: string;
    password?: string;
    isLoading?: boolean;
    userRepository?: UserRepository;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { UserRepository } from "@normalized:N&&&entry/src/main/ets/repository/UserRepository&";
import { getString } from "@normalized:N&&&entry/src/main/ets/utils/ResourceUtil&";
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
class LoginPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.userRepository = new UserRepository();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginPage_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.userRepository !== undefined) {
            this.userRepository = params.userRepository;
        }
    }
    updateStateVars(params: LoginPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private userRepository: UserRepository;
    aboutToAppear() {
        this.userRepository.init();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/LoginPage.ets(23:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getString('app_name'));
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(24:7)", "entry");
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 100, bottom: 60 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: getString('username_hint'), text: this.username });
            TextInput.debugLine("entry/src/main/ets/pages/LoginPage.ets(29:7)", "entry");
            TextInput.width('80%');
            TextInput.height(50);
            TextInput.margin({ bottom: 20 });
            TextInput.onChange((value: string) => {
                this.username = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: getString('password_hint'), text: this.password });
            TextInput.debugLine("entry/src/main/ets/pages/LoginPage.ets(37:7)", "entry");
            TextInput.type(InputType.Password);
            TextInput.width('80%');
            TextInput.height(50);
            TextInput.margin({ bottom: 30 });
            TextInput.onChange((value: string) => {
                this.password = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(getString('login'));
            Button.debugLine("entry/src/main/ets/pages/LoginPage.ets(46:7)", "entry");
            Button.width('80%');
            Button.height(50);
            Button.enabled(!this.isLoading && this.username.trim() !== '' && this.password.trim() !== '');
            Button.onClick(() => {
                this.handleLogin();
            });
            Button.margin({ bottom: 20 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(getString('register'));
            Button.debugLine("entry/src/main/ets/pages/LoginPage.ets(55:7)", "entry");
            Button.width('80%');
            Button.height(50);
            Button.enabled(!this.isLoading && this.username.trim() !== '' && this.password.trim() !== '');
            Button.onClick(() => {
                this.handleRegister();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/LoginPage.ets(64:9)", "entry");
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.margin({ top: 20 });
                    }, LoadingProgress);
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
    async handleLogin() {
        if (this.username.trim() === '' || this.password.trim() === '') {
            this.showToast(getString('please_input_username_password'));
            return;
        }
        this.isLoading = true;
        try {
            await this.userRepository.login(this.username.trim(), this.password.trim());
            this.showToast(getString('login_success'));
            router.replaceUrl({ url: 'pages/MainPage' });
        }
        catch (error) {
            const errorMessage = this.getErrorMessage(error instanceof Error ? error.message : String(error));
            this.showToast(errorMessage);
        }
        finally {
            this.isLoading = false;
        }
    }
    async handleRegister() {
        if (this.username.trim() === '' || this.password.trim() === '') {
            this.showToast(getString('please_input_username_password'));
            return;
        }
        this.isLoading = true;
        try {
            // 使用registerAndLogin方法，注册成功后自动登录
            // 在previewer环境中，会直接使用注册时的用户对象，避免数据库查询问题
            await this.userRepository.registerAndLogin(this.username.trim(), this.password.trim(), this.username.trim());
            this.showToast(getString('register_success'));
            this.showToast(getString('login_success'));
            router.replaceUrl({ url: 'pages/MainPage' });
            this.isLoading = false;
        }
        catch (error) {
            console.error('Registration failed:', error);
            let errorMessage: string;
            if (error instanceof Error) {
                const errorMsg = error.message || String(error);
                // 检查是否是UI上下文错误
                if (errorMsg.includes('UI execution context not found')) {
                    // UI上下文错误，可能是异步操作导致的，但注册可能已经成功
                    errorMessage = '注册操作已完成，请手动登录';
                }
                else if (errorMsg === AppConstants.ERROR_USERNAME_EXISTS || errorMsg.includes('用户名已存在')) {
                    errorMessage = getString('username_exists');
                }
                else if (errorMsg.includes('用户名格式不正确')) {
                    errorMessage = errorMsg;
                }
                else if (errorMsg.includes('密码长度至少')) {
                    errorMessage = errorMsg;
                }
                else {
                    // 其他错误使用通用错误处理
                    errorMessage = this.getErrorMessage(errorMsg);
                }
            }
            else {
                errorMessage = this.getErrorMessage(String(error));
            }
            this.showToast(errorMessage);
            this.isLoading = false;
        }
    }
    getErrorMessage(errorKey: string): string {
        // 检查是否是错误常量
        if (errorKey === AppConstants.ERROR_USERNAME_EXISTS) {
            return getString('username_exists');
        }
        if (errorKey === AppConstants.ERROR_USER_NOT_FOUND) {
            return getString('user_not_found');
        }
        if (errorKey === AppConstants.ERROR_PASSWORD_WRONG) {
            return getString('password_wrong');
        }
        // 检查错误消息中是否包含错误常量（兼容性处理）
        if (errorKey.includes(AppConstants.ERROR_USERNAME_EXISTS)) {
            return getString('username_exists');
        }
        if (errorKey.includes(AppConstants.ERROR_USER_NOT_FOUND)) {
            return getString('user_not_found');
        }
        if (errorKey.includes(AppConstants.ERROR_PASSWORD_WRONG)) {
            return getString('password_wrong');
        }
        // 返回原始错误消息或默认错误
        return errorKey || getString('error');
    }
    showToast(message: string) {
        // 使用promptAction显示提示，使用try-catch避免UI上下文错误
        try {
            promptAction.showToast({
                message: message,
                duration: 2000
            });
        }
        catch (error) {
            // 如果showToast失败，使用console输出（避免UI上下文错误）
            console.log('Toast message:', message);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LoginPage";
    }
}
registerNamedRoute(() => new LoginPage(undefined, {}), "", { bundleName: "com.edu.primary", moduleName: "entry", pagePath: "pages/LoginPage", pageFullPath: "entry/src/main/ets/pages/LoginPage", integratedHsp: "false", moduleType: "followWithHap" });
