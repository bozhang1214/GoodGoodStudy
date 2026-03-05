## TensorFlow Lite (Android)

---

## 在本工程中的作用

通过 TensorFlow Lite 提供一个 **端侧意图分类模型**，用于在 AI 助手中识别用户的大致意图，并返回固定模板回复：

- 模型文件：`intent_classifier.tflite`（放置于 `android/app/src/main/assets/`）。
- 分析关键词：打招呼、数学相关、感谢、其它等若干中文/英文短语。
- 输出类别：`greet / math / thanks / other`。

当模型存在且加载成功时，AI 助手的 “TFLite 意图” 模式会调用此原生模块；否则退回到纯规则回复。

---

## 配置方式

- Gradle 依赖（`android/app/build.gradle`）：

```gradle
dependencies {
    implementation("org.tensorflow:tensorflow-lite:2.14.0")
}
```

- 原生模块：
  - `android/app/src/main/java/com/androidrn/tflite/TFLiteChatModule.kt`
  - `android/app/src/main/java/com/androidrn/tflite/TFLiteChatPackage.kt`
  - 在 `MainApplication.kt` 中通过 `PackageList` 手工添加 `TFLiteChatPackage()`。

---

## 关键实现（概念性说明）

- 加载模型：
  - 启动时从 `assets/intent_classifier.tflite` 复制到缓存目录，再使用 `Interpreter` 映射为内存缓冲。
- 特征工程：
  - 将输入文本统一为小写，按预定义 `KEYWORDS` 数组（如 “你好/hello/数学/错题/再见” 等）构建一个定长浮点数组。
- 推理：

```kotlin
val input = floatArrayOf(...) // 关键词特征
val output = Array(1) { FloatArray(NUM_CLASSES) }
interpreter?.run(input, output)
```

- 将输出向量中最大值索引映射到 `INTENTS`（`greet/math/thanks/other`），再根据类别选择一条中文模板回复。

---

## JS 层调用

- 在 `ai/chatBackend.ts` 中通过 `NativeModules.TFLiteChat` 调用：
  - `getReply(text, historySize): Promise<string>`
  - `isModelLoaded(): Promise<boolean>`
- 在 `AIAssistantScreen` 中：
  - 通过 `isTFLiteAvailable()` 判断当前平台和模块是否可用。
  - 通过 `isModelLoaded()` 控制 UI 上的模型加载状态提示。

---

## 踩坑与建议

- **模型文件体积**：
  - TFLite 模型相对小巧，但仍建议控制在数 MB 以内，以免增大 APK 体积。
- **异常兜底**：
  - 原生推理中如发生异常，会在 JS 层退回到规则回复，确保不会导致白屏或崩溃。
- **未来演进**：
  - 若要扩展为真正的 TFLite LLM，需重新设计输入/输出张量与 Tokenizer，本模块更适合用作轻量级意图识别或分类任务。

