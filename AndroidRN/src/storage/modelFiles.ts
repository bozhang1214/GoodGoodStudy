import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {LLM_MODELS, type LLMModelMeta} from '../ai/modelCatalog';

const KEY_LLM_FILES = 'llm_files';

export type ModelDownloadStatus = 'not_downloaded' | 'downloading' | 'ready' | 'error';

export interface ModelFileInfo extends LLMModelMeta {
  localPath: string;
  status: ModelDownloadStatus;
  error?: string;
}

type PersistedMap = Record<
  string,
  {
    localPath: string;
  }
>;

async function loadPersisted(): Promise<PersistedMap> {
  try {
    const raw = await AsyncStorage.getItem(KEY_LLM_FILES);
    return raw ? (JSON.parse(raw) as PersistedMap) : {};
  } catch {
    return {};
  }
}

async function savePersisted(map: PersistedMap): Promise<void> {
  await AsyncStorage.setItem(KEY_LLM_FILES, JSON.stringify(map));
}

export async function listLLMModels(): Promise<ModelFileInfo[]> {
  const map = await loadPersisted();
  return LLM_MODELS.map((meta) => {
    const record = map[meta.id];
    const localPath = record?.localPath ?? '';
    return {
      ...meta,
      localPath,
      status: localPath ? 'ready' : 'not_downloaded',
    };
  });
}

export async function downloadLLMModel(id: string): Promise<ModelFileInfo> {
  const meta = LLM_MODELS.find((m) => m.id === id);
  if (!meta) {
    throw new Error('模型不存在');
  }
  const fileName = meta.sourceUrl.split('/').pop() || `${meta.id}.gguf`;
  const dir = `${RNFS.DocumentDirectoryPath}/llm-models`;
  await RNFS.mkdir(dir);
  const toFile = `${dir}/${fileName}`;
  try {
    const {promise} = RNFS.downloadFile({
      fromUrl: meta.sourceUrl,
      toFile,
    });
    await promise;
    const map = await loadPersisted();
    map[id] = {localPath: toFile};
    await savePersisted(map);
    return {
      ...meta,
      localPath: toFile,
      status: 'ready',
    };
  } catch (e) {
    return {
      ...meta,
      localPath: '',
      status: 'error',
      error: String(e),
    };
  }
}

