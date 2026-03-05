## 常见问题（FAQ）

---

### Q1：运行时出现 “Unable to load script” 红屏？

- 原因：应用未能连接到 Metro Bundler。
- 排查步骤：
  - 确认已在一个终端中执行 `npm start`，Metro 正常运行且无报错。
  - 使用推荐脚本：`npm run android:with-metro`，自动串联 Metro 与构建。
  - 物理真机调试时，执行：

    ```bash
    adb reverse tcp:8081 tcp:8081
    ```

  - 如端口被其他进程占用，可尝试改用 `--port` 参数启动 Metro。

---

### Q2：构建或安装 Android 时频繁失败，如何“重置”工程？

- 建议按顺序尝试：

```bash
npm run android:clean          # 清理 Android 构建
del node_modules /s /q         # 或手动删除 node_modules
npm install
npx react-native start --reset-cache
```

若仍有 Gradle/AGP 相关错误，可在 Android Studio 中打开 `android` 工程，查看更详细的构建日志。

---

### Q3：AI 助手对话“没反应”或一直在 Loading？

- 可能原因：
  - 端侧 Llama 模型路径不正确，或 GGUF 文件不存在 / 无法读取。
  - 端侧推理时间过长，超过前端设置的超时时间，被回退到基础大模型。
- 建议：
  - 在设置页中：
    - 若仅想体验基础聊天，可选择“基础大模型”或“内置规则”模式。
    - 仅在确认设备性能与存储空间充足时，再开启 “Llama（端侧）” 模式，并正确设置 GGUF 文件路径。
  - 如长时间 Loading，可返回设置改回基础模式，确保 AI 助手可用。

---

### Q4：练习/进度/错题本数据突然“丢失”了？

- 本项目使用 AsyncStorage 存储数据（小型教学项目），在以下情况下可能出现“数据重置”现象：
  - 卸载应用后重新安装。
  - Android 某些 ROM 在清理应用数据时会同时清空内部存储。
- 建议：
  - 将本项目视为教学和 Demo 工程，不将其作为长期、生产级数据存储方案。
  - 若要在生产环境使用，建议改用 SQLite/Room 等更可靠的本地数据库方案。

---

### Q5：端侧大模型（Llama）一定要用吗？性能会怎样？

- 否，本项目默认使用 **基础大模型 + 规则回复** 即可完成日常问答与陪练；
- 端侧 Llama 模式主要用于探索“在手机上跑真大模型”的可能性：
  - 需要较大的存储空间（数 GB 至十几 GB 不等）。
  - 需要高内存、高性能 SoC，低配机型可能出现卡顿甚至被系统杀进程。
  - 在实际教学场景中，更推荐使用云端大模型（通过 API 调用）。

