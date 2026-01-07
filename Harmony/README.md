# 好好学习 - 鸿蒙版本

## 项目简介

这是"好好学习"应用的鸿蒙版本，专为小学生设计的课后练习应用，支持1-6年级全科目练习，包含用户系统、练习答题、学习进度跟踪、错题本、离线功能和AI小助手（Deepseek API）。

## 技术栈

- **开发环境**: DevEco Studio
- **开发语言**: ArkTS (TypeScript)
- **UI框架**: ArkUI
- **数据库**: 关系型数据库 (RDB)
- **网络**: HTTP模块
- **API版本**: HarmonyOS API 9

## 项目结构

```
Harmony/
├── AppScope/
│   └── app.json5                    # 应用配置
├── entry/
│   ├── src/main/
│   │   ├── ets/
│   │   │   ├── entryability/       # 应用入口
│   │   │   ├── pages/              # 页面
│   │   │   ├── model/              # 数据模型
│   │   │   ├── database/           # 数据库层
│   │   │   ├── network/             # 网络层
│   │   │   ├── repository/         # 数据仓库
│   │   │   ├── constants/          # 常量
│   │   │   └── utils/              # 工具类
│   │   └── resources/              # 资源文件
│   └── build-profile.json5         # 构建配置
└── build-profile.json5             # 项目构建配置
```

## 主要功能

1. **用户系统**: 登录/注册功能
2. **练习答题**: 支持语文、数学、英语等科目，1-6年级
3. **学习进度**: 跟踪学习进度和正确率
4. **错题本**: 收集和复习错题
5. **AI小助手**: 集成Deepseek API，提供智能问答和作业辅导
6. **离线功能**: 支持离线答题和数据同步

## 编译和运行

### 前置要求

1. 安装 DevEco Studio（推荐最新版本）
2. 配置 HarmonyOS SDK
3. 配置签名证书（用于真机调试）

### 使用 DevEco Studio

1. 打开 DevEco Studio
2. 选择 `File -> Open`，选择 `Harmony` 目录
3. 等待项目同步完成
4. 点击 `Build -> Build Hap(s)/APP(s) -> Build Hap(s)` 编译项目
5. 点击 `Run` 运行应用

### 使用命令行

```bash
# 进入项目目录
cd Harmony

# 编译HAP
hvigorw assembleHap

# 编译APP
hvigorw assembleApp
```

## 配置说明

### Deepseek API密钥配置

在使用AI小助手功能前，需要配置Deepseek API密钥：

1. 在应用中进入设置页面
2. 输入Deepseek API密钥
3. 点击保存

**注意**: API密钥会安全存储在Preferences中。

## 数据库结构

应用使用关系型数据库（RDB），包含以下表：

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

1. **版本兼容性**: 项目基于 HarmonyOS API 9 开发
2. **API密钥安全**: Deepseek API密钥需要安全存储
3. **网络权限**: 应用需要INTERNET和GET_NETWORK_INFO权限
4. **数据库迁移**: 数据库版本升级时需要处理迁移逻辑

## 与Android版本的差异

1. **开发语言**: Android使用Java，鸿蒙使用ArkTS
2. **UI框架**: Android使用XML布局，鸿蒙使用ArkUI声明式UI
3. **数据库**: Android使用Room，鸿蒙使用RDB
4. **网络库**: Android使用Retrofit，鸿蒙使用HTTP模块
5. **异步处理**: Android使用RxJava，鸿蒙使用Promise/async-await

## 代码优化

项目已完成全面的代码优化，包括：

### 设计原则优化
- ✅ **单一职责原则**: 工具类职责明确（ErrorHandler、ResourceCleaner、ResultSetManager）
- ✅ **开闭原则**: 通过接口抽象支持扩展（IUserRepository）
- ✅ **依赖倒置原则**: Repository实现接口，依赖抽象

### 设计模式优化
- ✅ **单例模式**: 改进AppDatabase和ApiClient的单例实现，添加错误恢复
- ✅ **策略模式**: ErrorHandler根据错误类型选择处理策略
- ✅ **接口抽象**: Repository接口提高可测试性

### 内存管理优化
- ✅ **资源管理**: ResultSet统一管理和自动关闭，防止资源泄漏
- ✅ **资源清理**: ResourceCleaner提供统一的资源清理机制
- ✅ **单例资源**: 改进单例的资源释放机制

### 线程安全优化
- ✅ **单例安全**: 改进单例实现的线程安全性（考虑可移植性）
- ✅ **错误恢复**: 单例初始化失败时可以重试

### 错误处理优化
- ✅ **统一错误处理**: ErrorHandler统一处理数据库、网络、业务错误
- ✅ **错误分类**: 区分不同类型的错误，提供合适的错误消息
- ✅ **错误日志**: 完善的错误日志记录

### 日志系统优化
- ✅ **日志级别**: 支持DEBUG、INFO、WARN、ERROR级别
- ✅ **结构化日志**: 支持结构化日志记录
- ✅ **日志过滤**: 支持日志级别过滤，减少生产环境开销

详细优化内容请参考：[优化总结文档](./OPTIMIZATION_SUMMARY.md)

## 测试

项目包含单元测试，测试文件位于 `entry/src/test/ets/` 目录：

- `utils/ErrorHandlerTest.ts` - 错误处理测试
- `utils/ResourceCleanerTest.ts` - 资源清理测试
- `utils/LoggerTest.ts` - 日志系统测试

运行测试：
```bash
# 在DevEco Studio中运行测试
# 或使用命令行
hvigorw test
```

## 后续开发建议

1. **题目数据**: 需要接入实际的题目数据源（API或本地JSON）
2. **用户认证**: 可考虑添加更完善的用户认证机制
3. **数据同步**: 实现云端数据同步功能
4. **UI优化**: 进一步完善UI设计和用户体验
5. **性能监控**: 添加性能监控和内存分析工具
6. **完善测试**: 为所有新增工具类添加完整测试
7. **依赖注入**: 考虑引入轻量级依赖注入框架

## 许可证

本项目仅供学习使用。

## 常见问题

### 项目同步失败

如果在 DevEco Studio 6.0.0 中遇到 "Project sync failed" 错误，请查看：

- [项目同步问题解决方案](./docs/SYNC_ISSUES.md) - 详细的同步问题排查和解决指南

常见解决方法：
1. 确保已安装 Node.js（推荐 14.x 或 16.x）
2. 检查 HarmonyOS SDK 是否正确安装
3. 清理项目缓存：`File -> Invalidate Caches / Restart`
4. 检查 `.hvigor/hvigor-config.json5` 文件是否存在

### IDE 错误

如果遇到 DevEco Studio IDE 内部错误（如 NullPointerException、CustomNotification 错误等），请查看：

- [IDE 错误解决方案](./docs/IDE_ERRORS.md) - IDE 常见错误及解决方法
- [快速修复索引错误](./FIX_INDEX_ERROR.md) - 索引错误的快速修复指南

常见解决方法：
1. 清理缓存：`File -> Invalidate Caches / Restart`
2. 更新 DevEco Studio 到最新版本
3. 检查并更新相关插件
4. **注意**: 大多数 IDE 内部错误不影响项目编译和运行，可以安全忽略

## 联系方式

如有问题或建议，请提交Issue。
