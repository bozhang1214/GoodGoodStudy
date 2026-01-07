/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

/**
 * 日志工具类（统一日志管理）
 * 提供统一的日志记录接口，便于调试和错误追踪
 * 支持日志级别控制和结构化日志
 */
export class Logger {
  private static readonly TAG = 'GoodGoodStudy';
  // 当前日志级别，可以通过环境变量或配置控制
  private static currentLevel: LogLevel = LogLevel.DEBUG;
  // 是否启用调试日志
  private static readonly DEBUG = true; // HarmonyOS 中可以通过环境变量控制

  private constructor() {
    // 工具类，禁止实例化
  }

  /**
   * 设置日志级别
   */
  static setLogLevel(level: LogLevel): void {
    Logger.currentLevel = level;
  }

  /**
   * 获取当前日志级别
   */
  static getLogLevel(): LogLevel {
    return Logger.currentLevel;
  }

  /**
   * 检查是否应该记录指定级别的日志
   */
  private static shouldLog(level: LogLevel): boolean {
    return level >= Logger.currentLevel;
  }
  /**
   * 记录调试信息
   */
  static debug(message: string): void {
    if (Logger.DEBUG && Logger.shouldLog(LogLevel.DEBUG)) {
      console.debug(`[${Logger.TAG}] ${message}`);
    }
  }

  /**
   * 记录调试信息（带标签）
   */
  static debugWithTag(tag: string, message: string): void {
    if (Logger.DEBUG && Logger.shouldLog(LogLevel.DEBUG)) {
      console.debug(`[${Logger.TAG}][${tag}] ${message}`);
    }
  }

  /**
   * 记录结构化调试信息
   */
  static debugStructured(tag: string, data: Record<string, any>): void {
    if (Logger.DEBUG && Logger.shouldLog(LogLevel.DEBUG)) {
      const jsonData = JSON.stringify(data, null, 2);
      console.debug(`[${Logger.TAG}][${tag}] ${jsonData}`);
    }
  }

  /**
   * 记录信息
   */
  static info(message: string): void {
    if (Logger.shouldLog(LogLevel.INFO)) {
      console.info(`[${Logger.TAG}] ${message}`);
    }
  }

  /**
   * 记录信息（带标签）
   */
  static infoWithTag(tag: string, message: string): void {
    if (Logger.shouldLog(LogLevel.INFO)) {
      console.info(`[${Logger.TAG}][${tag}] ${message}`);
    }
  }

  /**
   * 记录警告
   */
  static warn(message: string): void {
    if (Logger.shouldLog(LogLevel.WARN)) {
      console.warn(`[${Logger.TAG}] ${message}`);
    }
  }
  /**
   * 记录警告（带标签）
   */
  static warnWithTag(tag: string, message: string): void;
  static warnWithTag(tag: string, message: string, error: Error): void;
  static warnWithTag(tag: string, message: string, error?: Error): void {
    if (Logger.shouldLog(LogLevel.WARN)) {
      if (error) {
        console.warn(`[${Logger.TAG}][${tag}] ${message}`, error);
      } else {
        console.warn(`[${Logger.TAG}][${tag}] ${message}`);
      }
    }
  }

  /**
   * 记录错误
   */
  static error(message: string): void {
    if (Logger.shouldLog(LogLevel.ERROR)) {
      console.error(`[${Logger.TAG}] ${message}`);
    }
  }
  /**
   * 记录错误（带标签和异常）
   */
  static errorWithTag(tag: string, message: string): void;
  static errorWithTag(tag: string, message: string, error: Error): void;
  static errorWithTag(tag: string, message: string, error?: Error): void {
    if (Logger.shouldLog(LogLevel.ERROR)) {
      if (error) {
        console.error(`[${Logger.TAG}][${tag}] ${message}`, error);
      } else {
        console.error(`[${Logger.TAG}][${tag}] ${message}`);
      }
    }
  }

  /**
   * 记录结构化错误信息
   */
  static errorStructured(tag: string, message: string, error?: Error, context?: Record<string, any>): void {
    if (Logger.shouldLog(LogLevel.ERROR)) {
      const errorInfo: Record<string, any> = {
        message: message,
        ...context
      };
      if (error) {
        errorInfo.error = {
          name: error.name,
          message: error.message,
          stack: error.stack
        };
      }
      const jsonData = JSON.stringify(errorInfo, null, 2);
      console.error(`[${Logger.TAG}][${tag}] ${jsonData}`);
    }
  }
}
