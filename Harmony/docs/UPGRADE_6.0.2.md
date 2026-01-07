# DevEco Studio 6.0.2 Beta1 升级指南

## 升级完成

项目已成功升级到 DevEco Studio 6.0.2 Beta1 兼容格式。

## 主要变更

### 1. hvigor 配置更新

**变更前** (`.hvigor/hvigor-config.json5`):
```json5
{
  "hvigorVersion": "4.0.2",
  "dependencies": {
    "@ohos/hvigor-ohos-plugin": "4.0.2",
    "@ohos/hvigor-ohos": "4.0.2"
  }
}
```

**变更后** (`hvigor/hvigor-config.json5`):
```json5
{
  "modelVersion": "6.0.2",
  "dependencies": {},
  "execution": { ... },
  "logging": { ... },
  "debugging": { ... },
  "nodeOptions": { ... }
}
```

**关键变化**:
- 目录从 `.hvigor/` 改为 `hvigor/`
- `hvigorVersion` 改为 `modelVersion: "6.0.2"`
- 移除了依赖配置（由构建系统自动管理）
- 添加了 execution、logging、debugging、nodeOptions 配置

### 2. build-profile.json5 更新

**根目录 build-profile.json5**:
- 添加了 `app.products` 配置
- 添加了 `app.buildModeSet` 配置
- 更新了 `modules` 配置，添加 `targets` 和 `applyToProducts`

**entry/build-profile.json5**:
- 添加了 `buildOptionSet` 配置
- 添加了 `resOptions` 配置
- 添加了 `obfuscation` 配置（release 模式）
- 添加了 `ohosTest` target

### 3. hvigorfile.ts 格式更新

**变更前**:
```typescript
export { hapTasks } from '@ohos/hvigor-ohos-plugin';
```

**变更后**:
```typescript
import { hapTasks } from '@ohos/hvigor-ohos-plugin';

export default {
  system: hapTasks,
  plugins: []
}
```

### 4. 新增文件

- `oh-package.json5` (根目录) - 项目依赖管理
- `entry/oh-package.json5` - 模块依赖管理
- `local.properties` - 本地配置（IDE 自动生成）
- `code-linter.json5` - 代码检查配置

### 5. AppScope/app.json5 更新

- 将 `version` 对象改为 `versionCode` 和 `versionName`
- 添加了 `icon` 和 `label` 配置
- 保留了 `apiVersion` 配置（兼容性）

## 验证升级

### 1. 检查配置文件

确保以下文件存在且格式正确：
- ✅ `hvigor/hvigor-config.json5`
- ✅ `build-profile.json5`
- ✅ `entry/build-profile.json5`
- ✅ `hvigorfile.ts` (根目录和 entry)
- ✅ `oh-package.json5` (根目录和 entry)
- ✅ `local.properties`
- ✅ `code-linter.json5`

### 2. 重新同步项目

1. 关闭 DevEco Studio
2. 重新打开 DevEco Studio
3. `File -> Open`，选择 `Harmony` 目录
4. 等待项目同步完成

### 3. 验证构建

```bash
# 在项目根目录执行
cd Harmony
hvigorw assembleHap
```

## 可能遇到的问题

### 问题 1: 仍然显示同步失败

**解决方案**:
1. 清理缓存：`File -> Invalidate Caches / Restart`
2. 删除 `oh_modules/` 目录（如果存在）
3. 重新同步项目

### 问题 2: 找不到 hvigor 工具

**解决方案**:
1. 确保已安装 Node.js
2. 在项目根目录执行：`npm install`
3. 或让 IDE 自动下载构建工具

### 问题 3: SDK 版本不匹配

**解决方案**:
1. 在 DevEco Studio 中安装 SDK 6.0.2(22)
2. 或修改 `build-profile.json5` 中的 `targetSdkVersion` 为已安装的版本

## 回退方案

如果升级后出现问题，可以：

1. 从版本控制系统恢复旧配置
2. 或手动恢复以下文件：
   - `build-profile.json5`
   - `entry/build-profile.json5`
   - `hvigorfile.ts`
   - `AppScope/app.json5`

## 后续步骤

1. **测试编译**: 确保项目可以正常编译
2. **测试运行**: 在模拟器或真机上测试应用
3. **更新依赖**: 根据需要更新 `oh-package.json5` 中的依赖
4. **配置签名**: 在 IDE 中配置应用签名（用于真机调试）

## 参考

- [DevEco Studio 6.0.2 更新日志](https://developer.harmonyos.com/)
- [项目同步问题解决方案](./SYNC_ISSUES.md)
- [IDE 错误解决方案](./IDE_ERRORS.md)
