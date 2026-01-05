# 快速开始指南

## 项目已完成

✅ 完整的Android项目结构已创建
✅ 所有核心功能模块已实现
✅ AI小助手（Deepseek API）已集成
✅ 编译和调试配置已完成

## 立即开始

### 1. 打开项目

1. 启动 **Android Studio 4.1**
2. 选择 `File -> Open`
3. 选择 `Android` 目录
4. 等待Gradle同步完成

### 2. 配置Deepseek API密钥

在使用AI小助手功能前，需要配置API密钥：

**方法1: 通过代码配置（临时）**
- 在 `AIRepository.java` 中临时设置API密钥
- 或通过SharedPreferences直接设置

**方法2: 通过设置界面（推荐）**
- 运行应用后，进入AI助手页面
- 根据提示配置API密钥
- 或添加设置入口（可在MainActivity中添加菜单）

### 3. 运行应用

1. 连接Android设备或启动模拟器
2. 点击 `Run` 按钮
3. 应用将自动安装并启动

### 4. 测试功能

1. **登录/注册**
   - 首次使用需要注册账号
   - 注册后自动登录

2. **AI小助手**
   - 进入AI助手页面
   - 配置API密钥后即可使用
   - 发送消息测试对话功能

3. **其他功能**
   - 练习、进度、错题本模块框架已创建
   - 可根据需要继续完善

## 构建APK

### Debug APK

**Windows:**
```cmd
cd Android
build_debug.bat
```

**Linux/Mac:**
```bash
cd Android
./gradlew assembleDebug
```

APK位置: `app/build/outputs/apk/debug/app-debug.apk`

### Release APK

**Windows:**
```cmd
build_release.bat
```

**Linux/Mac:**
```bash
./gradlew assembleRelease
```

APK位置: `app/build/outputs/apk/release/app-release.apk`

## 项目结构说明

```
Android/
├── app/
│   ├── src/main/
│   │   ├── java/com/goodgoodstudy/
│   │   │   ├── ui/              # UI层
│   │   │   ├── repository/      # 数据仓库层
│   │   │   ├── database/        # 数据库层
│   │   │   ├── network/         # 网络层
│   │   │   └── model/           # 数据模型
│   │   ├── res/                 # 资源文件
│   │   └── AndroidManifest.xml  # 应用清单
│   └── build.gradle             # 应用构建配置
├── build.gradle                 # 项目构建配置
├── settings.gradle              # 项目设置
├── build_debug.bat              # Debug构建脚本
├── build_release.bat            # Release构建脚本
├── README.md                    # 项目说明
└── BUILD.md                     # 构建指南
```

## 下一步开发建议

1. **完善练习功能**
   - 实现题目展示和答题逻辑
   - 添加题目数据（本地或API）

2. **完善进度跟踪**
   - 实现学习进度统计
   - 添加图表展示

3. **完善错题本**
   - 实现错题收集逻辑
   - 添加错题复习功能

4. **优化UI**
   - 改进界面设计
   - 添加动画效果

5. **添加更多功能**
   - 学习报告
   - 成就系统
   - 社交功能

## 注意事项

1. **API密钥安全**: 生产环境建议使用Android Keystore加密存储
2. **网络权限**: 确保设备有网络连接（AI功能需要）
3. **数据库**: 首次运行会自动创建数据库
4. **版本兼容**: 确保Android设备API级别 >= 21

## 获取帮助

- 查看 `README.md` 了解项目详情
- 查看 `BUILD.md` 了解构建和调试方法
- 查看代码注释了解实现细节

## 常见问题

**Q: 如何配置Deepseek API密钥？**
A: 可以通过代码临时设置，或添加设置界面入口。API密钥存储在SharedPreferences中。

**Q: 编译失败怎么办？**
A: 检查Gradle版本、JDK版本和网络连接。查看 `BUILD.md` 中的常见问题部分。

**Q: 应用崩溃怎么办？**
A: 查看Logcat日志，检查权限配置和API密钥设置。

---

**项目已准备就绪，可以开始开发了！** 🚀
