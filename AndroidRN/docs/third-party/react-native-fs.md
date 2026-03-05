## react-native-fs

---

## 在本工程中的作用

`react-native-fs` 提供对原生文件系统的访问，本项目中主要用于：

- 下载 GGUF 模型文件并保存到应用私有目录（`DocumentDirectoryPath/llm-models`）。
- 在设置页中展示“本地路径”，供 Llama 端侧推理模块使用。

---

## 配置方式

- 依赖：
  - `react-native-fs: ^2.20.0`
- Android：
  - 默认仅支持 `DocumentDirectoryPath`（内部存储 `/data/data/<包名>/files`），不依赖额外权限。
  - 若未来需要写入外部存储，需要额外申请权限并处理 Android 10+ 的 Scoped Storage。

---

## 使用示例（本工程）

```ts
import RNFS from 'react-native-fs';

const dir = `${RNFS.DocumentDirectoryPath}/llm-models`;
await RNFS.mkdir(dir);

const toFile = `${dir}/${fileName}`;
const {promise} = RNFS.downloadFile({
  fromUrl: meta.sourceUrl,
  toFile,
});
await promise;
```

配合 `AsyncStorage`，在 `storage/modelFiles.ts` 中维护 `<模型ID, 本地路径>` 的映射，供设置页与 `llamaChat` 使用。

---

## 踩坑点与建议

- **目录选择**：
  - 推荐优先使用 `DocumentDirectoryPath`，无需额外权限，也不会受外部存储策略影响。
- **大文件下载**：
  - GGUF 模型通常体积较大，下载时应考虑用户网络与存储空间。
  - 当前实现为最简版本，仅在下载失败时记录错误信息；正式产品可加入进度条与“继续下载”机制。
- **权限错误（EACCES）**：
  - 如强行写入外部存储路径，Android 10+ 可能报 Permission denied，需要遵循 Scoped Storage 规则或改用更适配的库。

