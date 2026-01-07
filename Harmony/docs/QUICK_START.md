# 快速开始指南

## 项目状态

✅ **代码转换已完成**

所有Android代码已成功转换为鸿蒙代码，包括：
- ✅ 项目结构和配置文件
- ✅ 数据模型层（Model）
- ✅ 数据库层（RDB）
- ✅ 网络层（HTTP模块）
- ✅ 数据仓库层（Repository）
- ✅ UI层（ArkUI页面）
- ✅ 资源文件和字符串

## 立即开始

### 1. 环境准备

#### 安装 DevEco Studio
1. 访问 [华为开发者官网](https://developer.harmonyos.com/)
2. 下载并安装 DevEco Studio（推荐最新版本）
3. 启动 DevEco Studio 并完成初始化

#### 配置 HarmonyOS SDK
1. 打开 DevEco Studio
2. 进入 `File -> Settings -> Appearance & Behavior -> System Settings -> HarmonyOS SDK`
3. 确保已安装 **API 9** 版本的 SDK
4. 如果未安装，点击 `Install` 进行安装

### 2. 打开项目

1. 打开 DevEco Studio
2. 选择 `File -> Open`
3. 选择 `Harmony` 目录（不是 `Harmony/entry`）
4. 等待项目同步完成（首次可能需要几分钟）

### 3. 配置签名（用于真机调试）

1. 进入 `File -> Project Structure -> Project -> Signing Configs`
2. 点击 `+` 创建新的签名配置
3. 填写签名信息：
   - **Alias**: 填写别名（如：goodgoodstudy）
   - **Key Store File**: 选择或创建密钥库文件
   - **Key Store Password**: 设置密钥库密码
   - **Key Alias**: 填写密钥别名
   - **Key Password**: 设置密钥密码
4. 点击 `Apply` 和 `OK`

### 4. 编译项目

#### 方式一：使用 DevEco Studio
1. 点击菜单栏 `Build -> Build Hap(s)/APP(s) -> Build Hap(s)`
2. 等待编译完成
3. 编译产物位于：`entry/build/default/outputs/default/entry-default-signed.hap`

#### 方式二：使用命令行
```bash
# 进入项目目录
cd Harmony

# Windows
hvigorw.bat assembleHap

# Linux/Mac
./hvigorw assembleHap
```

### 5. 运行应用

#### 使用模拟器
1. 在 DevEco Studio 中点击 `Tools -> Device Manager`
2. 点击 `New Emulator` 创建模拟器（如果还没有）
3. 选择设备类型（Phone）和系统镜像（API 9）
4. 启动模拟器
5. 点击 `Run` 按钮运行应用

#### 使用真机
1. 在设备上启用开发者模式：
   - 进入 `设置 -> 关于手机`
   - 连续点击 `版本号` 7次
   - 返回 `设置 -> 系统和更新 -> 开发人员选项`
   - 启用 `USB调试`
2. 使用USB线连接设备到电脑
3. 在 DevEco Studio 中点击 `Run` 按钮
4. 选择连接的设备

## 功能测试

### 1. 用户注册/登录
- [ ] 打开应用，应该显示登录页面
- [ ] 输入用户名和密码，点击"注册"
- [ ] 注册成功后，点击"登录"
- [ ] 登录成功后，应该跳转到主页面

### 2. 主页面导航
- [ ] 底部导航栏应该显示4个标签：练习、进度、错题本、AI助手
- [ ] 点击不同标签可以切换页面

### 3. AI助手功能
- [ ] 进入AI助手页面
- [ ] 首次使用需要配置API密钥（进入设置页面）
- [ ] 输入Deepseek API密钥并保存
- [ ] 返回AI助手页面，输入问题并发送
- [ ] 应该能收到AI回复

### 4. 设置功能
- [ ] 进入设置页面（可以通过菜单或直接访问）
- [ ] 输入并保存API密钥
- [ ] 应该显示保存成功提示

## 常见问题

### Q1: 项目同步失败
**A**: 
- 检查网络连接
- 检查SDK是否正确安装
- 尝试 `File -> Invalidate Caches / Restart`

### Q2: 编译错误：找不到模块
**A**: 
- 确保已安装 HarmonyOS SDK
- 检查 `module.json5` 配置
- 重新同步项目

### Q3: 运行时错误：权限不足
**A**: 
- 检查 `module.json5` 中的权限声明
- 在设备上手动授予权限

### Q4: 数据库初始化失败
**A**: 
- 确保在 `EntryAbility.onCreate()` 中调用了 `setContext()`
- 检查数据库表结构是否正确

### Q5: 网络请求失败
**A**: 
- 检查网络权限是否已授予
- 检查API密钥是否正确配置
- 检查网络连接

## 下一步

1. **完善功能**
   - 实现题目数据的导入和管理
   - 完善答题功能
   - 实现错题本的完整功能
   - 添加学习进度统计

2. **优化体验**
   - 优化UI设计
   - 添加动画效果
   - 改善交互反馈

3. **性能优化**
   - 优化数据库查询
   - 添加网络请求缓存
   - 优化图片资源

## 参考文档

- [项目README](../README.md) - 项目总体说明
- [编译指南](./BUILD.md) - 详细的编译和调试说明
- [迁移总结](./MIGRATION_SUMMARY.md) - Android到鸿蒙的迁移详情

## 获取帮助

如果遇到问题：
1. 查看 [BUILD.md](./BUILD.md) 中的常见问题部分
2. 查看 [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) 了解技术细节
3. 查看 HarmonyOS 官方文档
