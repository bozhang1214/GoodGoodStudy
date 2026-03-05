export const Routes = {
  LOGIN: 'Login',
  MAIN_TABS: 'MainTabs',
  PRACTICE_DETAIL: 'PracticeDetail',
  PRACTICE_REVIEW: 'PracticeReview',
  SETTINGS: 'Settings',
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];

