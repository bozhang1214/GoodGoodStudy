# Harmony vs Harmony2 项目构建文件对比分析

## 问题根源分析

通过对比 Harmony 和 Harmony2 的构建文件，发现了导致 "project sync failed" 的根本原因。

## 关键差异对比

### 1. hvigor 配置系统

#### Harmony (修复前) ❌
```
.hvigor/
  └── hvigor-config.json5
    - hvigorVersion: "4.0.2"
    - dependencies: { "@ohos/hvigor-ohos-plugin": "4.0.2", ... }
```

#### Harmony2 (参考) ✅
```
hvigor/
  └── hvigor-config.json5
    - modelVersion: "6.0.2"
    - dependencies: {}
    - execution: { ... }
    - logging: { ... }
    - debugging: { ... }
    - nodeOptions: { ... }
```

**问题**: 
- 目录名称错误（`.hvigor/` vs `hvigor/`）
- 配置格式过时（hvigorVersion vs modelVersion）
- 缺少 6.0.2 必需的配置项

**修复**: ✅ 已更新为 6.0.2 格式

### 2. build-profile.json5 (根目录)

#### Harmony (修复前) ❌
```json5
{
  "apiType": "stageMode",
  "buildOption": {},
  "modules": [
    {
      "name": "entry",
      "srcPath": "./entry"
    }
  ]
}
```

#### Harmony2 (参考) ✅
```json5
{
  "app": {
    "signingConfigs": [],
    "products": [
      {
        "name": "default",
        "targetSdkVersion": "6.0.2(22)",
        "compatibleSdkVersion": "6.0.2(22)",
        ...
      }
    ],
    "buildModeSet": [...]
  },
  "modules": [
    {
      "name": "entry",
      "srcPath": "./entry",
      "targets": [...]
    }
  ]
}
```

**问题**: 
- 缺少 `app.products` 配置（必需）
- 缺少 `app.buildModeSet` 配置
- `modules` 配置不完整（缺少 `targets`）

**修复**: ✅ 已添加完整的 6.0.2 配置

### 3. entry/build-profile.json5

#### Harmony (修复前) ❌
```json5
{
  "apiType": "stageMode",
  "buildOption": {
    "arkOptions": {
      "runtimeOnly": false
    }
  },
  "targets": [
    {
      "name": "default",
      "runtimeOS": "HarmonyOS"
    }
  ]
}
```

#### Harmony2 (参考) ✅
```json5
{
  "apiType": "stageMode",
  "buildOption": {
    "resOptions": {
      "copyCodeResource": {
        "enable": false
      }
    }
  },
  "buildOptionSet": [
    {
      "name": "release",
      "arkOptions": {
        "obfuscation": { ... }
      }
    }
  ],
  "targets": [
    { "name": "default" },
    { "name": "ohosTest" }
  ]
}
```

**问题**: 
- 缺少 `buildOptionSet` 配置
- 缺少 `resOptions` 配置
- 缺少 `ohosTest` target

**修复**: ✅ 已添加完整配置

### 4. hvigorfile.ts

#### Harmony (修复前) ❌
```typescript
export { hapTasks } from '@ohos/hvigor-ohos-plugin';
```

#### Harmony2 (参考) ✅
```typescript
import { hapTasks } from '@ohos/hvigor-ohos-plugin';

export default {
  system: hapTasks,
  plugins: []
}
```

**问题**: 使用过时的导出格式

**修复**: ✅ 已更新为新格式

### 5. 缺失的关键文件

#### Harmony (修复前) ❌
- ❌ `oh-package.json5` (根目录)
- ❌ `entry/oh-package.json5`
- ❌ `local.properties`
- ❌ `code-linter.json5`

#### Harmony2 (参考) ✅
- ✅ 所有文件都存在

**问题**: DevEco Studio 6.0.2 需要这些文件进行项目管理

**修复**: ✅ 已创建所有缺失文件

