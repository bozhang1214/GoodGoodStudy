## @react-native-async-storage/async-storage

---

## 在本工程中的作用

- 作为 **持久化 KV 存储**，保存：
  - 用户列表 `User[]`
  - 答题记录 `Answer[]`
  - 错题记录 `WrongQuestion[]`
  - 聊天记录（按用户拆分的 `ChatMessage[]`）
  - 当前登录用户 ID、用户名
  - AI 相关偏好（当前 AI 模型类型、Llama 模型路径、LLM 模型下载信息等）
- 通过 `src/storage/store.ts` 封装为“内存缓存 + 持久化”一体的仓库。

---

## 配置方式

- 依赖：
  - `@react-native-async-storage/async-storage: ^1.21.0`
- 使用：
  - 仅在 JS 层使用，无需额外原生配置（React Native 0.73+ 自动链接）。
  - 建议在 `storage/store.ts` 一处集中封装，避免在业务层散落直接调用。

---

## 典型用法

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// 保存对象
await AsyncStorage.setItem('store_users', JSON.stringify(users));

// 读取对象
const raw = await AsyncStorage.getItem('store_users');
const users = raw ? JSON.parse(raw) : [];
```

在本项目中，会先通过一次 `loadFull()` 读取全部核心数据到内存，并缓存为 `AppStore`，后续操作同时更新内存与磁盘。

---

## 踩坑点与建议

- **仅存字符串**：复杂对象务必 `JSON.stringify` / `JSON.parse`，并做好错误兜底。
- **容量限制**（尤其是 Android）：
  - 默认约 6MB 左右，单个键不宜过大。
  - 本仓库通过将聊天记录按用户 ID 拆分为多个 key，减少单键体积。
- **安全性**：
  - AsyncStorage **不加密**，不应用于存储真正敏感数据（密码、Token 等）。
  - 本项目中登录密码使用 `js-md5` 做了简单加密，更偏向教学演示，不建议在生产环境直接照搬。
- **调试错误**：
  - 常见 JSON 解析错误多因重复 `JSON.stringify` 或未 `await getItem` 导致。
  - 建议封装统一的读写方法，在一处记录和处理异常。

