# 第三方框架：Jetpack Compose 与 Room

## 1. 在本工程中的作用

- **Jetpack Compose**：所有 UI 使用 Kotlin 声明式 Composables（*Screen），主题在 GoodGoodStudyTheme 中统一；与 ViewModel 的 StateFlow 通过 `collectAsState()` 绑定。
- **Room**：唯一关系型数据源，通过 AppDatabase 单例提供 UserDao、QuestionDao、AnswerDao、WrongQuestionDao、ChatMessageDao；配合 KSP 与 TypeConverter（StringListConverter）使用。

相关依赖还包含：Navigation Compose（路由）、ViewModel Compose（viewModel()）、Lifecycle（viewModelScope）。

## 2. 配置方式与关键配置

### 2.1 Gradle（libs.versions.toml / build.gradle.kts）

- **Compose**：通过 BOM（androidx.compose:compose-bom）统一版本；应用模块需 `implementation(libs.compose.bom)` 及 ui、material3、activity-compose 等。
- **Room**：room-runtime、room-ktx、room-compiler（ksp）；KSP 插件需在根 build.gradle.kts 与 app 中应用。
- **Navigation Compose**：navigation-compose。
- **Kotlin 序列化**：kotlinx-serialization-json，用于 StringListConverter 与 Room TypeConverter。

### 2.2 Room 数据库

- **AppDatabase**：@Database 声明 entities、version、exportSchema = false；@TypeConverters(StringListConverter::class)。
- **单例**：getInstance(context) 使用 applicationContext，synchronized 双重检查，fallbackToDestructiveMigration() 便于开发阶段。

### 2.3 Compose 与 ViewModel

- **ViewModel 获取**：`viewModel(factory = ViewModelFactory(app))`，需在可组合项中传入 Application 转成的 GoodGoodStudyApp。
- **状态收集**：`val uiState by viewModel.uiState.collectAsState()`，状态变化触发重组。

## 3. 使用示例（从本工程提取）

### 3.1 Room DAO 与 TypeConverter

```kotlin
// StringListConverter：List<String> ↔ JSON
@TypeConverter
fun fromStringList(value: List<String>?): String? =
    value?.let { json.encodeToString(ListSerializer(String.serializer()), it) }

@TypeConverter
fun toStringList(value: String?): List<String>? =
    value?.let { json.decodeFromString(ListSerializer(String.serializer()), it) }
```

```kotlin
// 使用 suspend 与 Flow 的 Dao
@Query("SELECT * FROM questions WHERE subjectId = :subjectId AND grade = :grade")
suspend fun getBySubjectAndGrade(subjectId: Int, grade: Int): List<QuestionEntity>
```

### 3.2 Compose 中 ViewModel 与导航

```kotlin
@Composable
fun PracticeDetailScreen(
    subjectId: Int,
    grade: Int,
    wrongIds: List<Long>?,
    isReviewMode: Boolean,
    onBack: () -> Unit
) {
    val app = LocalContext.current.applicationContext as GoodGoodStudyApp
    val viewModel: PracticeDetailViewModel = viewModel(
        factory = ViewModelFactory(app)
    )
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(subjectId, grade, wrongIds) {
        viewModel.loadQuestions(subjectId, grade, wrongIds)
    }
    // ... UI 使用 uiState.questions, currentIndex, tempAnswers, resultDialog 等
}
```

### 3.3 导航路由与参数

```kotlin
composable(
    route = "practice_detail/{subjectId}/{grade}",
    arguments = listOf(
        navArgument("subjectId") { type = NavType.IntType },
        navArgument("grade") { type = NavType.IntType }
    )
) { backStackEntry ->
    val subjectId = backStackEntry.arguments?.getInt("subjectId") ?: 1
    val grade = backStackEntry.arguments?.getInt("grade") ?: 1
    PracticeDetailScreen(subjectId = subjectId, grade = grade, ...)
}
```

## 4. 注意事项与最佳实践

- **线程**：所有 Room 与 IO 操作在 Repository 内通过 `withContext(Dispatchers.IO)` 执行，ViewModel 仅用 viewModelScope.launch，不在主线程直接访问 DB。
- **类型转换**：QuestionEntity.options 为 List&lt;String&gt; 时，必须通过 @TypeConverters 注册 StringListConverter，否则编译报错。
- **导航与 ViewModel 作用域**：当前每个 Screen 内获取的 ViewModel 与 NavBackStackEntry 作用域一致，进入新路由会创建新 ViewModel 实例；若需在图形级别共享 ViewModel，可使用 NavController 的 graph 或 parentEntry 的 viewModel。
- **Compose 重组**：仅读取 StateFlow 的 composable 会在 flow 发射新值时重组；避免在 Composable 中发起一次性请求时忘记用 LaunchedEffect，导致每次重组都请求。

## 5. 学习与参考

- [Compose 官方文档](https://developer.android.com/jetpack/compose)
- [Room 持久化库](https://developer.android.com/training/data-storage/room)
- [Navigation Compose](https://developer.android.com/jetpack/compose/navigation)
- [在 Compose 中使用 ViewModel](https://developer.android.com/jetpack/compose/libraries#viewmodel)
