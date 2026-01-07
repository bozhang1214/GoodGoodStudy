# Release版本编译配置说明

## 概述

项目已配置完整的Release版本编译设置，包括代码混淆、资源压缩、签名配置等。

## Release版本特性

### 1. 代码混淆
- **启用**: `minifyEnabled true`
- **规则文件**: `proguard-rules.pro`
- **作用**: 减小APK体积，提高代码安全性

### 2. 资源压缩
- **启用**: `shrinkResources true`
- **作用**: 移除未使用的资源文件，减小APK体积

### 3. 代码优化
- **启用**: `zipAlignEnabled true`
- **作用**: 优化APK文件结构，提高运行时性能

### 4. 调试日志移除
- Release版本自动移除调试日志（通过ProGuard）
- 减少运行时开销

### 5. 题目数量配置
- Debug版本: 5道题/次
- Release版本: 40道题/次
- 通过`BuildConfig.DEBUG`自动判断

## 签名配置

### 方法1: 使用gradle.properties（推荐）

在`gradle.properties`文件中配置签名信息：

```properties
RELEASE_STORE_FILE=keystore/primary-release.jks
RELEASE_STORE_PASSWORD=your_store_password
RELEASE_KEY_ALIAS=primary_key
RELEASE_KEY_PASSWORD=your_key_password
```

**注意**: 
- `gradle.properties`文件会被Git忽略（如果配置了.gitignore）
- 不要将签名信息提交到版本控制系统

### 方法2: 使用环境变量

在系统环境变量中设置：
- `RELEASE_STORE_FILE`
- `RELEASE_STORE_PASSWORD`
- `RELEASE_KEY_ALIAS`
- `RELEASE_KEY_PASSWORD`

### 方法3: 使用Android Studio

1. 打开 `File` -> `Project Structure`
2. 选择 `app` -> `Signing`
3. 添加Release签名配置
4. 填写密钥库信息

## 创建签名密钥库

### 使用命令行

```bash
keytool -genkey -v -keystore keystore/primary-release.jks \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -alias primary_key
```

### 使用Android Studio

1. `Build` -> `Generate Signed Bundle / APK`
2. 选择 `APK`
3. 点击 `Create new...` 创建密钥库
4. 填写密钥库信息

详细说明请查看 `keystore/README.md`

## 构建Release APK

### 使用Android Studio

1. 选择 `Build` -> `Select Build Variant`
2. 选择 `release` 变体
3. 点击 `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`

### 使用命令行

**Windows:**
```bash
build_release.bat
```

**Linux/Mac:**
```bash
./gradlew clean assembleRelease
```

### APK输出位置

```
app/build/outputs/apk/release/app-release.apk
```

## ProGuard规则

项目已配置以下ProGuard规则：

1. **Retrofit/OkHttp**: 保留网络请求相关类
2. **Gson**: 保留JSON序列化相关类
3. **Room**: 保留数据库实体和DAO
4. **RxJava**: 保留响应式编程相关类
5. **应用类**: 保留`com.edu.primary`包下的所有类
6. **日志移除**: Release版本移除调试日志

详细规则请查看 `app/proguard-rules.pro`

## 验证Release APK

### 检查APK签名

```bash
jarsigner -verify -verbose -certs app-release.apk
```

### 检查APK信息

```bash
aapt dump badging app-release.apk
```

### 安装测试

```bash
adb install -r app-release.apk
```

## 常见问题

### 1. 构建失败：找不到签名配置

**问题**: `SigningConfig 'release' is missing required property 'storeFile'`

**解决**: 
- 如果没有配置签名，Release构建会使用Debug签名（仅用于测试）
- 生产环境请配置真实的签名信息

### 2. ProGuard错误

**问题**: 构建时ProGuard报错

**解决**: 
- 检查`proguard-rules.pro`文件
- 查看构建输出的详细错误信息
- 添加必要的`-keep`规则

### 3. 资源文件缺失

**问题**: 运行时找不到资源

**解决**: 
- 检查资源文件是否被错误移除
- 在`proguard-rules.pro`中添加资源保留规则
- 检查`shrinkResources`配置

### 4. APK体积过大

**问题**: Release APK体积仍然很大

**解决**: 
- 确保`minifyEnabled`和`shrinkResources`都已启用
- 检查是否有未使用的资源文件
- 考虑使用Android App Bundle (AAB)格式

## 性能优化建议

1. **启用代码混淆**: 减小APK体积，提高安全性
2. **启用资源压缩**: 移除未使用的资源
3. **移除调试日志**: 减少运行时开销
4. **使用App Bundle**: 进一步减小下载体积

## 安全建议

1. **保护密钥库**: 妥善保管密钥库文件和密码
2. **备份密钥库**: 密钥库丢失后无法更新应用
3. **不要提交密钥**: 不要将密钥库和密码提交到Git
4. **使用强密码**: 密钥库密码应足够复杂

## 版本管理

### 更新版本号

在`build.gradle`中修改：

```gradle
defaultConfig {
    versionCode 2  // 递增版本号
    versionName "1.1"  // 更新版本名称
}
```

### 版本命名规范

建议使用语义化版本号：
- `1.0.0` - 主版本.次版本.修订版本
- `1.0.1` - Bug修复
- `1.1.0` - 新功能
- `2.0.0` - 重大更新

## 相关文档

- `keystore/README.md` - 密钥库创建和配置说明
- `BUILD.md` - 构建和调试指南
- `DEBUG_RELEASE_CONFIG.md` - Debug/Release配置说明
