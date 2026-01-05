package com.edu.primary.network;

import com.edu.primary.network.model.DeepseekRequest;
import com.edu.primary.network.model.DeepseekResponse;
import io.reactivex.Single;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

import com.edu.primary.constants.AppConstants;

public interface DeepseekApiService {
    @POST(AppConstants.DEEPSEEK_API_ENDPOINT)
    Single<DeepseekResponse> chat(
        @Header(AppConstants.HEADER_AUTHORIZATION) String authorization,
        @Header(AppConstants.HEADER_CONTENT_TYPE) String contentType,
        @Body DeepseekRequest request
    );
}

