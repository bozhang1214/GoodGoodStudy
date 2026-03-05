import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import type {ChatMessage} from '../../types';
import {getCurrentUserId} from '../../storage/store';
import {
  getChatHistory,
  appendChatMessage,
  clearChat,
  getAiModel,
} from '../../storage/store';
import {getReply, isTFLiteAvailable, isModelLoaded} from '../../ai/chatBackend';
import {MAX_HISTORY_MESSAGES, AI_MODEL_BASE, AI_MODEL_TFLITE, AI_MODEL_RULE, AI_MODEL_LLAMA} from '../../constants';

type MessageItem = {id: string; role: 'user' | 'assistant'; content: string};

const MODEL_LABELS: Record<string, string> = {
  [AI_MODEL_LLAMA]: 'Llama（端侧）',
  [AI_MODEL_BASE]: '基础大模型',
  [AI_MODEL_TFLITE]: 'TFLite 意图',
  [AI_MODEL_RULE]: '内置规则',
};

type Props = {activeTab?: string};

const AIAssistantScreen: React.FC<Props> = ({activeTab = 'ai'}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [aiModel, setAiModelState] = useState(AI_MODEL_BASE);
  const [tfliteModelLoaded, setTfliteModelLoaded] = useState<boolean | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const useTFLite = isTFLiteAvailable();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    getAiModel().then(setAiModelState);
  }, []);
  useEffect(() => {
    if (activeTab === 'ai') getAiModel().then(setAiModelState);
  }, [activeTab]);
  useEffect(() => {
    if (useTFLite) {
      isModelLoaded().then(setTfliteModelLoaded);
    }
  }, [useTFLite]);

  const loadHistory = useCallback(async () => {
    const userId = await getCurrentUserId();
    if (userId === -1) {
      setLoadingHistory(false);
      return;
    }
    const list = await getChatHistory(userId);
    const trimmed =
      list.length > MAX_HISTORY_MESSAGES
        ? list.slice(-MAX_HISTORY_MESSAGES)
        : list;
    setMessages(
      trimmed.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    );
    setLoadingHistory(false);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  }, [messages.length]);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > 120);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userId = await getCurrentUserId();
    if (userId === -1) return;

    setInput('');
    const userMsg: MessageItem = {
      id: 'u_' + Date.now(),
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    // #region agent log
    fetch('http://127.0.0.1:7745/ingest/378a1d76-d8f5-473b-9086-37b35f3ce3af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'609025'},body:JSON.stringify({sessionId:'609025',location:'AIAssistantScreen:handleSend',message:'send_start',data:{text,loading},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    try {
      const model = await getAiModel();
      setAiModelState(model);
      const timeoutMs = model === AI_MODEL_LLAMA ? 60000 : 12000;
      const replyPromise = (async () => {
        await appendChatMessage(userId, 'user', text);
        const history = await getChatHistory(userId);
        const historySize = history.length;
        // #region agent log
        fetch('http://127.0.0.1:7745/ingest/378a1d76-d8f5-473b-9086-37b35f3ce3af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'609025'},body:JSON.stringify({sessionId:'609025',location:'AIAssistantScreen:beforeGetReply',message:'before_getReply',data:{historySize,model},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        const recentMessages = messages.map((m) => ({role: m.role, content: m.content}));
        const reply = await getReply(text, historySize, model, recentMessages);
        // #region agent log
        fetch('http://127.0.0.1:7745/ingest/378a1d76-d8f5-473b-9086-37b35f3ce3af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'609025'},body:JSON.stringify({sessionId:'609025',location:'AIAssistantScreen:afterGetReply',message:'after_getReply',data:{replyLen:reply?.length},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        await appendChatMessage(userId, 'assistant', reply);
        return reply;
      })();
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), timeoutMs);
      });
      const reply = await Promise.race([replyPromise, timeoutPromise]);
      const assistantMsg: MessageItem = {
        id: 'a_' + Date.now(),
        role: 'assistant',
        content: reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7745/ingest/378a1d76-d8f5-473b-9086-37b35f3ce3af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'609025'},body:JSON.stringify({sessionId:'609025',location:'AIAssistantScreen:catch',message:'send_catch',data:{err: String(err)},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const fallbackMsg: MessageItem = {
        id: 'a_' + Date.now(),
        role: 'assistant',
        content: err instanceof Error && err.message === 'timeout' ? '回复超时，请重试。' : '回复出错，请重试。',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      // #region agent log
      fetch('http://127.0.0.1:7745/ingest/378a1d76-d8f5-473b-9086-37b35f3ce3af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'609025'},body:JSON.stringify({sessionId:'609025',location:'AIAssistantScreen:finally',message:'send_finally',data:{},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleClear = useCallback(async () => {
    const userId = await getCurrentUserId();
    if (userId === -1) return;
    await clearChat(userId);
    setMessages([]);
  }, []);

  if (loadingHistory) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.hint}>加载对话中…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>AI 小助手</Text>
          <Text style={styles.badge}>
            {MODEL_LABELS[aiModel] ?? aiModel}
            {(aiModel === AI_MODEL_TFLITE && useTFLite) && (
              tfliteModelLoaded === true ? ' · 已加载' : tfliteModelLoaded === false ? ' · 规则兜底' : ''
            )}
          </Text>
        </View>
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearText}>清空</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listWrapper}>
        <FlatList
          ref={flatListRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={messages}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          onScroll={handleScroll}
          scrollEventThrottle={100}
          onLayout={(e) => {
            const {width, height} = e.nativeEvent.layout;
            fetch('http://127.0.0.1:7745/ingest/378a1d76-d8f5-473b-9086-37b35f3ce3af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'609025'},body:JSON.stringify({sessionId:'609025',location:'AIAssistantScreen:FlatList_onLayout',message:'list_layout',data:{width,height,msgCount:messages.length},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
          }}
          renderItem={({item}) => (
            <View
              style={[
                styles.message,
                item.role === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          )}
          keyboardShouldPersistTaps="handled"
        />
        {showScrollToTop && (
          <TouchableOpacity
            style={styles.scrollToTopBtn}
            onPress={scrollToTop}
            activeOpacity={0.8}>
            <Text style={styles.scrollToTopText}>↑ 顶部</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footerHint}>
        <Text style={styles.footerHintText}>
          {aiModel === AI_MODEL_LLAMA
            ? '当前使用 Llama 端侧大模型；请在设置中配置 GGUF 模型路径。'
            : aiModel === AI_MODEL_BASE
            ? '默认使用基础大模型（端侧），支持简单对话。可在「设置」中切换大模型。'
            : aiModel === AI_MODEL_TFLITE
            ? '当前为 TFLite 意图识别+固定回复。可试试：你好、数学、谢谢等。'
            : '当前为内置规则回复。可在「设置」中切换大模型。'}
        </Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="对 AI 说点什么…"
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          editable={!loading}
          blurOnSubmit={false}
          keyboardType="default"
          autoCapitalize="sentences"
        />
        <TouchableOpacity
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendText}>发送</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    fontSize: 11,
    color: '#666',
    marginLeft: 8,
  },
  clearText: {
    color: '#2196F3',
    fontSize: 14,
  },
  listWrapper: {
    flex: 1,
    minHeight: 0,
  },
  list: {
    flex: 1,
    padding: 12,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  scrollToTopBtn: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: 'rgba(33, 150, 243, 0.92)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  scrollToTopText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  message: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: {
    fontSize: 15,
  },
  footerHint: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f9f9f9',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  footerHintText: {
    fontSize: 12,
    color: '#888',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 15,
  },
  sendBtn: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 44,
  },
  sendBtnDisabled: {
    opacity: 0.7,
  },
  sendText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AIAssistantScreen;
