import http from "@ohos:net.http";
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
import type { DeepseekRequest } from './model/DeepseekRequest';
import type { DeepseekResponse } from './model/DeepseekResponse';
/**
 * API客户端
 */
export class ApiClient {
    private static instance: ApiClient | null = null;
    private constructor() {
    }
    static getInstance(): ApiClient {
        if (ApiClient.instance === null) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }
    /**
     * 发送聊天请求
     */
    async chat(apiKey: string, request: DeepseekRequest): Promise<DeepseekResponse> {
        const httpRequest = http.createHttp();
        const url = AppConstants.DEEPSEEK_BASE_URL + AppConstants.DEEPSEEK_API_ENDPOINT;
        try {
            const response = await httpRequest.request(url, {
                method: http.RequestMethod.POST,
                header: {
                    [AppConstants.HEADER_AUTHORIZATION]: AppConstants.BEARER_PREFIX + apiKey,
                    [AppConstants.HEADER_CONTENT_TYPE]: AppConstants.CONTENT_TYPE_JSON
                },
                extraData: JSON.stringify(request),
                connectTimeout: 30000,
                readTimeout: 30000
            });
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result.toString()) as DeepseekResponse;
                return result;
            }
            else {
                throw new Error(`HTTP ${response.responseCode}: ${response.result}`);
            }
        }
        catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
        finally {
            httpRequest.destroy();
        }
    }
}
