package com.edu.primary.network;

import com.edu.primary.constants.AppConstants;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;
import retrofit2.converter.gson.GsonConverterFactory;

import java.util.concurrent.TimeUnit;

/**
 * API客户端（单例模式，线程安全）
 * 使用双重检查锁定模式保证线程安全
 */
public class ApiClient {
    // 使用volatile保证多线程环境下的可见性
    private static volatile Retrofit retrofit;
    private static volatile DeepseekApiService deepseekApiService;

    /**
     * 获取Retrofit实例（线程安全的单例模式）
     */
    public static Retrofit getRetrofit() {
        if (retrofit == null) {
            synchronized (ApiClient.class) {
                if (retrofit == null) {
                    HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
                    logging.setLevel(HttpLoggingInterceptor.Level.BODY);

                    OkHttpClient client = new OkHttpClient.Builder()
                        .addInterceptor(logging)
                        .connectTimeout(30, TimeUnit.SECONDS)
                        .readTimeout(30, TimeUnit.SECONDS)
                        .writeTimeout(30, TimeUnit.SECONDS)
                        // 添加重试机制
                        .retryOnConnectionFailure(true)
                        .build();

                    retrofit = new Retrofit.Builder()
                        .baseUrl(AppConstants.DEEPSEEK_BASE_URL)
                        .client(client)
                        .addConverterFactory(GsonConverterFactory.create())
                        .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                        .build();
                }
            }
        }
        return retrofit;
    }

    /**
     * 获取DeepseekApiService实例（线程安全的单例模式）
     */
    public static DeepseekApiService getDeepseekApiService() {
        if (deepseekApiService == null) {
            synchronized (ApiClient.class) {
                if (deepseekApiService == null) {
                    deepseekApiService = getRetrofit().create(DeepseekApiService.class);
                }
            }
        }
        return deepseekApiService;
    }
}

