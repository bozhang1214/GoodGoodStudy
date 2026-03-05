# 环境搭建与快速启动

## 1. 环境要求

- **Android Studio**：推荐 Ladybug (2024.2.1) 或更新版本，支持 Kotlin 1.9+、Compose、KSP。
- **JDK**：17（项目 compileOptions / Kotlin JVM 目标通常为 17）。
- **Android SDK**：compileSdk / targetSdk 35；需安装对应 SDK 与 Build-Tools。
- **设备/模拟器**：API 24+ 建议，以覆盖绝大多数用户设备。

## 2. 克隆与打开工程

```bash
# 克隆仓库（若从 Git 获取）
git clone <repository-url>
cd GoodGoodStudy/Android-1

# 用 Android Studio：File → Open → 选择 Android-1 目录
```

## 3. 同步与构建

- 打开工程后，Android Studio 会自动提示同步 Gradle；若未同步，点击 **Sync Project with Gradle Files**。
- 命令行构建 Debug 包：
  ```bash
  ./gradlew :app:assembleDebug
  ```
- 输出 APK 默认在 `app/build/outputs/apk/debug/app-debug.apk`。

## 4. 运行应用

- 连接真机或启动模拟器，确保已开启 USB 调试（真机）或至少一个 AVD 在运行。
- Android Studio：选择运行配置 **app**，点击 Run（绿色三角）。
- 命令行安装并运行：
  ```bash
  ./gradlew :app:installDebug
  adb shell am start -n com.edu.primary/.MainActivity
  ```

## 5. 工程目录结构（简要）

```
Android-1/
├── app/
│   ├── build.gradle.kts       # 应用模块依赖与配置
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/edu/primary/
│       │   ├── GoodGoodStudyApp.kt
│       │   ├── MainActivity.kt
│       │   ├── ai/            # RuleBasedTextGenerator
│       │   ├── data/           # local(Entity, Dao, AppDatabase, converter), repository
│       │   ├── navigation/    # NavRoutes
│       │   ├── ui/            # ViewModelFactory, *Screen, *ViewModel 分包
│       │   └── util/          # AppConstants, InputValidator, Logger, QuestionDataGenerator, DatabaseInitializer
│       └── res/
├── gradle/
├── build.gradle.kts
├── settings.gradle.kts
├── libs.versions.toml
└── docs/                      # 架构、模块、三方、指南文档
```

## 6. 常见问题

- **Gradle 同步失败**：检查网络与代理、JDK 17、Android SDK 路径；必要时使用本地 Gradle 与 Maven 镜像。
- **KSP 未生成代码**：确认根与 app 的 build.gradle.kts 已应用 `id("com.google.devtools.ksp")`，且 Room 使用 ksp(room-compiler)。
- **compileSdk 不匹配**：确保 app/build.gradle.kts 中 compileSdk 与 targetSdk 与 libs.versions.toml 中一致（如 35）。
- **运行时崩溃（如 ClassNotFoundException）**：检查 ProGuard 规则是否保留 Room/Compose 相关类；Debug 下可先关闭 minify 与 shrinkResources 排查。

## 7. 测试

- 单元测试：`app/src/test/` 下可对 ViewModel、Repository、工具类做 JUnit 测试。
- 仪器测试：`app/src/androidTest/` 下可使用 Compose 测试与 Espresso 做 UI 测试。
- 运行：Android Studio 中右键 test 目录或具体类 → Run Tests；命令行 `./gradlew :app:testDebugUnitTest` 或 `connectedDebugAndroidTest`。
