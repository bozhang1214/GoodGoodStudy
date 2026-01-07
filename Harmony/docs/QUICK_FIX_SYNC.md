# 快速修复项目同步问题

## 立即执行的步骤

### 1. 检查并创建必要文件

确保以下文件存在：

- ✅ `.hvigor/hvigor-config.json5` - 已创建
- ✅ `package.json` 包含构建依赖 - 已更新

### 2. 在 DevEco Studio 中执行

1. **清理缓存**:
   - `File -> Invalidate Caches / Restart`
   - 选择 `Invalidate and Restart`

2. **重新同步**:
   - 等待项目自动同步
   - 或手动触发：`File -> Sync Project with Gradle Files`（如果可用）

3. **检查 SDK**:
   - `File -> Settings -> Appearance & Behavior -> System Settings -> HarmonyOS SDK`
   - 确保已安装 API 9 SDK

### 3. 如果仍然失败

在项目根目录（Harmony）执行：

```bash
# Windows PowerShell
npm install

# 或使用命令行
cd Harmony
npm install
```

### 4. 验证配置

检查以下文件内容是否正确：

1. **`.hvigor/hvigor-config.json5`**:
   ```json5
   {
     "hvigorVersion": "4.0.2",
     "dependencies": {
       "@ohos/hvigor-ohos-plugin": "4.0.2",
       "@ohos/hvigor-ohos": "4.0.2"
     }
   }
   ```

2. **`package.json`** 应包含：
   ```json
   "devDependencies": {
     "@ohos/hvigor-ohos-plugin": "4.0.2",
     "@ohos/hvigor-ohos": "4.0.2"
   }
   ```

## 常见错误及快速解决

### 错误: "Cannot find module '@ohos/hvigor-ohos-plugin'"
**解决**: 运行 `npm install`

### 错误: "SDK not found"
**解决**: 在 DevEco Studio 中安装 API 9 SDK

### 错误: "Invalid JSON5 format"
**解决**: 检查所有 `.json5` 文件的语法

## 详细解决方案

如需更详细的解决方案，请查看：[SYNC_ISSUES.md](SYNC_ISSUES.md)
