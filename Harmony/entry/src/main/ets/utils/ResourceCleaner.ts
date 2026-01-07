import { Logger } from './Logger';

/**
 * 资源清理工具类
 * 提供统一的资源清理机制，防止内存泄漏
 */
export class ResourceCleaner {
  private constructor() {
    // 工具类，禁止实例化
  }

  /**
   * 清理Map资源
   */
  static clearMap<K, V>(map: Map<K, V> | null | undefined): void {
    if (map) {
      try {
        map.clear();
      } catch (error) {
        Logger.warnWithTag('ResourceCleaner', 'Failed to clear Map', error as Error);
      }
    }
  }

  /**
   * 清理数组资源
   */
  static clearArray<T>(array: Array<T> | null | undefined): void {
    if (array) {
      try {
        array.length = 0;
      } catch (error) {
        Logger.warnWithTag('ResourceCleaner', 'Failed to clear Array', error as Error);
      }
    }
  }

  /**
   * 清理对象属性
   */
  static clearObjectProperties(obj: Record<string, any> | null | undefined): void {
    if (obj) {
      try {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            delete obj[key];
          }
        }
      } catch (error) {
        Logger.warnWithTag('ResourceCleaner', 'Failed to clear object properties', error as Error);
      }
    }
  }

  /**
   * 批量清理资源
   */
  static cleanup(...resources: Array<Map<any, any> | Array<any> | Record<string, any> | null | undefined>): void {
    for (const resource of resources) {
      if (resource instanceof Map) {
        this.clearMap(resource);
      } else if (Array.isArray(resource)) {
        this.clearArray(resource);
      } else if (typeof resource === 'object' && resource !== null) {
        this.clearObjectProperties(resource);
      }
    }
  }
}
