import common from '@ohos.app.ability.common';

let contextInstance: common.UIAbilityContext | null = null;

/**
 * 设置全局Context
 */
export function setContext(context: common.UIAbilityContext): void {
  contextInstance = context;
}

/**
 * 获取全局Context
 */
export function getContext(): common.UIAbilityContext {
  if (!contextInstance) {
    throw new Error('Context not initialized. Please call setContext first.');
  }
  return contextInstance;
}
