# 好好学习 - Android-1（Compose 版）

基于 **Android** 项目功能改写的 Kotlin + Jetpack Compose 版本，保持功能一致，并采用以下技术栈：

## 技术栈

- **UI**：Jetpack Compose（Composable）
- **状态**：ViewModel + StateFlow / LiveData
- **数据**：Room + Kotlin 协程 / Flow
- **导航**：Navigation Compose
- **AI**：本地规则回退（可扩展 TFLite，参考 [aiAssistant](https://github.com/your-org/aiAssistant)）

## 功能概览

1. **用户**：登录 / 注册（密码 MD5 存储）
2. **练习**：科目 / 年级选择，数学题生成与答题，提交批改、错题记录
3. **进度**：总题数、正确数、正确率
4. **错题本**：错题列表，点击进入复习（PracticeDetail 复习模式）
5. **AI 小助手**：聊天式问答，当前为规则回退；可后续接入 TFLite（参考 aiAssistant 的 `TFLiteTextGenerator` + `RuleBasedTextGenerator`）
6. **设置**：Deepseek API 密钥（可选，便于后续扩展云端 AI）

## 项目结构（简要）

```
app/src/main/java/com/edu/primary/
├── GoodGoodStudyApp.kt          # Application，提供 Repository
├── MainActivity.kt              # 单 Activity，Compose + NavHost
├── ai/                           # 本地 AI
│   └── RuleBasedTextGenerator.kt
├── data/
│   ├── local/                    # Room 实体、DAO、Database、Converter
│   └── repository/               # UserRepository, QuestionRepository, AIRepository
├── navigation/
│   └── NavRoutes.kt
├── ui/
│   ├── ViewModelFactory.kt
│   ├── MainScreen.kt             # 底部导航 + 各 Tab
│   ├── login/LoginScreen.kt, LoginViewModel
│   ├── practice/PracticeScreen, PracticeDetailScreen, PracticeViewModel, PracticeDetailViewModel
│   ├── progress/ProgressScreen, ProgressViewModel
│   ├── wrongbook/WrongBookScreen, WrongBookViewModel
│   ├── aiassistant/AIAssistantScreen, AIAssistantViewModel
│   ├── settings/SettingsScreen.kt
│   └── theme/
└── util/                         # AppConstants, InputValidator, PasswordUtil, Logger, QuestionDataGenerator, DatabaseInitializer
```

## 编译与运行

```bash
cd Android-1
./gradlew assembleDebug
# 安装：adb install -r app/build/outputs/apk/debug/app-debug.apk
```

- **compileSdk / targetSdk**：35  
- **minSdk**：24  
- 依赖：Room、Navigation Compose、ViewModel、Compose BOM、TensorFlow Lite（已加入，可用于后续 TFLite 接入）

## 与 Android（原版）的对应关系

| 原 Android (Java/XML)     | Android-1 (Kotlin/Compose)     |
|--------------------------|---------------------------------|
| MainActivity + Fragment  | MainActivity + NavHost + MainScreen 底部 Tab |
| LoginActivity            | LoginScreen + LoginViewModel   |
| PracticeFragment         | PracticeScreen + PracticeViewModel |
| PracticeActivity         | PracticeDetailScreen + PracticeDetailViewModel |
| ProgressFragment         | ProgressScreen + ProgressViewModel |
| WrongBookFragment        | WrongBookScreen + WrongBookViewModel |
| AIAssistantFragment      | AIAssistantScreen + AIAssistantViewModel |
| SettingsActivity         | SettingsScreen                 |
| Deepseek API             | 规则回退 + 预留 API Key 设置；可接 TFLite |

## TFLite 扩展说明

若需接入本地 TFLite（如 aiAssistant 中的 GPT-2 文本生成）：

1. 将 aiAssistant 中的 `TFLiteRunner`、`TFLiteTextGenerator`、`Gpt2Generator`、`Gpt2Tokenizer`、`ModelRepository` 等迁入或封装到 `com.edu.primary.ai`。
2. 在 `AIRepository.sendMessage` 中优先调用 TFLite 生成，失败或未加载模型时再使用 `RuleBasedTextGenerator.chat`。

当前已依赖 `org.tensorflow:tensorflow-lite`，便于后续直接集成。
