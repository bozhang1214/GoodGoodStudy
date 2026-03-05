## 环境搭建与运行指南

---

## 1. 开发环境要求

- 操作系统：Windows 10/11（或 macOS / Linux）
- Node.js：建议 **18.18+**（本项目脚本基于 Node 18 及以上）
- Java：JDK **17**（React Native 0.73 官方推荐版本）
- Android Studio：
  - 安装最新稳定版
  - 安装 Android SDK 34+（含 Platform 与 Build-Tools）
  - 安装 Android Emulator（或使用真机调试）

---

## 2. 克隆与依赖安装

```bash
git clone <本仓库地址>
cd AndroidRN
npm install
```

确保使用 Node 18+，避免旧版本 Node 导致的依赖/工具链问题。

---

## 3. Android 端运行

### 方式一：一条命令（推荐）

```bash
npm run android:with-metro
```

此脚本会：

- 启动 Metro Bundler。
- 等待打包器就绪后，再构建并安装 Android App。
- 避免常见的 “Unable to load script” 红屏。

### 方式二：两个终端

1. 终端一：启动 Metro

```bash
npm start
```

2. 终端二：安装并运行

```bash
npx react-native run-android --no-packager
```

如遇到红屏 “Unable to load script”，一般是应用连不上 Metro，请检查：

- Metro 是否已在终端一正常运行。
- 模拟器/真机与电脑在同一网络环境。
- 必要时执行 `adb reverse tcp:8081 tcp:8081`（真机 USB 调试）。

---

## 4. 清理构建与常见问题

### 清理 Android 构建

```bash
npm run android:clean
```

等价于进入 `android` 目录执行 `gradlew clean`，可用于解决：

- 原生模块升级后构建不一致。
- 遇到 `ClassNotFoundException`、`Dex` 相关异常等。

### Metro 缓存问题

```bash
npx react-native start --reset-cache
```

在依赖结构变化较大或出现奇怪的模块解析错误时，可以先停止当前 Metro，再以 `--reset-cache` 重新启动。

---

## 5. 目录结构速览

```text
AndroidRN
├─ android/        # Android 原生工程（Gradle）
├─ ios/            # iOS 工程（当前主要面向 Android）
├─ src/
│  ├─ ai/          # AI 相关（规则回复、TFLite、Llama 封装等）
│  ├─ screens/     # 各业务 Screen
│  ├─ storage/     # 持久化与本地仓库
│  ├─ utils/       # 工具函数
│  ├─ navigation/  # （预留）导航相关
│  └─ types.ts     # 领域模型类型
├─ docs/           # 项目文档
└─ App.tsx         # 应用入口 & 简易 Tab 导航
```

更详细的结构说明与架构设计请参考根目录下的 `ARCHITECTURE.md`。