### 6. AppScope/app.json5

#### Harmony (修复前) ❌
```json5
{
  "app": {
    "version": {
      "code": 1,
      "name": "1.0.0"
    },
    ...
  }
}
```

#### Harmony2 (参考) ✅
```json5
{
  "app": {
    "versionCode": 1000000,
    "versionName": "1.0.0",
    "icon": "$media:layered_image",
    "label": "$string:app_name"
  }
}
```

**问题**: 版本号格式过时，缺少 icon 和 label

**修复**: ✅ 已更新格式并添加 icon/label

## 同步失败的根本原因

### 主要原因

1. **hvigor 配置不兼容** (最关键)
   - 目录位置错误（`.hvigor/` 应该是 `hvigor/`）
   - 配置格式过时（hvigorVersion 4.0.2 vs modelVersion 6.0.2）
   - IDE 无法识别旧的配置格式

2. **build-profile.json5 配置不完整**
   - 缺少 `app.products` 配置（6.0.2 必需）
   - 缺少 `app.buildModeSet` 配置
   - 模块配置不完整

3. **缺失必需文件**
   - `oh-package.json5` 用于依赖管理
   - `local.properties` 用于本地配置
   - `code-linter.json5` 用于代码检查

4. **hvigorfile.ts 格式过时**
   - 旧格式不被 6.0.2 识别

## 修复验证

### 修复后的配置结构

```
Harmony/
├── hvigor/                    ✅ (已从 .hvigor/ 重命名)
│   └── hvigor-config.json5    ✅ (6.0.2 格式)
├── build-profile.json5        ✅ (包含 products/buildModeSet)
├── entry/
│   ├── build-profile.json5    ✅ (包含 buildOptionSet)
│   ├── hvigorfile.ts          ✅ (新格式)
│   └── oh-package.json5       ✅ (新创建)
├── hvigorfile.ts              ✅ (新格式)
├── oh-package.json5           ✅ (新创建)
├── local.properties            ✅ (新创建)
└── code-linter.json5          ✅ (新创建)
```

## 对比总结

| 配置项 | Harmony (修复前) | Harmony2 | Harmony (修复后) | 状态 |
|--------|-----------------|-----------|----------------|------|
| hvigor 目录 | `.hvigor/` | `hvigor/` | `hvigor/` | ✅ |
| hvigor 配置格式 | 4.0.2 旧格式 | 6.0.2 新格式 | 6.0.2 新格式 | ✅ |
| build-profile (根) | 简单配置 | 完整配置 | 完整配置 | ✅ |
| entry/build-profile | 基本配置 | 完整配置 | 完整配置 | ✅ |
| hvigorfile.ts | 旧格式 | 新格式 | 新格式 | ✅ |
| oh-package.json5 | ❌ 缺失 | ✅ 存在 | ✅ 存在 | ✅ |
| local.properties | ❌ 缺失 | ✅ 存在 | ✅ 存在 | ✅ |
| code-linter.json5 | ❌ 缺失 | ✅ 存在 | ✅ 存在 | ✅ |
| app.json5 | 旧格式 | 新格式 | 新格式 | ✅ |

## 结论

**同步失败的主要原因**:
1. hvigor 配置系统不兼容（目录位置和格式）
2. build-profile.json5 配置不完整（缺少必需字段）
3. 缺失 DevEco Studio 6.0.2 必需的文件

**修复效果**:
- ✅ 所有配置文件已更新为 6.0.2 格式
- ✅ 所有必需文件已创建
- ✅ 配置结构与 Harmony2 一致
- ✅ 项目应该可以在 DevEco Studio 6.0.2 中正常同步

## 下一步

1. 在 DevEco Studio 6.0.2 中重新打开项目
2. 等待项目同步完成
3. 如果仍有问题，参考 [SYNC_ISSUES.md](./SYNC_ISSUES.md) 进行排查
