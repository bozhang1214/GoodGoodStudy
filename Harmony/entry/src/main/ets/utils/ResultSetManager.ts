import relationalStore from '@ohos.data.relationalStore';
import { Logger } from './Logger';

/**
 * ResultSet资源管理器
 * 确保ResultSet在使用后正确关闭，避免资源泄漏
 */
export class ResultSetManager {
  private constructor() {
    // 工具类，禁止实例化
  }

  /**
   * 安全执行查询操作，自动管理ResultSet生命周期
   * @param resultSet ResultSet对象
   * @param callback 处理ResultSet的回调函数
   * @returns 回调函数的返回值
   */
  static async executeQuery<T>(
    resultSet: relationalStore.RdbPredicates | null,
    callback: (resultSet: relationalStore.ResultSet) => T | Promise<T>
  ): Promise<T> {
    let rdbResultSet: relationalStore.ResultSet | null = null;
    try {
      // 这里需要传入rdbStore来执行查询
      // 由于API限制，这个方法需要调用者传入已查询的ResultSet
      throw new Error('This method requires refactoring to work with RdbStore');
    } catch (error) {
      Logger.errorWithTag('ResultSetManager', 'Query execution failed', error as Error);
      throw error;
    } finally {
      if (rdbResultSet) {
        try {
          rdbResultSet.close();
        } catch (error) {
          Logger.warnWithTag('ResultSetManager', 'Failed to close ResultSet', error as Error);
        }
      }
    }
  }

  /**
   * 安全关闭ResultSet
   * @param resultSet ResultSet对象
   */
  static safeClose(resultSet: relationalStore.ResultSet | null): void {
    if (resultSet) {
      try {
        resultSet.close();
      } catch (error) {
        Logger.warnWithTag('ResultSetManager', 'Failed to close ResultSet', error as Error);
      }
    }
  }
}
