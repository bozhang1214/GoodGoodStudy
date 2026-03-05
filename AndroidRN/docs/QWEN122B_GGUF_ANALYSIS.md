# Qwen3.5-122B-A10B-GGUF 仓库分析

仓库地址：<https://gitee.com/hf-models/Qwen3.5-122B-A10B-GGUF>

## 模型概况

- **基座**：Qwen3.5-122B-A10B（122B 总参数，10B 激活的 MoE）
- **用途**：多模态 + 文本生成，支持 262K 上下文
- **体量**：即使用最小量化，单文件仍约 **15GB+**，不适合随 APK 打包，仅适合在设备上由用户按需下载

## 根目录 GGUF 文件（可直接下载）

| 文件名 | 说明 | 推荐场景 |
|--------|------|----------|
| `Qwen3.5-122B-A10B-UD-IQ1_S.gguf` | Unsloth Dynamic 最小量化 | 高端设备、优先体积 |
| `Qwen3.5-122B-A10B-UD-IQ1_M.gguf` | UD IQ1 中等 | 高端设备 |
| `Qwen3.5-122B-A10B-UD-IQ2_XXS.gguf` | UD IQ2 超小 | 高端设备 |
| `Qwen3.5-122B-A10B-UD-IQ2_M.gguf` | UD IQ2 中等 | 高端设备 |
| `Qwen3.5-122B-A10B-UD-IQ3_XXS.gguf` | UD IQ3 超小 | 高端设备、略好质量 |
| `Qwen3.5-122B-A10B-UD-IQ3_S.gguf` | UD IQ3 小 | 高端设备 |

以上 6 个文件已在应用「设置 → Llama（端侧）→ 预置模型」中列为可选项，使用 Gitee raw 地址下载。

## 子目录中的量化格式（需进目录取文件）

- `Q3_K_S`, `Q3_K_M`, `Q4_K_S`, `Q4_K_M`, `Q5_K_S`, `Q5_K_M`, `Q6_K`, `Q8_0`
- `IQ4_NL`, `IQ4_XS`, `MXFP4_MOE`
- `UD-Q3_K_XL`, `UD-Q4_K_XL`, `UD-Q5_K_XL`, `UD-Q6_K_XL`, `UD-Q8_K_XL`, `UD-IQ4_NL`
- `BF16`（未量化，体积最大）

如需其中某一项，可在 Gitee 仓库对应子目录中查看具体 `.gguf` 文件名，并用「自定义路径」或后续扩展下载列表的方式使用。

## 其他文件

- `mmproj-*.gguf`：多模态投影器，与纯文本对话无关，可不下载。
- `README.md` / `config.json`：说明与配置，非推理用。

## 推荐「放在本地」的默认模型（随应用打包）

**不建议**把 Qwen3.5-122B 任意版本放进 APK（体积过大）。推荐：

- **推荐随应用打包**：**Phi-2 Q4_K_M**（约 1.8GB）  
  - 将 `phi-2.Q4_K_M.gguf` 放入 `android/app/src/main/assets/models/`，并命名为 `phi-2-q4_k_m.gguf`，应用默认路径为 `file:///android_asset/models/phi-2-q4_k_m.gguf`。
- **可选**：Llama 3.2 1B Instruct Q4（约 2GB），同样适合作为默认离线模型，由用户在「预置模型」中下载到设备后选用。

当前应用内「推荐本地」标记已用于 Phi-2；Qwen3.5-122B 系列仅作为用户可选下载，且标注「约 15GB+（高端设备）」以作提醒。
