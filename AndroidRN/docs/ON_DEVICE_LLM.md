# 端侧大模型接入方案（真实 AI 对话）

当前 AI 助手使用「基础大模型」为增强规则 + TFLite 意图，若要实现**真正的端侧生成式对话**，可考虑接入以下方案。按平台与集成难度简要列出。

---

## 一、可用的端侧推理框架与模型

### 1. **llama.cpp**（推荐，生态最成熟）

- **说明**：C/C++ 实现，支持 GGUF 格式，CPU/GPU 推理，Android 有官方示例与 JNI 封装。
- **模型**：Llama 3.2（1B/3B）、Llama 3.1 8B（量化后）、Phi-2/3、Mistral 等，均可转 GGUF 量化后运行。
- **集成方式**：Android 侧用 NDK 编译 llama.cpp，通过 JNI 暴露 `load`/`generate` 等接口，RN 通过 Native Module 调用。
- **参考**： [llama.cpp](https://github.com/ggerganov/llama.cpp) 仓库内 `examples/llama.android`。

### 2. **MLC-LLM**

- **说明**：支持多种后端（Vulkan、OpenCL、Metal 等），可编译为 Android 库。
- **模型**：Llama、Phi、Mistral、Qwen 等，通过 MLC 编译为可部署格式。
- **集成方式**：Android 使用 MLC 的 Java/Kotlin API 或 JNI 封装，RN 通过 Native Module 调用。
- **参考**： [MLC-LLM](https://github.com/mlc-ai/mlc-llm) 官方文档中的 Android 部署说明。

### 3. **MediaPipe LLM Inference API（Google）**

- **说明**：Google 提供的端侧 LLM 推理 API，与 MediaPipe 集成。
- **模型**：支持 Gemini Nano 等，依赖设备/系统支持（部分机型需 AICore）。
- **集成方式**：通过 Android MediaPipe 或 AICore API 调用，再经 Native Module 暴露给 RN。
- **注意**：设备与系统版本要求较高，需查阅当前支持的机型与 API 级别。

### 4. **ONNX Runtime + 小模型**

- **说明**：用 ONNX Runtime Mobile 在端侧跑已导出为 ONNX 的模型（如 Phi-2、TinyLlama）。
- **模型**：需自行或使用社区脚本将 HuggingFace 模型导出为 ONNX 并量化。
- **集成方式**：Android 使用 ONNX Runtime 的 Java API，RN 通过 Native Module 调用。
- **特点**：模型格式通用，但 Chat/生成式场景需自管 tokenizer 与采样逻辑。

### 5. **Transformers.js / 纯 JS 小模型**

- **说明**：在 JS 环境（如 Hermes）中跑极轻量模型，无需原生库。
- **模型**：仅适合非常小的模型（如 100M 级），在手机上速度与效果有限。
- **集成方式**：直接在 RN 的 JS 层 `import` 与调用，无 Native 集成。
- **特点**：实现简单，但能力与性能远不如上述原生方案，仅适合演示或极简场景。

---

## 二、模型尺寸与设备建议（参考）

| 模型类型        | 参数量   | 量化后体积（约） | 设备建议（RAM/SoC） |
|-----------------|----------|------------------|----------------------|
| Llama 3.2 / Phi | 1B–3B    | 0.5–2 GB        | 4GB+ RAM，中端机   |
| Llama 3.1 / Phi-3 | 8B 量化 | 4–5 GB         | 6–8GB RAM，高端机   |
| 7B 量化 (Q4)    | 7B       | ~4 GB           | 8GB+ RAM            |

- 端侧部署建议优先使用 **Q4 或 Q5 量化**，在质量与速度之间折中。
- 本应用为「小学辅导」场景，**1B–3B 小模型** 或 **Phi 系列** 即可作为首选项。

---

## 三、本项目中的接入方式建议

1. **短期**：保持当前「基础大模型」+ TFLite 意图，满足规则与简单对话。
2. **真实对话**：在 `src/ai/` 下新增例如 `llmChat.ts`，内部调用 Native Module（如 `LlamaModule.generate(prompt, options)`）。
3. **Android 实现**：新建 `android/app/.../llama/`（或 `mlc/`），用 llama.cpp 或 MLC 的 Android 示例编译为 so，封装为 RN Native Module，在「设置」的「大模型选择」中增加「端侧 Llama/Phi」等选项，并在 AI 助手中按所选模型走不同后端（规则 / TFLite / 端侧 LLM）。

文档中提到的第三方项目与 API 以各自官网与许可证为准，集成前请确认许可与兼容性。
