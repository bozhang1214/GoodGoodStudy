## module-app：应用壳与导航

本模块负责应用整体入口、登录流与底部 Tab 导航，是其它业务模块（练习、进度、错题本、AI 助手、设置）的“外壳”。

---

## 职责概述

- 管理应用生命周期的顶层组件 `App.tsx`。
- 处理**登录/注册**后的主界面切换。
- 提供简单的 **Tab 导航**（练习 / 进度 / 错题本 / AI 助手 / 设置）。
- 作为 Screen 之间的中介，传递练习参数、复习错题列表等。

---

## 核心文件

- `App.tsx`：应用入口组件，包含：
  - 登录态状态机（`isLoggedIn`）。
  - 当前 Tab 状态（`tab`）。
  - 练习详情 / 复习详情的子路由状态（`screen`）。

---

## 类图（简化）

```mermaid
classDiagram
    class App {
      -isLoggedIn: boolean
      -tab: 'practice'|'progress'|'wrongBook'|'ai'|'settings'
      -screen: 'main'|'practiceDetail'|'practiceReview'
      -practiceSubjectId: number
      -practiceGrade: number
      -reviewWrongs: WrongQuestion[]|null
      +render(): JSX.Element
    }

    class LoginScreen {
      +onLoginSuccess(): void
    }
    class PracticeScreen {
      +onStartPractice(subjectId, grade): void
    }
    class PracticeDetailScreen
    class ProgressScreen
    class WrongBookScreen {
      +onReview(wrongs): void
    }
    class AIAssistantScreen
    class SettingsScreen

    App --> LoginScreen
    App --> PracticeScreen
    App --> PracticeDetailScreen
    App --> ProgressScreen
    App --> WrongBookScreen
    App --> AIAssistantScreen
    App --> SettingsScreen
```

---

## 主流程（登录 & 导航）

```mermaid
flowchart TD
    Start[启动 App] --> CheckLogin{是否已登录?}
    CheckLogin -->|否| ShowLogin[渲染 LoginScreen]
    ShowLogin --> LoginOK[登录/注册成功] --> EnterMain[切换 isLoggedIn=true]

    EnterMain --> TabPractice[默认 Tab = 练习]
    TabPractice --> Practice[PracticeScreen]
    Practice -->|开始练习| Detail[PracticeDetailScreen]

    EnterMain --> TabProgress[切换 Tab = 进度]
    TabProgress --> Progress[ProgressScreen]

    EnterMain --> TabWrongBook[切换 Tab = 错题本]
    TabWrongBook --> WrongBook[WrongBookScreen]

    EnterMain --> TabAI[切换 Tab = AI 助手]
    TabAI --> AI[AIAssistantScreen]

    EnterMain --> TabSettings[切换 Tab = 设置]
    TabSettings --> Settings[SettingsScreen]
```

---

## 注意事项 / TODO

- 当前导航逻辑完全手写在 `App.tsx` 中，后续若业务变复杂，建议迁移到 `@react-navigation/native` 的 Stack + Bottom Tabs 架构。
- 登录态仅保存在内存状态（`isLoggedIn`），如需跨重启保持登录，需要结合 `storage/store.ts` 与安全存储方案（如 Keychain/Keystore）扩展。

