# 鸿蒙项目编译和调试指南

## 前置要求

### 1. 安装 DevEco Studio

1. 访问 [华为开发者官网](https://developer.harmonyos.com/)
2. 下载并安装 DevEco Studio（推荐最新版本）
3. 启动 DevEco Studio 并完成初始化配置

### 2. 配置 HarmonyOS SDK

1. 打开 DevEco Studio
2. 进入 `File -> Settings -> Appearance & Behavior -> System Settings -> HarmonyOS SDK`
3. 配置 SDK 路径（如果未自动配置）
4. 确保已安装 API 9 版本的 SDK

### 3. 配置签名证书（用于真机调试）

1. 进入 `File -> Project Structure -> Project -> Signing Configs`
2. 创建或导入签名证书
3. 配置签名信息

## 使用 DevEco Studio 编译

### 编译 HAP

1. 打开项目：`File -> Open`，选择 `Harmony` 目录
2. 等待项目同步完成（首次打开可能需要较长时间）
3. 点击菜单栏 `Build -> Build Hap(s)/APP(s) -> Build Hap(s)`
4. 编译完成后，HAP 文件位于：`entry/build/default/outputs/default/entry-default-signed.hap`

### 编译 APP

1. 点击菜单栏 `Build -> Build Hap(s)/APP(s) -> Build APP(s)`
2. 编译完成后，APP 文件位于：`entry/build/default/outputs/default/entry-default-signed.app`

## 使用命令行编译

### 前置要求

确保已安装 Node.js（推荐 v14 或更高版本）

### 编译步骤

```bash
# 进入项目目录
cd Harmony

# 首次运行需要安装依赖（如果使用hvigorw）
# Windows
hvigorw.bat assembleHap

# Linux/Mac
./hvigorw assembleHap
```

### 编译选项

- `assembleHap`: 编译 HAP 包
- `assembleApp`: 编译 APP 包
- `clean`: 清理构建产物

## 调试应用

### 使用模拟器

1. 在 DevEco Studio 中点击 `Tools -> Device Manager`
2. 创建或启动 HarmonyOS 模拟器
3. 点击 `Run` 按钮运行应用

### 使用真机

1. 在设备上启用开发者模式：
   - 进入 `设置 -> 关于手机`
   - 连续点击 `版本号` 7次
   - 返回 `设置 -> 系统和更新 -> 开发人员选项`
   - 启用 `USB调试`
2. 连接设备到电脑
3. 在 DevEco Studio 中点击 `Run` 按钮
4. 选择连接的设备

### 查看日志

1. 在 DevEco Studio 底部打开 `Log` 窗口
2. 选择设备或模拟器
3. 过滤日志：输入关键字搜索

## 常见问题

### 1. 项目同步失败

**问题**: Gradle 同步失败

**解决方案**:
- 检查网络连接
- 检查 SDK 配置是否正确
- 尝试清理项目：`Build -> Clean Project`
- 重新同步：`File -> Sync Project with Gradle Files`

### 2. 编译错误：找不到模块

**问题**: `Cannot find module '@ohos/xxx'`

**解决方案**:
- 确保已正确安装 HarmonyOS SDK
- 检查 `module.json5` 中的依赖配置
- 重新同步项目

### 3. 运行时错误：权限不足

**问题**: 应用运行时提示权限不足

**解决方案**:
- 检查 `module.json5` 中的权限声明
- 在设备上手动授予权限：`设置 -> 应用 -> [应用名] -> 权限`

### 4. 数据库初始化失败

**问题**: 数据库相关错误

**解决方案**:
- 检查 Context 是否正确初始化
- 确保在 EntryAbility 中调用了 `setContext`
- 检查数据库表结构是否正确

### 5. 网络请求失败

**问题**: API 请求失败

**解决方案**:
- 检查网络权限是否已授予
- 检查 API 密钥是否正确配置
- 检查网络连接是否正常
- 查看日志中的详细错误信息

## 性能优化建议

1. **减少不必要的重新渲染**: 使用 `@State` 和 `@Prop` 合理管理状态
2. **优化数据库查询**: 使用索引，避免全表扫描
3. **网络请求优化**: 使用缓存，减少重复请求
4. **图片资源优化**: 使用适当尺寸的图片，避免过大资源

## 发布应用

### 准备发布

1. 配置应用签名
2. 更新版本号（在 `app.json5` 中）
3. 测试所有功能
4. 生成 Release 版本的 HAP/APP

### 发布到应用市场

1. 登录 [华为开发者联盟](https://developer.huawei.com/)
2. 创建应用
3. 上传 HAP/APP 文件
4. 填写应用信息
5. 提交审核

## 参考资源

- [HarmonyOS 开发文档](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/start-overview-0000001478061421-V3)
- [ArkTS 语言规范](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-overview-0000001477981205-V3)
- [DevEco Studio 使用指南](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/ohos-deveco-studio-user-guide-0000001263280425-V3)
