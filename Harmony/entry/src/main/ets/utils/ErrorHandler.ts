import { AppConstants } from '../constants/AppConstants';
import { Logger } from './Logger';

/**
 * 统一错误处理类
 * 提供统一的错误处理和转换机制
 */
export class ErrorHandler {
  private constructor() {
    // 工具类，禁止实例化
  }

  /**
   * 处理数据库错误
   */
  static handleDatabaseError(error: unknown, operation: string): Error {
    if (error instanceof Error) {
      const errorMessage = error.message || String(error);
      
      // 处理唯一约束错误
      if (errorMessage.includes('UNIQUE') || errorMessage.includes('unique')) {
        Logger.warnWithTag('ErrorHandler', `Unique constraint violation in ${operation}`);
        return new Error(AppConstants.ERROR_USERNAME_EXISTS);
      }
      
      // 处理其他数据库错误
      Logger.errorWithTag('ErrorHandler', `Database error in ${operation}`, error);
      return new Error(`数据库操作失败: ${errorMessage}`);
    }
    
    Logger.errorWithTag('ErrorHandler', `Unknown error in ${operation}`, new Error(String(error)));
    return new Error(`操作失败: ${String(error)}`);
  }

  /**
   * 处理网络错误
   */
  static handleNetworkError(error: unknown, operation: string): Error {
    if (error instanceof Error) {
      const errorMessage = error.message || String(error);
      
      // 处理超时错误
      if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
        Logger.warnWithTag('ErrorHandler', `Network timeout in ${operation}`);
        return new Error('网络请求超时，请检查网络连接');
      }
      
      // 处理连接错误
      if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('network')) {
        Logger.warnWithTag('ErrorHandler', `Network connection error in ${operation}`);
        return new Error('网络连接失败，请检查网络设置');
      }
      
      Logger.errorWithTag('ErrorHandler', `Network error in ${operation}`, error);
      return new Error(`网络请求失败: ${errorMessage}`);
    }
    
    Logger.errorWithTag('ErrorHandler', `Unknown network error in ${operation}`, new Error(String(error)));
    return new Error(`网络请求失败: ${String(error)}`);
  }

  /**
   * 处理业务逻辑错误
   */
  static handleBusinessError(error: unknown, operation: string): Error {
    if (error instanceof Error) {
      // 如果是已知的业务错误，直接返回
      if (error.message === AppConstants.ERROR_USERNAME_EXISTS ||
          error.message === AppConstants.ERROR_USER_NOT_FOUND ||
          error.message === AppConstants.ERROR_PASSWORD_WRONG) {
        return error;
      }
      
      Logger.errorWithTag('ErrorHandler', `Business error in ${operation}`, error);
      return new Error(`操作失败: ${error.message}`);
    }
    
    Logger.errorWithTag('ErrorHandler', `Unknown business error in ${operation}`, new Error(String(error)));
    return new Error(`操作失败: ${String(error)}`);
  }

  /**
   * 统一错误处理入口
   */
  static handleError(error: unknown, operation: string, errorType: 'database' | 'network' | 'business' = 'business'): Error {
    switch (errorType) {
      case 'database':
        return this.handleDatabaseError(error, operation);
      case 'network':
        return this.handleNetworkError(error, operation);
      case 'business':
      default:
        return this.handleBusinessError(error, operation);
    }
  }
}
