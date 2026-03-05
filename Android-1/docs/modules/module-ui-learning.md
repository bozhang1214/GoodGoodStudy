# 模块：练习与进度 UI（Compose + ViewModel）

## 1. 职责概述

本模块包含练习入口、练习详情（含错题复习）、进度统计、错题本四个功能对应的 Compose 界面与 ViewModel，以及登录、主界面、设置等通用 UI，状态由 StateFlow 驱动。

## 2. 核心类列表

| 界面/ViewModel | 职责 |
|----------------|------|
| LoginScreen / LoginViewModel | 登录、注册，成功后回调 onLoginSuccess |
| MainScreen | 底部 Tab：练习、进度、错题本、AI 助手；导航到练习详情/错题复习/设置 |
| PracticeScreen / PracticeViewModel | 学科/年级选择，加载题目数量，进入练习详情 |
| PracticeDetailScreen / PracticeDetailViewModel | 题目列表、当前索引、临时答案、提交判分、结果弹窗、错题记录 |
| ProgressScreen / ProgressViewModel | 展示总答题数、正确数、正确率 |
| WrongBookScreen / WrongBookViewModel | 错题列表，进入错题复习 |
| SettingsScreen | 设置页，返回与预留扩展（如 API Key） |
| AIAssistantScreen / AIAssistantViewModel | 聊天列表、发送消息、清空历史（见 module-ai） |

## 3. 练习详情状态与流程

```mermaid
stateDiagram-v2
    [*] --> Loading: loadQuestions
    Loading --> Ready: 题目加载完成
    Ready --> Answering: 用户答题
    Answering --> Ready: 上一题/下一题
    Answering --> Submitted: submitAll
    Submitted --> [*]: dismissResultDialog
```

- **PracticeDetailUiState**：questions, currentIndex, tempAnswers, allSubmitted, resultDialog 等。
- **提交逻辑**：遍历 questions，用 tempAnswers 取答案 → checkAnswer（单选/填空/判断题规则）→ insertAnswer、错题 addWrongQuestion 或 removeWrongQuestion / incrementReviewCount（复习模式）→ 弹出 ResultDialog。

## 4. 导航与参数

| 路由 | 参数 | 说明 |
|------|------|------|
| practice_detail/{subjectId}/{grade} | Int, Int | 普通练习，由 PracticeScreen 传入学科与年级 |
| practice_review/{wrongIds} | String | 错题 ID 逗号拼接，由 WrongBookScreen 传入 |

ViewModel 通过 ViewModelFactory 获取；PracticeDetailViewModel 需 subjectId、grade、wrongIds、isReviewMode，由 Screen 从 NavBackStackEntry 解析后传入。

## 5. 类关系（ViewModel 与 Repository）

```mermaid
sequenceDiagram
    participant Screen
    participant ViewModel
    participant Repository

    Screen->>ViewModel: 用户操作（加载/提交等）
    ViewModel->>ViewModel: viewModelScope.launch
    ViewModel->>Repository: suspend 方法
    Repository->>Repository: withContext(IO)
    Repository-->>ViewModel: Result / List / 数据
    ViewModel->>ViewModel: _uiState.value = ...
    ViewModel-->>Screen: uiState.collectAsState()
    Screen->>Screen: 重组并渲染
```

## 6. 与数据层关系

- **PracticeViewModel**：QuestionRepository.getQuestionCount；UserRepository 用于后续扩展（如按用户过滤）。
- **PracticeDetailViewModel**：QuestionRepository.getQuestions / getQuestionsByIds、insertAnswer、addWrongQuestion、removeWrongQuestion、incrementReviewCount；UserRepository.getCurrentUserId。
- **ProgressViewModel**：QuestionRepository.getProgressData；UserRepository.getCurrentUserId。
- **WrongBookViewModel**：QuestionRepository.getWrongQuestions；UserRepository.getCurrentUserId。
