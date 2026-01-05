# 构建和调试指南

## 前置要求

1. **Android Studio 4.1** 或更高版本
2. **JDK 8** 或更高版本
3. **Android SDK** (API 21-30)
4. **Gradle 6.7.1**

## 构建步骤

### 方法1: 使用Android Studio

1. **打开项目**
   - 启动Android Studio 4.1
   - 选择 `File -> Open`
   - 选择 `Android` 目录
   - 等待Gradle同步完成（首次可能需要较长时间）

2. **同步项目**
   - 如果Gradle没有自动同步，点击 `File -> Sync Project with Gradle Files`

3. **编译项目**
   - 点击 `Build -> Make Project` 或按 `Ctrl+F9` (Windows) / `Cmd+F9` (Mac)
   - 等待编译完成

4. **运行应用**
   - 连接Android设备或启动模拟器
   - 点击 `Run -> Run 'app'` 或按 `Shift+F10`
   - 选择目标设备
   - 应用将自动安装并启动

### 方法2: 使用命令行（Windows）

1. **打开命令提示符或PowerShell**
   ```cmd
   cd D:\9-Tools\AndroidWorkspace\GoodGoodStudy\Android
   ```

2. **构建Debug APK**
   ```cmd
   build_debug.bat
   ```
   或
   ```cmd
   gradlew.bat assembleDebug
   ```

3. **构建Release APK**
   ```cmd
   build_release.bat
   ```
   或
   ```cmd
   gradlew.bat assembleRelease
   ```

### 方法3: 使用命令行（Linux/Mac）

1. **打开终端**
   ```bash
   cd /path/to/Android
   ```

2. **构建Debug APK**
   ```bash
   ./gradlew assembleDebug
   ```

3. **构建Release APK**
   ```bash
   ./gradlew assembleRelease
   ```

## APK输出位置

构建完成后，APK文件位于：

- **Debug APK**: `app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `app/build/outputs/apk/release/app-release.apk`

## 安装APK

### 方法1: 使用ADB

1. **连接设备**
   ```bash
   adb devices
   ```

2. **安装APK**
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

### 方法2: 手动安装

1. 将APK文件传输到Android设备
2. 在设备上启用"未知来源"或"安装未知应用"权限
3. 点击APK文件进行安装

## 调试

### 启用USB调试

1. 在Android设备上：
   - 进入 `设置 -> 关于手机`
   - 连续点击"版本号"7次启用开发者选项
   - 返回 `设置 -> 开发者选项`
   - 启用"USB调试"

2. 连接设备到电脑
3. 在Android Studio中选择设备并运行

### 查看日志

在Android Studio中：
- 打开 `View -> Tool Windows -> Logcat`
- 过滤标签：`GoodGoodStudy`

或使用命令行：
```bash
adb logcat | grep GoodGoodStudy
```

## 常见问题

### 1. Gradle同步失败

**问题**: 无法下载依赖或同步失败

**解决方案**:
- 检查网络连接
- 配置Gradle使用国内镜像（如阿里云镜像）
- 清理项目：`Build -> Clean Project`
- 重新同步：`File -> Invalidate Caches / Restart`

### 2. 编译错误

**问题**: 代码编译错误

**解决方案**:
- 检查JDK版本（需要JDK 8+）
- 检查Android SDK版本
- 查看 `Build` 窗口中的错误信息
- 确保所有依赖已正确下载

### 3. 运行时崩溃

**问题**: 应用启动后崩溃

**解决方案**:
- 查看Logcat中的错误信息
- 检查AndroidManifest.xml配置
- 确保设备API级别 >= 21
- 检查权限配置

### 4. API密钥配置

**问题**: AI助手无法使用

**解决方案**:
- 确保已配置Deepseek API密钥
- 检查网络连接
- 验证API密钥有效性
- 查看Logcat中的网络错误信息

## 签名配置（Release版本）

### 生成签名密钥

1. 在Android Studio中：
   - `Build -> Generate Signed Bundle / APK`
   - 选择 `APK`
   - 创建新密钥库或使用现有密钥库

2. 或使用命令行：
   ```bash
   keytool -genkey -v -keystore goodgoodstudy.jks -keyalg RSA -keysize 2048 -validity 10000 -alias goodgoodstudy
   ```

### 配置签名

在 `app/build.gradle` 中添加：

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('path/to/your/keystore.jks')
            storePassword 'your_store_password'
            keyAlias 'your_key_alias'
            keyPassword 'your_key_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 性能优化

### 启用ProGuard

在 `app/build.gradle` 中：
```gradle
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 启用R8

R8是默认的代码压缩工具，会自动启用。

## 版本管理

### 更新版本号

在 `app/build.gradle` 中：
```gradle
defaultConfig {
    versionCode 2  // 递增版本号
    versionName "1.1"  // 更新版本名称
}
```

## 更多资源

- [Android官方文档](https://developer.android.com/)
- [Gradle用户指南](https://docs.gradle.org/)
- [Room数据库文档](https://developer.android.com/training/data-storage/room)
- [Retrofit文档](https://square.github.io/retrofit/)
