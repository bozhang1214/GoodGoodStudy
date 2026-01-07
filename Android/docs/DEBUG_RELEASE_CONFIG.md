# Debug/Release 配置说明

## 概述

项目已配置为根据编译类型（Debug/Release）自动调整题目数量：
- **Debug包**：每次练习5道题，确保覆盖所有题型（2道单选、2道填空、1道判断）
- **Release包**：每次练习40道题

## 实现方式

### 1. 题目生成逻辑

在 `QuestionDataGenerator.java` 中：
- 当生成5道题时，自动调用 `generateMathQuestionsWithAllTypes()` 方法
- 该方法确保生成：
  - 2道单选题
  - 2道填空题
  - 1道判断题

### 2. 题目数量限制

在 `PracticeActivity.java` 中：
```java
// 根据BuildConfig.DEBUG限制题目数量
int maxQuestions = BuildConfig.DEBUG ? 5 : 40;
if (questions.size() > maxQuestions) {
    questions = questions.subList(0, maxQuestions);
}
```

### 3. 题目生成数量

在 `PracticeFragment.java` 中：
```java
// 根据BuildConfig.DEBUG决定生成题目数量
int questionCount = BuildConfig.DEBUG ? 5 : 40;
DatabaseInitializer.generateMathQuestionsForGrade(requireContext(), grade, questionCount);
```

在 `DatabaseInitializer.java` 中：
```java
// 根据BuildConfig.DEBUG决定题目数量：debug包5道，release包40道
private static final int QUESTIONS_PER_GRADE = BuildConfig.DEBUG ? 5 : 40;
```

## 编译方式

### Debug 编译
```bash
./gradlew assembleDebug
```
或使用 Android Studio：Build -> Build Bundle(s) / APK(s) -> Build APK(s)，选择 Debug

### Release 编译
```bash
./gradlew assembleRelease
```
或使用 Android Studio：Build -> Build Bundle(s) / APK(s) -> Build APK(s)，选择 Release

## 测试

### 单元测试

已更新 `QuestionDataGeneratorTest.java`，添加了测试方法：
- `testGenerateMathQuestions_FiveQuestionsWithAllTypes()`：验证生成5道题时覆盖所有题型

### 集成测试

`QuestionRepositoryTest.java` 中的测试已更新，使用5道题进行测试。

## 注意事项

1. **BuildConfig.DEBUG** 是 Android 自动生成的常量，在 Debug 构建时为 `true`，Release 构建时为 `false`
2. 确保在编译时正确选择构建类型
3. Debug 模式下，5道题会自动覆盖所有题型，便于测试
4. Release 模式下，40道题随机生成，可能不包含所有题型

## 文件修改清单

1. `QuestionDataGenerator.java` - 添加 `generateMathQuestionsWithAllTypes()` 方法
2. `PracticeActivity.java` - 添加题目数量限制逻辑
3. `PracticeFragment.java` - 根据 BuildConfig 决定生成题目数量
4. `DatabaseInitializer.java` - 根据 BuildConfig 设置默认题目数量
5. `QuestionDataGeneratorTest.java` - 添加5道题覆盖所有题型的测试
