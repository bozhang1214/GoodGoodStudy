# 好好学习 - 小学课后练习Android应用

## 项目简介

这是一个专为小学生设计的课后练习Android应用，支持1-6年级全科目练习，包含用户系统、练习答题、学习进度跟踪、错题本、离线功能和AI小助手（Deepseek API）。

## 技术栈

- **开发环境**: Android Studio 4.1
- **Gradle**: 6.7.1
- **Android Gradle Plugin**: 4.1.3
- **最低SDK**: 21 (Android 5.0)
- **目标SDK**: 30 (Android 11)
- **主要语言**: Java
- **架构**: MVVM (Android Architecture Components)

## 主要功能

1. **用户系统**: 登录/注册功能
2. **练习答题**: 支持语文、数学、英语等科目，1-6年级
3. **学习进度**: 跟踪学习进度和正确率
4. **错题本**: 收集和复习错题
5. **AI小助手**: 集成Deepseek API，提供智能问答和作业辅导
6. **离线功能**: 支持离线答题和数据同步

## 项目结构

```
app/src/main/java/com/edu/primary/
├── ui/                    # UI层
│   ├── MainActivity.java
│   ├── login/            # 登录模块
│   ├── practice/         # 练习模块
│   ├── progress/         # 进度模块
│   ├── wrongbook/        # 错题本模块
│   └── aiassistant/      # AI助手模块
├── viewmodel/            # ViewModel层
├── repository/           # Repository层
├── database/             # 数据库层（Room）
├── network/              # 网络层（Retrofit）
├── model/                # 数据模型
└── constants/            # 常量类
```

## 文档说明

**所有AI生成的文档(.md)都存放在docs目录下**

### 项目文档结构

```
Android/
├── README.md                    # 项目主文档（本文档）
│                                # 包含项目简介、技术栈、主要功能、配置说明等
│
└── docs/                        # AI生成的文档目录
    ├── BUILD.md                 # 构建和调试指南
    │                            # - 详细的构建步骤（Android Studio和命令行）
    │                            # - 编译调试方法
    │                            # - APK生成和安装
    │                            # - 常见问题解决方案
    │
    ├── QUICK_START.md           # 快速开始指南
    │                            # - 项目完成情况总览
    │                            # - 立即开始使用步骤
    │                            # - 功能测试说明
    │                            # - 构建APK方法
    │
    ├── IMPLEMENTATION_STATUS.md # 项目实施状态
    │                            # - 各阶段完成情况
    │                            # - 文件清单统计
    │                            # - 功能验证清单
    │                            # - 后续开发建议
    │
    ├── PACKAGE_MIGRATION.md     # 包名迁移报告
    │                            # - 从com.goodgoodstudy迁移到com.edu.primary
    │                            # - 迁移步骤和验证结果
    │                            # - 编译说明和注意事项
    │
    └── REFACTORING_SUMMARY.md   # 代码重构总结
                                 # - 中文编码问题解决
                                 # - 字符串资源化完成情况
                                 # - 常量类定义和使用
                                 # - 代码质量改进说明
```

### 文档使用指南

- **新手上手**: 建议先阅读 `QUICK_START.md`，了解项目概况和快速开始方法
- **构建问题**: 遇到编译或构建问题时，查看 `BUILD.md` 获取详细解决方案
- **了解进度**: 查看 `IMPLEMENTATION_STATUS.md` 了解项目各模块完成情况
- **迁移历史**: 如需了解包名迁移过程，参考 `PACKAGE_MIGRATION.md`
- **代码规范**: 查看 `REFACTORING_SUMMARY.md` 了解代码规范和最佳实践

## 配置说明

### 1. Deepseek API密钥配置

在使用AI小助手功能前，需要配置Deepseek API密钥：

1. 在应用中进入AI助手页面
2. 首次使用会提示配置API密钥
3. 密钥会安全存储在SharedPreferences中

**注意**: 生产环境建议使用Android Keystore加密存储API密钥。

### 2. 构建项目

#### 使用Android Studio

1. 打开Android Studio 4.1
2. 选择 `File -> Open`，选择项目目录
3. 等待Gradle同步完成
4. 点击 `Build -> Make Project` 编译项目
5. 点击 `Run` 运行应用

#### 使用命令行

**Windows:**
```bash
# Debug APK
build_debug.bat

# Release APK
build_release.bat
```

**Linux/Mac:**
```bash
# Debug APK
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease
```

### 3. APK输出位置

- **Debug APK**: `app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `app/build/outputs/apk/release/app-release.apk`

### 4. 安装APK

**使用ADB安装:**
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

**在设备上安装:**
1. 将APK文件传输到Android设备
2. 在设备上启用"未知来源"安装
3. 点击APK文件进行安装

## 依赖库

主要依赖库版本（兼容Android Studio 4.1）：

- AndroidX AppCompat: 1.3.1
- AndroidX Room: 2.3.0
- Retrofit: 2.9.0
- OkHttp: 4.9.1
- RxJava2: 2.2.21
- Material Components: 1.4.0

完整依赖列表请查看 `app/build.gradle`。

## 数据库结构

应用使用Room数据库，包含以下表：

- `users`: 用户信息
- `questions`: 题目数据
- `answers`: 答题记录
- `wrong_questions`: 错题记录
- `chat_messages`: AI对话历史

## 网络API

### Deepseek API

- **Base URL**: https://api.deepseek.com/
- **Endpoint**: `/v1/chat/completions`
- **认证**: Bearer Token (API Key)

## 开发注意事项

1. **版本兼容性**: 所有库版本需兼容Android Studio 4.1和Gradle 6.7+
2. **API密钥安全**: Deepseek API密钥需要安全存储
3. **网络权限**: 应用需要INTERNET和ACCESS_NETWORK_STATE权限
4. **数据库迁移**: 数据库版本升级时需要处理迁移逻辑
5. **ProGuard**: Release版本建议启用代码混淆

## 后续开发建议

1. **题目数据**: 需要接入实际的题目数据源（API或本地JSON）
2. **用户认证**: 可考虑添加更完善的用户认证机制
3. **数据同步**: 实现云端数据同步功能
4. **UI优化**: 进一步完善UI设计和用户体验
5. **性能优化**: 优化数据库查询和网络请求性能

## 许可证

本项目仅供学习使用。

## 联系方式

如有问题或建议，请提交Issue。
