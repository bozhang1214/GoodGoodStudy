import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {encrypt} from '../utils/password';
import {isValidUsername, isValidPassword} from '../utils/validator';
import {
  findUserByUsername,
  insertUser,
  setCurrentUser,
  getCurrentUserId,
} from '../storage/store';

type Props = {
  onLoginSuccess: () => void;
};

type Mode = 'login' | 'register';

const LoginScreen: React.FC<Props> = ({onLoginSuccess}) => {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!isValidUsername(username)) {
      setError('用户名 3-20 位，仅字母数字下划线');
      return;
    }
    if (!isValidPassword(password)) {
      setError('密码至少 6 位');
      return;
    }
    if (mode === 'register' && !nickname.trim()) {
      setError('请输入昵称');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        const existing = await findUserByUsername(username);
        if (existing) {
          setError('用户名已存在');
          setLoading(false);
          return;
        }
        const id = await insertUser({
          username,
          password: encrypt(password),
          nickname: nickname.trim() || username,
          createTime: Date.now(),
        });
        await setCurrentUser(id, username);
        onLoginSuccess();
      } else {
        const user = await findUserByUsername(username);
        if (!user) {
          setError('用户不存在');
          setLoading(false);
          return;
        }
        const encrypted = encrypt(password);
        const match = encrypted === user.password;
        if (!match) {
          setError('密码错误');
          setLoading(false);
          return;
        }
        await setCurrentUser(user.id, user.username);
        onLoginSuccess();
      }
    } catch (e) {
      setError((e as Error).message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>好好学习</Text>
      <Text style={styles.subtitle}>{mode === 'login' ? '登录' : '注册'}</Text>

      <TextInput
        style={styles.input}
        placeholder="用户名（3-20 位字母数字下划线）"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="密码（至少 6 位）"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {mode === 'register' && (
        <TextInput
          style={styles.input}
          placeholder="昵称（选填）"
          value={nickname}
          onChangeText={setNickname}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{mode === 'login' ? '登录' : '注册'}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.switch} onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
        <Text style={styles.switchText}>
          {mode === 'login' ? '没有账号？去注册' : '已有账号？去登录'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  error: {
    color: '#c00',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switch: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: '#2196F3',
    fontSize: 14,
  },
});

export default LoginScreen;
