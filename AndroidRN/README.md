# AndroidRN（好好学习 - React Native）

## 运行与调试

**必须：先有 Metro 在运行，应用才能加载 JS，否则会红屏 “Unable to load script”。**

**方式一（推荐，一条命令）**
```bash
npm run android:with-metro
```
会自动启动 Metro、等其就绪后再安装并启动应用，避免红屏。

**方式二（两个终端）**
1. **终端一**：`npm start`，保持运行。
2. **终端二**：`npx react-native run-android --no-packager`。

若出现 **“Unable to load script”** 红屏，说明应用连不上 Metro，请确认：
- 终端一里 Metro 已启动且无报错；
- 模拟器/真机与电脑在同一网络（模拟器默认通过 `10.0.2.2:8081` 访问本机）；
- 必要时在应用内摇一摇 → Reload，或重新执行步骤 2。

## AI 助手（端侧 TFLite）

AI 助手使用 **端侧 TensorFlow Lite** 做**意图分类 + 固定回复**，实现基本人机对话，无需联网。

- **说明**：当前**没有**接入「离线大模型」（如 LLM），不能回答开放问答（如“天为什么是蓝的”“今天天气如何”）。仅支持：识别意图（打招呼/数学/感谢/其他）后返回预设回复。
- **有意图模型**：在 `android/app/src/main/assets/` 下放置 `intent_classifier.tflite` 后，将使用 TFLite 做意图分类；界面会显示「端侧 · 意图模型」。
- **无模型**：使用内置规则回复；界面会显示「端侧 · 规则回复」。
- 生成 TFLite 意图模型（可选）：`pip install tensorflow` 后执行 `python scripts/export_intent_model.py`，会将模型写入 `android/.../assets/`。
- **接入真实端侧大模型**：可参考 [docs/ON_DEVICE_LLM.md](docs/ON_DEVICE_LLM.md) 中列出的方案（如 llama.cpp、MLC-LLM、MediaPipe、ONNX 等）与集成建议。

### Llama（端侧，真实对话）

已通过 **llama.rn** 接入 [llama.cpp](https://github.com/ggerganov/llama.cpp)，可在设置中选择「Llama（端侧）」并使用 GGUF 模型进行真实生成式对话。

- **要求**：项目已开启 React Native New Architecture（`android/gradle.properties` 中 `newArchEnabled=true`）。
- **使用步骤**：
  1. 在「设置」→「AI 大模型」中选择 **Llama（端侧）**。
  2. 在「Llama 模型路径」中填写 GGUF 模型文件路径（如 `file:///data/user/0/.../files/model.gguf` 或设备上的绝对路径），点击「保存路径」。
  3. 进入「AI 助手」即可与端侧模型对话。首次加载模型可能较慢（最多约 60 秒），后续回复会更快。
- **模型获取**：在 [HuggingFace](https://huggingface.co/search?q=GGUF) 搜索 GGUF 格式模型（如 Llama、Phi、Qwen 等小参数量化版），下载后放入应用可访问的目录并填写上述路径。

## 脚本说明

| 命令 | 说明 |
|------|------|
| `npm start` | 启动 Metro，开发时需保持运行 |
| `npm run android` | 构建并安装到设备（会尝试启动 Metro） |
| `npm run android:with-metro` | 先启 Metro 再跑应用，避免 “Unable to load script” 红屏 |
| `npm run android:wait` | 等模拟器就绪后自动运行应用（需另开终端跑 Metro） |
| `npm run android:clean` | 清理 Android 构建（遇原生相关问题时使用） |

## 项目文档索引

本工程已按模块整理了开发文档，位于 `docs/` 目录，推荐从下列入口阅读：

- **整体架构**
  - `ARCHITECTURE.md`：系统分层架构、核心模块关系、主要业务与数据流。
- **模块文档（docs/modules）**
  - `module-app.md`：应用壳与登录/Tab 导航。
  - `module-practice.md`：练习、进度与错题本业务。
  - `module-ai-assistant.md`：AI 助手 UI 与对话后端（规则 / TFLite / Llama）。
- **第三方框架说明（docs/third-party）**
  - `react-native.md`：React / React Native 在本项目中的用法与注意事项。
  - `async-storage.md`：AsyncStorage 存储设计与坑点。
  - `llama-rn.md`：llama.rn 端侧大模型集成说明。
  - `react-native-fs.md`：文件系统与 GGUF 模型下载。
  - `tflite-android.md`：Android 端 TensorFlow Lite 集成与意图分类模块。
- **开发辅助文档（docs/guide）**
  - `setup.md`：环境搭建与运行指南。
  - `testing.md`：测试与质量保障建议。
  - `faq.md`：运行/构建/AI 相关常见问题。
  - 端侧 LLM 相关补充文档：`ON_DEVICE_LLM.md`、`QWEN122B_GGUF_ANALYSIS.md`。
