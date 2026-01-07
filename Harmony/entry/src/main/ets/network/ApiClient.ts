import http from '@ohos.net.http';
import { AppConstants } from '../constants/AppConstants';
import { DeepseekRequest, Message } from './model/DeepseekRequest';
import { DeepseekResponse } from './model/DeepseekResponse';
import { ErrorHandler } from '../utils/ErrorHandler';
import { Logger } from '../utils/Logger';

/**
 * API客户端（线程安全的单例模式）
 */
export class ApiClient {
  private static instance: ApiClient | null = null;

  private constructor() {
    // 私有构造函数，防止外部实例化
  }

  /**
   * 获取API客户端实例（线程安全的单例模式）
   */
  static getInstance(): ApiClient {
    // 双重检查锁定模式
    if (ApiClient.instance === null) {
      // 在HarmonyOS中，由于是单线程事件循环，实际上不需要复杂的锁机制
      // 但为了代码的可移植性，保留检查逻辑
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * 重置单例实例（主要用于测试）
   */
  static resetInstance(): void {
    ApiClient.instance = null;
  }

  /**
   * 发送聊天请求
   * @param apiKey API密钥
   * @param request 请求对象
   * @param timeout 超时时间（毫秒），默认30秒
   * @returns 响应对象
   */
  async chat(apiKey: string, request: DeepseekRequest, timeout: number = 30000): Promise<DeepseekResponse> {
    const httpRequest = http.createHttp();
    const url = AppConstants.DEEPSEEK_BASE_URL + AppConstants.DEEPSEEK_API_ENDPOINT;

    try {
      Logger.debugWithTag('ApiClient', `Sending request to ${url}`);
      
      const response = await httpRequest.request(url, {
        method: http.RequestMethod.POST,
        header: {
          [AppConstants.HEADER_AUTHORIZATION]: AppConstants.BEARER_PREFIX + apiKey,
          [AppConstants.HEADER_CONTENT_TYPE]: AppConstants.CONTENT_TYPE_JSON
        },
        extraData: JSON.stringify(request),
        connectTimeout: timeout,
        readTimeout: timeout
      });

      if (response.responseCode === 200) {
        const result = JSON.parse(response.result.toString()) as DeepseekResponse;
        Logger.debugWithTag('ApiClient', 'Request successful');
        return result;
      } else {
        const error = new Error(`HTTP ${response.responseCode}: ${response.result}`);
        Logger.errorWithTag('ApiClient', `Request failed with status ${response.responseCode}`, error);
        throw ErrorHandler.handleNetworkError(error, 'API request');
      }
    } catch (error) {
      Logger.errorWithTag('ApiClient', 'API request failed', error as Error);
      throw ErrorHandler.handleNetworkError(error, 'API request');
    } finally {
      // 确保资源被释放
      try {
        httpRequest.destroy();
      } catch (error) {
        Logger.warnWithTag('ApiClient', 'Failed to destroy HTTP request', error as Error);
      }
    }
  }
}
