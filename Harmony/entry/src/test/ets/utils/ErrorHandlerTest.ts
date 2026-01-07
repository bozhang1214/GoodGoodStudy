import { describe, it, expect } from '@ohos/hypium';
import { ErrorHandler } from '../../main/ets/utils/ErrorHandler';
import { AppConstants } from '../../main/ets/constants/AppConstants';

/**
 * ErrorHandler测试类
 */
export default function errorHandlerTest() {
  describe('ErrorHandlerTest', () => {
    it('testHandleDatabaseError_UniqueConstraint', 0, () => {
      const error = new Error('UNIQUE constraint failed');
      const result = ErrorHandler.handleDatabaseError(error, 'test operation');
      expect(result.message).assertEqual(AppConstants.ERROR_USERNAME_EXISTS);
    });

    it('testHandleNetworkError_Timeout', 0, () => {
      const error = new Error('Request timeout');
      const result = ErrorHandler.handleNetworkError(error, 'test operation');
      expect(result.message).assertContain('超时');
    });

    it('testHandleBusinessError_KnownError', 0, () => {
      const error = new Error(AppConstants.ERROR_USER_NOT_FOUND);
      const result = ErrorHandler.handleBusinessError(error, 'test operation');
      expect(result.message).assertEqual(AppConstants.ERROR_USER_NOT_FOUND);
    });
  });
}
