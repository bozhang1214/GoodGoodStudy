# 编译检查清单

## 编译前检查

### 1. 环境检查
- [ ] DevEco Studio 已安装
- [ ] HarmonyOS SDK (API 9) 已安装
- [ ] Node.js 已安装（用于hvigor构建工具）

### 2. 项目结构检查
- [ ] `AppScope/app.json5` 存在
- [ ] `entry/src/main/module.json5` 存在
- [ ] `entry/src/main/ets/entryability/EntryAbility.ts` 存在
- [ ] `entry/src/main/resources/base/profile/main_pages.json` 存在
- [ ] `entry/src/main/resources/base/element/string.json` 存在

### 3. 代码检查
- [ ] 所有 `.ts` 和 `.ets` 文件语法正确
- [ ] 所有导入路径正确
- [ ] 没有未定义的变量或函数
- [ ] 错误处理已实现

### 4. 配置检查
- [ ] `module.json5` 中的页面路径正确
- [ ] 权限声明正确
- [ ] 应用信息配置正确

## 编译步骤

### 步骤1: 打开项目
```bash
# 在 DevEco Studio 中
File -> Open -> 选择 Harmony 目录
```

### 步骤2: 等待同步
- [ ] 等待 Gradle 同步完成
- [ ] 检查是否有错误提示

### 步骤3: 配置签名（可选，真机调试需要）
- [ ] 进入 `File -> Project Structure -> Project -> Signing Configs`
- [ ] 创建或选择签名配置
- [ ] 填写签名信息

### 步骤4: 编译
- [ ] 点击 `Build -> Build Hap(s)/APP(s) -> Build Hap(s)`
- [ ] 等待编译完成
- [ ] 检查编译输出是否有错误

### 步骤5: 验证编译产物
- [ ] 检查 `entry/build/default/outputs/default/` 目录
- [ ] 确认 `entry-default-signed.hap` 文件存在
- [ ] 检查文件大小（应该 > 0）

## 运行时检查

### 1. 应用启动
- [ ] 应用可以正常启动
- [ ] 显示登录页面
- [ ] 没有崩溃或错误

### 2. 功能测试
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] 页面导航正常
- [ ] AI助手功能正常（需要配置API密钥）

### 3. 日志检查
- [ ] 打开 DevEco Studio 的 Log 窗口
- [ ] 检查是否有错误日志
- [ ] 检查是否有警告信息

## 常见编译错误及解决方案

### 错误1: "Cannot find module '@ohos/xxx'"
**原因**: SDK未正确安装或配置
**解决**: 
1. 检查 SDK 安装路径
2. 重新安装 SDK
3. 清理项目：`Build -> Clean Project`

### 错误2: "Resource not found"
**原因**: 资源文件路径错误或资源ID不存在
**解决**:
1. 检查 `string.json` 中的资源定义
2. 检查资源ID是否正确引用
3. 检查资源文件路径

### 错误3: "Type error: Property 'xxx' does not exist"
**原因**: 类型定义错误或导入错误
**解决**:
1. 检查类型定义
2. 检查导入语句
3. 检查API版本兼容性

### 错误4: "Database initialization failed"
**原因**: 数据库初始化代码有问题
**解决**:
1. 检查 `AppDatabase.ts` 中的初始化代码
2. 检查 Context 是否正确设置
3. 检查数据库表结构

### 错误5: "Network request failed"
**原因**: 网络权限或配置问题
**解决**:
1. 检查 `module.json5` 中的权限声明
2. 检查网络请求代码
3. 检查API配置

## 调试技巧

### 1. 使用日志
```typescript
console.info('Debug message');
console.error('Error message');
```

### 2. 使用断点
- 在代码行号左侧点击设置断点
- 运行调试模式
- 查看变量值

### 3. 查看设备日志
- 打开 DevEco Studio 的 Log 窗口
- 选择设备或模拟器
- 过滤日志关键字

### 4. 检查网络请求
- 使用网络抓包工具
- 检查请求头和请求体
- 检查响应数据

## 性能优化检查

### 1. 编译优化
- [ ] 启用代码混淆（Release版本）
- [ ] 优化资源文件大小
- [ ] 移除未使用的代码

### 2. 运行时优化
- [ ] 减少不必要的重新渲染
- [ ] 优化数据库查询
- [ ] 添加网络请求缓存

### 3. 内存优化
- [ ] 及时释放资源
- [ ] 避免内存泄漏
- [ ] 优化图片加载

## 发布前检查

### 1. 功能完整性
- [ ] 所有核心功能已实现
- [ ] 所有功能已测试
- [ ] 没有已知的严重bug

### 2. 代码质量
- [ ] 代码已通过lint检查
- [ ] 代码已格式化
- [ ] 注释完整

### 3. 配置检查
- [ ] 版本号已更新
- [ ] 应用名称正确
- [ ] 签名配置正确

### 4. 资源检查
- [ ] 应用图标已添加
- [ ] 所有字符串资源已本地化
- [ ] 图片资源已优化

## 编译成功标志

✅ **编译成功时应该看到**:
- Build窗口显示 "BUILD SUCCESSFUL"
- 输出目录中有 `.hap` 文件
- 文件大小合理（通常几MB到几十MB）
- 没有错误提示

❌ **编译失败时应该检查**:
- Build窗口的错误信息
- Log窗口的详细日志
- 代码中的语法错误
- 配置文件中的错误

## 获取帮助

如果编译遇到问题：
1. 查看 [BUILD.md](./BUILD.md) 获取详细说明
2. 查看 [QUICK_START.md](./QUICK_START.md) 了解快速开始
3. 查看 HarmonyOS 官方文档
4. 检查 DevEco Studio 的 Help 菜单
