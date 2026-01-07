# HarmonyOS SDK 位置查找指南

## 查找结果

根据系统扫描，找到了以下 DevEco Studio 相关目录：

### DevEco Studio 配置目录
- **DevEco Studio 5.0**: `C:\Users\bozhang\AppData\Local\Huawei\DevEcoStudio5.0`
- **DevEco Studio 6.0**: `C:\Users\bozhang\AppData\Local\Huawei\DevEcoStudio6.0`

## SDK 常见位置

HarmonyOS SDK 通常安装在以下位置之一：

### 1. 默认位置（最常见）
```
C:\Users\<用户名>\AppData\Local\Huawei\Sdk
```

### 2. 用户自定义位置
- 可能在用户指定的其他目录
- 可以在 DevEco Studio 中查看：`File -> Settings -> Appearance & Behavior -> System Settings -> HarmonyOS SDK`

### 3. DevEco Studio 配置中
SDK 路径通常记录在 DevEco Studio 的配置文件中。

## 如何查找 SDK

### 方法 1: 在 DevEco Studio 中查看

1. 打开 DevEco Studio
2. 进入 `File -> Settings` (Windows) 或 `DevEco Studio -> Preferences` (Mac)
3. 导航到 `Appearance & Behavior -> System Settings -> HarmonyOS SDK`
4. 查看 "SDK Location" 字段，这里会显示 SDK 的安装路径

### 方法 2: 检查配置文件

SDK 路径可能记录在以下配置文件中：
- `C:\Users\<用户名>\AppData\Roaming\Huawei\DevEco Studio\config\options\sdk.xml`
- `C:\Users\<用户名>\.deveco\sdk\`

### 方法 3: 使用命令行查找

在 PowerShell 中执行：
```powershell
# 查找包含 "sdk" 的目录
Get-ChildItem -Path "C:\Users\$env:USERNAME" -Recurse -Filter "*sdk*" -Directory -ErrorAction SilentlyContinue -Depth 3 | Where-Object { $_.FullName -notlike "*node_modules*" }

# 查找包含 "harmony" 的目录
Get-ChildItem -Path "C:\Users\$env:USERNAME\AppData\Local" -Recurse -Filter "*harmony*" -Directory -ErrorAction SilentlyContinue -Depth 2
```

## SDK 目录结构

如果找到了 SDK，通常包含以下结构：
```
Sdk/
├── js/
├── native/
├── toolchains/
├── platforms/
│   └── ohos-9/          # API 9 SDK
│       ├── api/
│       ├── build-tools/
│       └── ...
└── ...
```

## 如果找不到 SDK

如果系统中没有找到 SDK，需要：

1. **在 DevEco Studio 中安装 SDK**:
   - 打开 DevEco Studio
   - `File -> Settings -> Appearance & Behavior -> System Settings -> HarmonyOS SDK`
   - 点击 "Download" 或 "Install" 安装所需的 SDK 版本

2. **检查网络连接**:
   - SDK 需要从华为服务器下载
   - 确保网络连接正常

3. **检查磁盘空间**:
   - SDK 安装需要足够的磁盘空间（通常几GB）

## 验证 SDK 安装

在 DevEco Studio 中：
1. `File -> Settings -> Appearance & Behavior -> System Settings -> HarmonyOS SDK`
2. 查看已安装的 SDK 版本列表
3. 确保已安装 **API 9** 版本的 SDK（项目需要）

## 设置 SDK 路径

如果 SDK 安装在非默认位置：

1. 在 DevEco Studio 中：
   - `File -> Settings -> Appearance & Behavior -> System Settings -> HarmonyOS SDK`
   - 点击 "Edit" 或 "Browse" 选择 SDK 路径
   - 点击 "Apply" 和 "OK"

2. 或者在项目配置中指定：
   - 某些项目可能需要在 `local.properties` 中指定 SDK 路径

## 注意事项

- SDK 路径不能包含中文字符
- SDK 路径不能包含空格（某些情况下）
- 确保对 SDK 目录有读写权限
- 如果移动了 SDK，需要在 DevEco Studio 中重新配置路径
