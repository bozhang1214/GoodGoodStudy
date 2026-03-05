import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Routes} from './Routes';
import LoginScreen from '../screens/LoginScreen';
import PracticeScreen from '../screens/practice/PracticeScreen';
import ProgressScreen from '../screens/progress/ProgressScreen';
import WrongBookScreen from '../screens/wrongbook/WrongBookScreen';
import AIAssistantScreen from '../screens/aiassistant/AIAssistantScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

export type RootStackParamList = {
  [Routes.LOGIN]: undefined;
  [Routes.MAIN_TABS]: undefined;
  [Routes.PRACTICE_DETAIL]: {subjectId: number; grade: number; wrongIds?: number[]};
  [Routes.PRACTICE_REVIEW]: {wrongIds: number[]};
  [Routes.SETTINGS]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Practice"
        component={PracticeScreen}
        options={{title: '练习'}}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{title: '进度'}}
      />
      <Tab.Screen
        name="WrongBook"
        component={WrongBookScreen}
        options={{title: '错题本'}}
      />
      <Tab.Screen
        name="AIAssistant"
        component={AIAssistantScreen}
        options={{title: 'AI助手'}}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{title: '设置'}}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  // TODO: 从持久化或后端恢复登录状态，这里先用 false 占位
  const isLoggedIn = false;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? Routes.MAIN_TABS : Routes.LOGIN}>
        <Stack.Screen
          name={Routes.LOGIN}
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Routes.MAIN_TABS}
          component={MainTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Routes.PRACTICE_DETAIL}
          component={PracticeScreen}
          options={{title: '练习详情'}}
        />
        <Stack.Screen
          name={Routes.SETTINGS}
          component={SettingsScreen}
          options={{title: '设置'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

