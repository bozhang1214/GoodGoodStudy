## module-ai-assistant：AI 助手模块

本模块负责“AI 助手”整条链路：从前端聊天 UI，到后端规则/TFLite/Llama 端侧推理，以及 LLM 模型管理与下载。

---

## 职责概述

- 提供聊天界面（消息列表、输入框、自动滚动、回到顶部按钮）。
- 统一封装对话后端：根据设置中选择的模型，路由到不同实现：
  - 内置规则回复。
  - 基础模板大模型（不依赖真实 LLM）。
  - TFLite 意图分类模型。
  - llama.rn + GGUF 端侧大模型。
- 管理 LLM 模型元数据与本地下载状态。
- 持久化聊天历史（按用户 ID 分桶）并在进入页面时恢复。

---

## 模块结构

- UI：
  - `src/screens/aiassistant/AIAssistantScreen.tsx`
- AI 后端：
  - `src/ai/chatBackend.ts`
  - `src/ai/ruleBased.ts`
  - `src/ai/baseChat.ts`
  - `src/ai/tfliteChat.ts`
  - `src/ai/llamaChat.ts`
  - `src/ai/modelCatalog.ts`
- 存储相关：
  - `src/storage/store.ts`（聊天记录、AI 模型类型、Llama 模型路径）
  - `src/storage/modelFiles.ts`（LLM 模型下载状态）

---

## 类图（核心关系）

```mermaid
classDiagram
    class AIAssistantScreen {
      -input: string
      -messages: MessageItem[]
      -aiModel: string
      -loading: boolean
      +handleSend(): Promise<void>
      +loadHistory(): Promise<void>
    }

    class ChatBackend {
      +getReply(message, historySize, modelType, recentMessages): Promise<string>
      +isTFLiteAvailable(): boolean
      +isModelLoaded(): Promise<boolean>
    }

    class RuleBased {
      +chat(message, historySize): string
    }

    class BaseChat {
      +chat(message, historySize): string
    }

    class LlamaChat {
      +getReply(message, historySize, recentMessages): Promise<string>
      +isLlamaAvailable(): boolean
    }

    class TFLiteChatJS {
      +getReply(message, historySize): Promise<string>
      +isModelLoaded(): Promise<boolean>
    }

    class Store {
      +getChatHistory(userId): Promise<ChatMessage[]>
      +appendChatMessage(userId, message): Promise<void>
      +getAiModel(): Promise<string>
      +getLlamaModelPath(): Promise<string>
    }

    AIAssistantScreen --> ChatBackend
    AIAssistantScreen --> Store
    ChatBackend --> RuleBased
    ChatBackend --> BaseChat
    ChatBackend --> LlamaChat
    ChatBackend --> TFLiteChatJS
```

---

## 业务流程（用户提问）

```mermaid
sequenceDiagram
    actor User as 学生
    participant UI as AIAssistantScreen
    participant Store as storage/store.ts
    participant Backend as ai/chatBackend.ts
    participant AI as 具体模型

    User->>UI: 在输入框中输入问题并点击发送
    UI->>UI: 本地追加用户消息到 messages
    UI->>Store: appendChatMessage(记录用户消息)
    UI->>Store: getAiModel()
    UI->>Store: getCurrentUserId() + getChatHistory(userId)
    UI->>Backend: getReply(message, historySize, modelType, recentMessages)

    alt 模型类型 = "llama"
        Backend->>AI: llamaChat.getReply(...)
        AI-->>Backend: 端侧大模型回复
    else 模型类型 = "tflite"
        Backend->>AI: TFLiteChat.getReply(...)
        AI-->>Backend: 基于意图分类的固定回复
    else 模型类型 = "rule" 或 "base"
        Backend->>AI: ruleBased/baseChat(...)
        AI-->>Backend: 模板规则回复
    end

    Backend-->>UI: 返回文本
    UI->>Store: appendChatMessage(记录助手消息)
    UI-->>User: 渲染助手消息并自动滚动到底部
```

---

## 注意事项 / TODO

- 端侧 Llama 推理会占用较多内存与时间，前端已通过超时兜底回退到基础大模型；后续可根据设备性能动态调整超时时间与上下文窗口大小。
- 如果要接入云端大模型（如 DeepSeek），可以在 `chatBackend` 中新增分支，并在设置页增加对应模型选项与 API Key 配置。

