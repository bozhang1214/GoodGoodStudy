/**
 * 日志工具类（统一日志管理）
 * 提供统一的日志记录接口，便于调试和错误追踪
 */
export class Logger {
    private static readonly TAG = 'GoodGoodStudy';
    // 开发模式下启用调试日志
    private static readonly DEBUG = true; // HarmonyOS 中可以通过环境变量控制
    private constructor() {
        // 工具类，禁止实例化
    }
    /**
     * 记录调试信息
     */
    static debug(message: string): void {
        if (Logger.DEBUG) {
            console.debug(`[${Logger.TAG}] ${message}`);
        }
    }
    /**
     * 记录调试信息（带标签）
     */
    static debugWithTag(tag: string, message: string): void {
        if (Logger.DEBUG) {
            console.debug(`[${Logger.TAG}][${tag}] ${message}`);
        }
    }
    /**
     * 记录信息
     */
    static info(message: string): void {
        console.info(`[${Logger.TAG}] ${message}`);
    }
    /**
     * 记录信息（带标签）
     */
    static infoWithTag(tag: string, message: string): void {
        console.info(`[${Logger.TAG}][${tag}] ${message}`);
    }
    /**
     * 记录警告
     */
    static warn(message: string): void {
        console.warn(`[${Logger.TAG}] ${message}`);
    }
    /**
     * 记录警告（带标签）
     */
    static warnWithTag(tag: string, message: string): void {
        console.warn(`[${Logger.TAG}][${tag}] ${message}`);
    }
    /**
     * 记录错误
     */
    static error(message: string): void {
        console.error(`[${Logger.TAG}] ${message}`);
    }
    /**
     * 记录错误（带标签和异常）
     */
    static errorWithTag(tag: string, message: string, error?: Error): void {
        if (error) {
            console.error(`[${Logger.TAG}][${tag}] ${message}`, error);
        }
        else {
            console.error(`[${Logger.TAG}][${tag}] ${message}`);
        }
    }
}
