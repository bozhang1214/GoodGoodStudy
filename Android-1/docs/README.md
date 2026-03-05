# GoodGoodStudy 文档索引

本目录为 GoodGoodStudy Android 应用的开发文档，便于理解架构、模块与第三方库，并支持环境搭建与二次开发。

## 1. 整体架构

| 文档 | 说明 |
|------|------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | 整体架构说明：单 Activity + Compose + MVVM、层级依赖、功能模块、核心数据流与时序图 |

## 2. 模块文档（docs/modules/）

| 文档 | 说明 |
|------|------|
| [module-app.md](modules/module-app.md) | 应用入口与导航：GoodGoodStudyApp、MainActivity、NavRoutes、ViewModelFactory |
| [module-data.md](modules/module-data.md) | 数据层：AppDatabase、DAO、Entity、UserRepository、QuestionRepository、AIRepository、StringListConverter |
| [module-ui-learning.md](modules/module-ui-learning.md) | 练习与进度 UI：登录、主界面、练习入口/详情、进度、错题本、设置等 Screen 与 ViewModel |
| [module-ai.md](modules/module-ai.md) | AI 助手：AIRepository、RuleBasedTextGenerator、AIAssistantViewModel/Screen，及 TFLite 扩展思路 |

## 3. 第三方框架（docs/third-party/）

| 文档 | 说明 |
|------|------|
| [compose-and-room.md](third-party/compose-and-room.md) | Jetpack Compose、Room、Navigation Compose、ViewModel 在本工程中的配置、示例与注意点 |

## 4. 开发指南（docs/guide/）

| 文档 | 说明 |
|------|------|
| [ENVIRONMENT.md](guide/ENVIRONMENT.md) | 环境要求、克隆与打开、Gradle 同步与构建、运行、目录结构、常见问题、测试方式 |

## 5. 代码级文档（KDoc）

核心类已补充 KDoc 注释，包括：

- **应用与导航**：GoodGoodStudyApp、MainActivity、NavRoutes、ViewModelFactory  
- **数据层**：AppDatabase、UserRepository、QuestionRepository、AIRepository、StringListConverter  
- **ViewModel**：LoginViewModel、PracticeViewModel、PracticeDetailViewModel、ProgressViewModel、WrongBookViewModel、AIAssistantViewModel  
- **工具与 AI**：AppConstants、InputValidator、PasswordUtil、Logger、QuestionDataGenerator、DatabaseInitializer、RuleBasedTextGenerator  

可通过 Android Studio 或 Dokka 生成 HTML/API 文档。

---

文档编写遵循 `.cursor/rules/documentation.md` 中的规范，图表使用 Mermaid 语法，可在支持 Mermaid 的 Markdown 预览中查看。
