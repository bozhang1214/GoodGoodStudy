# 构建变体编译问题修复说明

## 问题描述

切换到`standardRelease`构建变体后无法编译。

## 问题原因

1. **ProductFlavors配置问题**: 配置了`productFlavors`，导致构建变体变成`standardDebug`和`standardRelease`，而不是简单的`debug`和`release`
2. **签名配置问题**: Release签名配置在没有keystore时可能导致编译失败

## 解决方案

### 1. 移除ProductFlavors配置

由于项目只有一个标准版本，不需要配置`productFlavors`。已移除以下配置：

```gradle
// 已移除
flavorDimensions "version"
productFlavors {
    standard {
        dimension "version"
        applicationId "com.edu.primary"
        versionNameSuffix ""
    }
}
```

现在构建变体恢复为：
- `debug` - Debug版本
- `release` - Release版本

### 2. 修复签名配置

优化了Release签名配置，确保在没有配置keystore时不会导致编译失败：

```gradle
signingConfigs {
    debug {
        // 使用默认debug keystore，无需配置
    }
    
    release {
        // 从gradle.properties或环境变量读取签名信息
        if (project.hasProperty('RELEASE_STORE_FILE')) {
            def keystoreFile = file(RELEASE_STORE_FILE)
            if (keystoreFile.exists()) {
                storeFile keystoreFile
                storePassword RELEASE_STORE_PASSWORD
                keyAlias RELEASE_KEY_ALIAS
                keyPassword RELEASE_KEY_PASSWORD
            }
            // 如果keystore文件不存在，不设置任何值，Gradle会使用debug签名
        }
        // 如果没有配置签名信息，不设置任何值，Gradle会使用debug签名
    }
}
```

## 使用方法

### 在Android Studio中

1. 点击 `Build` -> `Select Build Variant`
2. 选择 `release` 变体（不再是`standardRelease`）
3. 点击 `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`

### 使用命令行

```bash
# Windows
build_release.bat

# Linux/Mac
./gradlew clean assembleRelease
```

## 构建变体说明

### Debug版本
- 构建变体: `debug`
- 代码混淆: 禁用
- 资源压缩: 禁用
- 调试: 启用
- 签名: Debug签名
- 题目数量: 5道题

### Release版本
- 构建变体: `release`
- 代码混淆: 启用
- 资源压缩: 启用
- 调试: 禁用
- 签名: Release签名（如果配置）或Debug签名（测试用）
- 题目数量: 40道题

## 注意事项

1. **签名配置**: 如果没有配置Release签名，Release构建会使用Debug签名（仅用于测试）
2. **生产环境**: 发布到应用商店前，请务必配置真实的Release签名
3. **构建变体**: 现在只有`debug`和`release`两个构建变体，不再有`standardDebug`和`standardRelease`

## 相关文档

- `docs/RELEASE_BUILD.md` - Release构建详细说明
- `keystore/README.md` - 密钥库创建指南
