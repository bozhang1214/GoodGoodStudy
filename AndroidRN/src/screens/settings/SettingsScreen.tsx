import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {getApiKey, setApiKey, getAiModel, setAiModel, getLlamaModelPath, setLlamaModelPath} from '../../storage/store';
import {listLLMModels, downloadLLMModel, type ModelFileInfo} from '../../storage/modelFiles';
import {AI_MODEL_BASE, AI_MODEL_TFLITE, AI_MODEL_RULE, AI_MODEL_LLAMA} from '../../constants';

const MODEL_OPTIONS: {value: string; label: string}[] = [
  {value: AI_MODEL_LLAMA, label: 'Llama（端侧）'},
  {value: AI_MODEL_BASE, label: '基础大模型（端侧）'},
  {value: AI_MODEL_TFLITE, label: 'TFLite 意图'},
  {value: AI_MODEL_RULE, label: '内置规则'},
];

const SettingsScreen: React.FC = () => {
  const [apiKey, setApiKeyLocal] = useState('');
  const [saved, setSaved] = useState(false);
  const [aiModel, setAiModelLocal] = useState(AI_MODEL_BASE);
  const [llamaPath, setLlamaPathLocal] = useState('');
  const [models, setModels] = useState<ModelFileInfo[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    getApiKey().then(setApiKeyLocal);
    getAiModel().then(setAiModelLocal);
    getLlamaModelPath().then(setLlamaPathLocal);
    listLLMModels().then(setModels);
  }, []);

  const handleSave = useCallback(async () => {
    await setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [apiKey]);

  const handleSelectModel = useCallback(async (value: string) => {
    setAiModelLocal(value);
    await setAiModel(value);
  }, []);

  const handleSaveLlamaPath = useCallback(async () => {
    await setLlamaModelPath(llamaPath);
  }, [llamaPath]);

  const handleDownloadModel = useCallback(async (id: string) => {
    setDownloadingId(id);
    const info = await downloadLLMModel(id);
    const next = await listLLMModels();
    setModels(next);
    setDownloadingId(null);
    if (info.status === 'ready' && info.localPath) {
      setLlamaPathLocal(info.localPath);
      await setLlamaModelPath(info.localPath);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>设置</Text>

      <Text style={styles.sectionTitle}>AI 大模型</Text>
      <View style={styles.modelRow}>
        {MODEL_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.modelOption, aiModel === opt.value && styles.modelOptionActive]}
            onPress={() => handleSelectModel(opt.value)}>
            <Text style={[styles.modelOptionText, aiModel === opt.value && styles.modelOptionTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.hint}>AI 助手将使用所选模型回复；选 Llama 时需配置下方 GGUF 模型路径。</Text>

      {aiModel === AI_MODEL_LLAMA && (
        <>
          <Text style={[styles.label, styles.labelTop]}>Llama 模型路径（GGUF 文件）</Text>
          <TextInput
            style={styles.input}
            value={llamaPath}
            onChangeText={setLlamaPathLocal}
            placeholder="file:///data/user/0/.../files/model.gguf 或绝对路径"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.buttonSmall} onPress={handleSaveLlamaPath}>
            <Text style={styles.buttonText}>保存路径</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>预置模型（HuggingFace 下载）</Text>
          {models.map((m) => (
            <View key={m.id} style={styles.modelItem}>
              <View style={styles.modelInfo}>
                <Text style={styles.modelName}>{m.name}</Text>
                <Text style={styles.modelMeta}>{m.sizeHint} · {m.family.toUpperCase()}</Text>
                <Text style={styles.modelMeta}>
                  {m.status === 'ready' ? '已下载' : m.status === 'downloading' ? '下载中…' : '未下载'}
                </Text>
              </View>
              <View style={styles.modelActions}>
                {m.status !== 'ready' ? (
                  <TouchableOpacity
                    style={[styles.buttonTiny, downloadingId === m.id && styles.buttonDisabled]}
                    disabled={downloadingId === m.id}
                    onPress={() => handleDownloadModel(m.id)}>
                    <Text style={styles.buttonTextTiny}>
                      {downloadingId === m.id ? '下载中…' : '下载'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.buttonTiny}
                    onPress={async () => {
                      setLlamaPathLocal(m.localPath);
                      await setLlamaModelPath(m.localPath);
                    }}>
                    <Text style={styles.buttonTextTiny}>设为当前</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </>
      )}

      <Text style={[styles.label, styles.labelTop]}>Deepseek API 密钥（可选）</Text>
      <TextInput
        style={styles.input}
        value={apiKey}
        onChangeText={setApiKeyLocal}
        placeholder="用于后续扩展云端 AI"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>保存</Text>
      </TouchableOpacity>
      {saved && <Text style={styles.saved}>已保存</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  modelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  modelOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    marginRight: 8,
    marginBottom: 8,
  },
  modelOptionActive: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  modelOptionText: {
    fontSize: 14,
    color: '#666',
  },
  modelOptionTextActive: {
    color: '#1976D2',
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  labelTop: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSmall: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saved: {
    marginTop: 12,
    fontSize: 14,
    color: '#2196F3',
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 14,
    fontWeight: '600',
  },
  modelMeta: {
    fontSize: 12,
    color: '#888',
  },
  modelActions: {
    marginLeft: 8,
  },
  buttonTiny: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonTextTiny: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SettingsScreen;
