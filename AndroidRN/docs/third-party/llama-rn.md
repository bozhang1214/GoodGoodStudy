## llama.rn

---

## 在本工程中的作用

`llama.rn` 是对 **llama.cpp** 的 React Native 绑定，本项目中用于：

- 在 Android 端加载 **GGUF 格式端侧大模型**（如 Qwen / Llama / Phi 等）。
- 通过 `ai/llamaChat.ts` 提供真实生成式对话能力（“Llama（端侧）”选项）。
- 采用 React Native New Architecture + JSI，避免传统 Bridge 带来的性能瓶颈。

---

## 配置与依赖

- 依赖：
  - `llama.rn: ^0.11.0`
- Android 侧：
  - `android/gradle.properties` 中开启 `newArchEnabled=true`。
  - `android/app/proguard-rules.pro` 增加：
    - `-keep class com.rnllama.** { *; }`
  - Gradle 与 NDK 版本需满足 `llama.rn` 官方要求（已在当前工程中适配）。
- JS 侧：
  - 通过动态导入 `import('llama.rn')` 使用 `initLlama` 初始化模型上下文。

---

## 使用示例（在本项目中的模式）

```ts
// ai/llamaChat.ts 摘要
const {initLlama} = await import('llama.rn');
const ctx = await initLlama({
  model: 'file:///data/.../model.gguf',
  use_mlock: true,
  n_ctx: 2048,
  n_gpu_layers: 0,
});

const result = await ctx.completion(
  {messages, n_predict: 256, stop: STOP_WORDS},
  () => {},
);
const text = (result?.text ?? '').trim();
```

本工程中对外只暴露较高层封装 `getReply(userMessage, historySize, recentMessages)`，并在失败时自动回退到 `baseChat`，确保 AI 助手永不“失声”。

---

## 模型管理与来源

- 模型格式：**GGUF**。
- 本工程中：
  - `ai/modelCatalog.ts` 预置了来自 Gitee 仓库 `Qwen3.5-122B-A10B-GGUF` 的若干模型条目。
  - `storage/modelFiles.ts` 负责将这些模型通过 `react-native-fs` 下载到 `DocumentDirectoryPath/llm-models`。
  - 设置页面允许选择模型并设置为当前路径，再由 `llamaChat` 读取。
- 通常推荐使用 **小参数 + 量化版本** 的模型，以平衡移动端性能与效果。

---

## 踩坑与最佳实践

- **必须启用 New Architecture**：`llama.rn` v0.10+ 仅支持新架构，旧架构会在初始化时报错。
- **内存与性能**：
  - 7B 以上模型在中低端设备上可能难以稳定运行，建议选择 1B~3B 范围的小模型。
  - 可以通过降低 `n_ctx`、调整 `n_gpu_layers` 等参数缓解内存压力。
- **错误兜底**：
  - 建议始终在外层包一层“保底聊天”（本工程采用 `baseChat`），避免端侧 LLM 初始化或推理失败时造成前端卡死。

