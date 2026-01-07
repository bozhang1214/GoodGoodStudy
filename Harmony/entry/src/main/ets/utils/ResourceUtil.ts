import { getContext } from './ContextUtil';

/**
 * 获取字符串资源
 */
export function getString(resourceId: string): string {
  const context = getContext();
  const resourceManager = context.resourceManager;
  try {
    // 使用 getStringByName 方法获取资源
    return resourceManager.getStringByNameSync(resourceId);
  } catch (error) {
    // 如果找不到资源，返回资源ID作为后备
    console.warn(`Resource not found: ${resourceId}, using fallback`);
    return resourceId;
  }
}
