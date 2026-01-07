# 测试用例文档

## 测试概述

本项目包含两类测试：
- **单元测试** (`test`目录)：测试业务逻辑，不依赖Android框架，可在JVM上运行
- **集成测试** (`androidTest`目录)：测试需要Android环境的组件，需要在设备或模拟器上运行

## 单元测试 (Unit Tests)

### 1. QuestionDataGeneratorTest
**位置**: `test/java/com/edu/primary/utils/QuestionDataGeneratorTest.java`

**测试内容**:
- ✅ 验证可以为1-6年级生成指定数量的题目
- ✅ 验证生成的题目包含所有类型（选择题、填空题、判断题）
- ✅ 验证题目答案格式正确
- ✅ 验证为所有年级生成题目的功能
- ✅ 验证不同年级的题目难度设置
- ✅ 验证边界情况（生成0道题）

**运行方式**:
```bash
./gradlew test
```

### 2. AppConstantsTest
**位置**: `test/java/com/edu/primary/constants/AppConstantsTest.java`

**测试内容**:
- ✅ 验证数据库名称常量
- ✅ 验证科目ID常量（语文、数学、英语）
- ✅ 验证年级范围常量（1-6年级）
- ✅ 验证题目类型常量
- ✅ 验证难度范围常量（1-5）
- ✅ 验证AI角色常量
- ✅ 验证Deepseek API相关常量
- ✅ 验证SharedPreferences键常量

### 3. DatabaseInitializerTest
**位置**: `test/java/com/edu/primary/utils/DatabaseInitializerTest.java`

**测试内容**:
- ✅ 验证题目生成器与初始化器的集成
- ✅ 验证为所有年级生成题目的功能

### 4. ExampleUnitTest
**位置**: `test/java/com/edu/primary/ExampleUnitTest.java`

**测试内容**:
- ✅ 基础数学运算测试
- ✅ 示例测试用例

## 集成测试 (Instrumented Tests)

### 1. UserRepositoryTest
**位置**: `androidTest/java/com/edu/primary/repository/UserRepositoryTest.java`

**测试内容**:
- ✅ 用户注册功能测试
- ✅ 重复用户名注册测试（应失败）
- ✅ 用户登录功能测试
- ✅ 用户不存在登录测试（应失败）
- ✅ 密码错误登录测试（应失败）
- ✅ 登录状态检查测试
- ✅ 登出功能测试
- ✅ 当前用户ID获取测试

**运行方式**:
```bash
./gradlew connectedAndroidTest
```

### 2. QuestionRepositoryTest
**位置**: `androidTest/java/com/edu/primary/repository/QuestionRepositoryTest.java`

**测试内容**:
- ✅ 获取题目列表测试（空列表情况）
- ✅ 获取题目数量测试
- ✅ 插入题目测试
- ✅ 通过ID获取题目测试
- ✅ 按科目和年级获取题目测试
- ✅ 插入答案测试

### 3. DatabaseTest
**位置**: `androidTest/java/com/edu/primary/database/DatabaseTest.java`

**测试内容**:
- ✅ 数据库实例创建测试
- ✅ UserEntity插入和查询测试
- ✅ QuestionEntity插入和查询测试
- ✅ AnswerEntity插入和查询测试
- ✅ WrongQuestionEntity插入和查询测试
- ✅ ChatMessageEntity插入和查询测试

### 4. ExampleInstrumentedTest
**位置**: `androidTest/java/com/edu/primary/ExampleInstrumentedTest.java`

**测试内容**:
- ✅ 应用Context测试
- ✅ 应用包名验证测试

## 测试覆盖率

### 已覆盖的模块
- ✅ 题目生成器 (QuestionDataGenerator)
- ✅ 常量类 (AppConstants)
- ✅ 数据库初始化 (DatabaseInitializer)
- ✅ 用户仓库 (UserRepository)
- ✅ 题目仓库 (QuestionRepository)
- ✅ 数据库操作 (AppDatabase, DAOs, Entities)

### 待覆盖的模块
- ⏳ UI组件测试 (Activities, Fragments)
- ⏳ ViewModel测试
- ⏳ AI Repository测试
- ⏳ 网络层测试 (API调用)
- ⏳ 错误处理测试

## 运行测试

### 运行所有单元测试
```bash
cd Android
./gradlew test
```

### 运行所有集成测试
```bash
cd Android
./gradlew connectedAndroidTest
```

### 运行特定测试类
```bash
# 单元测试
./gradlew test --tests "com.edu.primary.utils.QuestionDataGeneratorTest"

# 集成测试（需要连接设备或模拟器）
./gradlew connectedAndroidTest --tests "com.edu.primary.repository.UserRepositoryTest"
```

### 在Android Studio中运行
1. 右键点击测试类或测试方法
2. 选择 "Run 'TestName'"
3. 查看测试结果

## 测试最佳实践

1. **测试命名**: 使用描述性的测试方法名，格式为 `test[功能]_[场景]_[预期结果]`
2. **测试隔离**: 每个测试应该独立，不依赖其他测试的执行顺序
3. **清理数据**: 在`@Before`和`@After`方法中清理测试数据
4. **断言消息**: 为每个断言提供清晰的错误消息
5. **边界测试**: 测试边界情况和异常情况

## 持续集成

建议在CI/CD流程中：
1. 每次提交代码时运行单元测试
2. 在合并前运行所有测试
3. 生成测试覆盖率报告

## 测试报告

运行测试后，可以在以下位置查看报告：
- 单元测试报告: `app/build/reports/tests/test/index.html`
- 集成测试报告: `app/build/reports/androidTests/connected/index.html`

## 注意事项

1. **集成测试需要设备**: 集成测试需要在Android设备或模拟器上运行
2. **数据库清理**: 测试可能影响实际数据库，建议使用测试数据库
3. **异步操作**: 使用RxJava的`blockingGet()`或`TestObserver`来测试异步操作
4. **时间依赖**: 避免测试依赖系统时间，使用固定时间戳或Mock
