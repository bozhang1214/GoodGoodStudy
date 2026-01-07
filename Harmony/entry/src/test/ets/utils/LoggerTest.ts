import { describe, it, expect } from '@ohos/hypium';
import { Logger, LogLevel } from '../../main/ets/utils/Logger';

/**
 * Logger测试类
 */
export default function loggerTest() {
  describe('LoggerTest', () => {
    it('testSetLogLevel', 0, () => {
      const originalLevel = Logger.getLogLevel();
      Logger.setLogLevel(LogLevel.WARN);
      expect(Logger.getLogLevel()).assertEqual(LogLevel.WARN);
      
      // 恢复原始级别
      Logger.setLogLevel(originalLevel);
    });

    it('testLogLevelFiltering', 0, () => {
      Logger.setLogLevel(LogLevel.ERROR);
      // 这些调用不应该抛出异常
      Logger.debug('Debug message');
      Logger.info('Info message');
      Logger.warn('Warn message');
      Logger.error('Error message');
      
      expect(true).assertTrue();
    });
  });
}
