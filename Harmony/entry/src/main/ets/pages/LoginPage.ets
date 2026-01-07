import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { UserRepository } from '../repository/UserRepository';
import { getString } from '../utils/ResourceUtil';
import { AppConstants } from '../constants/AppConstants';

/**
 * 登录页面
 */
@Entry
@Component
struct LoginPage {
  @State username: string = '';
  @State password: string = '';
  @State isLoading: boolean = false;
  private userRepository: UserRepository = new UserRepository();

  aboutToAppear() {
    this.userRepository.init();
  }

  build() {
    Column() {
      Text(getString('app_name'))
        .fontSize(32)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 100, bottom: 60 })

      TextInput({ placeholder: getString('username_hint'), text: this.username })
        .width('80%')
        .height(50)
        .margin({ bottom: 20 })
        .onChange((value: string) => {
          this.username = value;
        })

      TextInput({ placeholder: getString('password_hint'), text: this.password })
        .type(InputType.Password)
        .width('80%')
        .height(50)
        .margin({ bottom: 30 })
        .onChange((value: string) => {
          this.password = value;
        })

      Button(getString('login'))
        .width('80%')
        .height(50)
        .enabled(!this.isLoading && this.username.trim() !== '' && this.password.trim() !== '')
        .onClick(() => {
          this.handleLogin();
        })
        .margin({ bottom: 20 })

      Button(getString('register'))
        .width('80%')
        .height(50)
        .enabled(!this.isLoading && this.username.trim() !== '' && this.password.trim() !== '')
        .onClick(() => {
          this.handleRegister();
        })

      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 20 })
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .padding(20)
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
    } catch (error) {
      const errorMessage = this.getErrorMessage(error instanceof Error ? error.message : String(error));
      this.showToast(errorMessage);
    } finally {
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
    } catch (error) {
      console.error('Registration failed:', error);
      let errorMessage: string;
      if (error instanceof Error) {
        const errorMsg = error.message || String(error);
        // 检查是否是UI上下文错误
        if (errorMsg.includes('UI execution context not found')) {
          // UI上下文错误，可能是异步操作导致的，但注册可能已经成功
          errorMessage = '注册操作已完成，请手动登录';
        } else if (errorMsg === AppConstants.ERROR_USERNAME_EXISTS || errorMsg.includes('用户名已存在')) {
          errorMessage = getString('username_exists');
        } else if (errorMsg.includes('用户名格式不正确')) {
          errorMessage = errorMsg;
        } else if (errorMsg.includes('密码长度至少')) {
          errorMessage = errorMsg;
        } else {
          // 其他错误使用通用错误处理
          errorMessage = this.getErrorMessage(errorMsg);
        }
      } else {
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
    } catch (error) {
      // 如果showToast失败，使用console输出（避免UI上下文错误）
      console.log('Toast message:', message);
    }
  }
}
