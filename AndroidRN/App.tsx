/**
 * 好好学习 - React Native
 * @format
 */

import React, {useState} from 'react';
import {SafeAreaView, View, Button, StyleSheet} from 'react-native';
import type {WrongQuestion} from './src/types';
import LoginScreen from './src/screens/LoginScreen';
import PracticeScreen from './src/screens/practice/PracticeScreen';
import PracticeDetailScreen from './src/screens/practice/PracticeDetailScreen';
import ProgressScreen from './src/screens/progress/ProgressScreen';
import WrongBookScreen from './src/screens/wrongbook/WrongBookScreen';
import AIAssistantScreen from './src/screens/aiassistant/AIAssistantScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';

type Tab = 'practice' | 'progress' | 'wrongBook' | 'ai' | 'settings';
type Screen = 'main' | 'practiceDetail' | 'practiceReview';

function App(): React.JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>('practice');
  const [screen, setScreen] = useState<Screen>('main');
  const [practiceSubjectId, setPracticeSubjectId] = useState(2);
  const [practiceGrade, setPracticeGrade] = useState(1);
  const [reviewWrongs, setReviewWrongs] = useState<WrongQuestion[] | null>(null);

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  if (screen === 'practiceDetail') {
    return (
      <PracticeDetailScreen
        subjectId={practiceSubjectId}
        grade={practiceGrade}
        wrongList={null}
        isReviewMode={false}
        onBack={() => setScreen('main')}
      />
    );
  }

  if (screen === 'practiceReview' && reviewWrongs && reviewWrongs.length > 0) {
    return (
      <PracticeDetailScreen
        subjectId={0}
        grade={0}
        wrongList={reviewWrongs}
        isReviewMode={true}
        onBack={() => setScreen('main')}
      />
    );
  }

  let content: React.ReactNode = null;
  switch (tab) {
    case 'practice':
      content = (
        <PracticeScreen
          onStartPractice={(subjectId, grade) => {
            setPracticeSubjectId(subjectId);
            setPracticeGrade(grade);
            setScreen('practiceDetail');
          }}
        />
      );
      break;
    case 'progress':
      content = <ProgressScreen />;
      break;
    case 'wrongBook':
      content = (
        <WrongBookScreen
          onReview={(wrongs) => {
            setReviewWrongs(wrongs);
            setScreen('practiceReview');
          }}
        />
      );
      break;
    case 'ai':
      content = <AIAssistantScreen activeTab={tab} />;
      break;
    case 'settings':
      content = <SettingsScreen />;
      break;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{content}</View>
      <View style={styles.tabBar}>
        <Button title="练习" onPress={() => setTab('practice')} />
        <Button title="进度" onPress={() => setTab('progress')} />
        <Button title="错题本" onPress={() => setTab('wrongBook')} />
        <Button title="AI助手" onPress={() => setTab('ai')} />
        <Button title="设置" onPress={() => setTab('settings')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
