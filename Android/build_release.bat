@echo off
echo Building Release APK...
echo Note: Release APK requires signing configuration.
cd /d %~dp0
call gradlew.bat assembleRelease
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Build successful!
    echo APK location: app\build\outputs\apk\release\app-release.apk
    echo.
    echo Note: This APK is unsigned. To sign it, use Android Studio's signing configuration.
) else (
    echo.
    echo Build failed!
)
pause
