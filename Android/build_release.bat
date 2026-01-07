@echo off
echo ========================================
echo Building Release APK...
echo ========================================
echo.
echo Note: Release APK will be signed if keystore is configured.
echo       If not configured, it will use debug signing (for testing only).
echo.
cd /d %~dp0
call gradlew.bat clean assembleRelease
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Build successful!
    echo ========================================
    echo.
    echo APK location: app\build\outputs\apk\release\app-release.apk
    echo.
    echo Release APK features:
    echo   - Code obfuscation enabled
    echo   - Resource shrinking enabled
    echo   - Debug logs removed
    echo   - Optimized for production
    echo.
    if exist "app\build\outputs\apk\release\app-release.apk" (
        echo APK file size:
        dir /b "app\build\outputs\apk\release\app-release.apk"
    )
) else (
    echo.
    echo ========================================
    echo Build failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo Common issues:
    echo   1. Missing dependencies - run: gradlew build --refresh-dependencies
    echo   2. Resource errors - check res/ folder for XML errors
    echo   3. ProGuard errors - check proguard-rules.pro
)
echo.
pause
