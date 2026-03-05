## React & React Native

---

## 在本工程中的作用

- **React (`react`)**
  - 提供函数组件、Hooks（`useState` / `useEffect` / `useCallback` / `useRef`）等声明式 UI 能力。
  - 整个应用 UI（各个 Screen 与 `App.tsx`）均基于 React 函数组件编写。

- **React Native (`react-native`)**
  - 提供跨平台 UI 组件与原生桥接能力：
    - 视图组件：`View`, `Text`, `SafeAreaView`, `ScrollView`, `FlatList` 等。
    - 表单与交互：`TextInput`, `Button`, `TouchableOpacity`, `ActivityIndicator` 等。
    - 平台 API：`Platform`, `StyleSheet`, `NativeModules` 等。
  - 工程级功能：
    - Metro 打包（`npm start`/`react-native start`）。
    - Android/iOS 构建与安装（`react-native run-android`）。

---

## 配置方式与关键点

- 版本：
  - `react-native: 0.73.9`
  - `react: 18.2.0`
- Android 端：
  - 使用 AGP 8.x + Gradle 8.x。
  - 默认启用 Hermes 引擎与 New Architecture（`android/gradle.properties` 中 `newArchEnabled=true`）。
- 入口：
  - `index.tsx` 注册根组件 `App`。
  - `App.tsx` 作为单 Activity 应用的 JS 入口（Android 端由 `MainActivity` 加载）。

---

## 使用示例

```tsx
import React, {useState} from 'react';
import {SafeAreaView, View, Button, StyleSheet} from 'react-native';

function App() {
  const [tab, setTab] = useState<'practice'|'ai'>('practice');
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{/* 渲染各业务 Screen */}</View>
      <View style={styles.tabBar}>
        <Button title="练习" onPress={() => setTab('practice')} />
        <Button title="AI助手" onPress={() => setTab('ai')} />
      </View>
    </SafeAreaView>
  );
}
```

---

## 踩坑与最佳实践

- **Metro 必须先启动**：开发时请确保先运行 `npm start`，再运行 `npm run android` 或使用 `android:with-metro` 一键脚本，否则容易出现 “Unable to load script” 红屏。
- **Hermes 调试**：
  - 0.73 版本默认启用 Hermes，可通过 `global.HermesInternal` 判断。
  - 建议使用官方新调试器或 Chrome DevTools，而不是 Flipper（Flipper 已逐步淡出官方推荐）。
- **平台差异**：
  - 本项目目前仅面向 Android；如未来扩展 iOS，需要注意 `KeyboardAvoidingView`、文件路径、权限等平台差异。

