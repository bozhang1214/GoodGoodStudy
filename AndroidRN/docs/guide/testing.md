## 测试与质量保障

本工程使用 Jest 作为基础测试框架，并预置 ESLint + Prettier 规范代码风格。当前仓库尚未大量编写测试用例，但可按以下方式扩展。

---

## 1. Jest 配置与运行

- 依赖：
  - `jest`, `react-test-renderer`, `@types/jest` 等已在 `devDependencies` 中配置。
- 配置：
  - 根目录 `jest.config.js` 使用 `preset: 'react-native'`。

运行测试：

```bash
npm test
```

可在 `__tests__/` 目录下为各个组件与工具函数编写单元测试与快照测试。

---

## 2. 建议的测试范围

- **纯函数与工具**
  - `utils/validator.ts`：用户名/密码合法性校验。
  - `utils/password.ts`：密码加密逻辑（可验证与后端/原生实现一致性）。
  - `utils/questionGenerator.ts`：题目生成逻辑（题目数量、难度范围、答案正确性）。

- **存储层**
  - `storage/store.ts`：
    - 使用 Jest + AsyncStorage Mock 验证用户/答题/错题/聊天记录的增删改查。
  - `storage/modelFiles.ts`：
    - 通过 Mock `react-native-fs` 验证下载成功/失败时状态的更新逻辑。

- **UI 组件（关键 Screen）**
  - 登录页面：不同输入场景下错误提示展示是否正确。
  - 练习详情页：答题后是否正确调用存储层更新答案和错题。
  - AI 助手页：发送消息后，UI 状态（loading、历史消息渲染）是否符合预期（可通过 Mock `chatBackend`）。

---

## 3. ESLint 与 Prettier

- 已配置：
  - `.eslintrc.js` 使用官方 `@react-native/eslint-config`。
  - `.prettierrc.js` 统一代码风格（单引号、2 空格缩进等）。

常用命令：

```bash
npm run lint
```

如需自动修复简单问题，可临时在本地执行：

```bash
npx eslint . --fix
```

建议在提交前至少运行一次 `npm run lint`，保证代码风格统一、避免明显语法问题。

---

## 4. 后续改进建议

- 引入 `@testing-library/react-native`，对关键 Screen 进行更贴近用户行为的交互测试（点击、输入、滚动等）。
- 为 AI 模块编写“契约测试”：Mock 端侧/云端 LLM，确保 `chatBackend` 在不同错误场景下均能优雅回退到基础大模型或规则回复。

