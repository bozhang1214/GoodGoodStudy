# IDE中R类导入错误解决方案

## 问题描述

IDE提示`import com.edu.primary.R;`有错误，无法解析R类。

## 快速解决方案

### 方法1: Gradle同步（推荐）

**在Android Studio中：**
1. 点击菜单 `File` -> `Sync Project with Gradle Files`
2. 或者点击工具栏的"Sync Project with Gradle Files"按钮（🐘图标）
3. 等待同步完成

**使用命令行：**
```bash
cd Android
./gradlew clean build
```

### 方法2: 清理并重新构建

**在Android Studio中：**
1. 点击菜单 `Build` -> `Clean Project`
2. 等待清理完成
3. 点击菜单 `Build` -> `Rebuild Project`

**使用命令行：**
```bash
cd Android
./gradlew clean
./gradlew assembleDebug
```

### 方法3: 清理IDE缓存

**在Android Studio中：**
1. 点击菜单 `File` -> `Invalidate Caches / Restart...`
2. 选择 `Invalidate and Restart`
3. 等待IDE重启

### 方法4: 检查项目配置

确保以下配置正确：

1. **build.gradle** 中的 `applicationId`:
   ```gradle
   applicationId "com.edu.primary"
   ```

2. **AndroidManifest.xml** 中的 `package`:
   ```xml
   <manifest package="com.edu.primary">
   ```

3. **Java文件** 中的包名和导入:
   ```java
   package com.edu.primary.xxx;
   import com.edu.primary.R;
   ```

## 常见原因

1. **Gradle未同步** - 最常见原因，R类需要Gradle构建后才能生成
2. **资源文件错误** - XML资源文件有语法错误会导致R类无法生成
3. **IDE缓存问题** - IDE缓存了旧的R类信息
4. **构建失败** - 项目构建失败导致R类未生成

## 验证R类是否生成

R类通常生成在：
```
app/build/generated/source/r/debug/com/edu/primary/R.java
```

如果该文件不存在，说明构建未成功。

## 如果问题仍然存在

1. 检查Build输出窗口的错误信息
2. 确保所有资源文件没有语法错误
3. 确保包名配置一致
4. 尝试删除`.gradle`和`app/build`目录后重新构建
