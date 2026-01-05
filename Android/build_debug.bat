@echo off
echo Building Debug APK...
cd /d %~dp0
call gradlew.bat assembleDebug
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Build successful!
    echo APK location: app\build\outputs\apk\debug\app-debug.apk
) else (
    echo.
    echo Build failed!
)
pause
