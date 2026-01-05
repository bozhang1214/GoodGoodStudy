package com.edu.primary.constants;

import android.content.Context;
import com.edu.primary.R;

public class ErrorMessages {
    
    public static String getErrorMessage(Context context, String errorKey) {
        int resId = context.getResources().getIdentifier(errorKey, "string", context.getPackageName());
        if (resId != 0) {
            return context.getString(resId);
        }
        return context.getString(R.string.error);
    }
    
    private ErrorMessages() {
        // 防止实例化
    }
}
