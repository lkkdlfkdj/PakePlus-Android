@echo off
echo === 考勤管理系统 APK 签名工具 ===
echo.
echo 这个脚本会使用 debug keystore 为 APK 签名
echo 需要安装 Android SDK (build-tools)
echo.

set APK_FILE=kaoqin_redesigned.apk
set SIGNED_APK=kaoqin_redesigned_signed.apk
set KEYSTORE=%USERPROFILE%\.android\debug.keystore
set KEYALIAS=androiddebugkey
set STOREPASS=android
set KEYPASS=android

if not exist "%KEYSTORE%" (
    echo [错误] 找不到 debug keystore: %KEYSTORE%
    echo 请先安装 Android Studio 或执行以下命令生成:
    echo   keytool -genkey -v -keystore "%KEYSTORE%" ^
    echo     -alias androiddebugkey -storepass android -keypass android ^
    echo     -keyalg RSA -keysize 2048 -validity 10000 ^
    echo     -dname "CN=Android Debug,O=Android,C=US"
    pause
    exit /b 1
)

echo [1/3] 对齐 APK (zipalign)...
if exist "%SIGNED_APK%" del "%SIGNED_APK%"
zipalign -f -v 4 "%APK_FILE%" "%SIGNED_APK%"
if %errorlevel% neq 0 (
    echo [错误] zipalign 失败，请确保 zipalign 在 PATH 中
    echo 通常位于: C:\Users\%USERNAME%\AppData\Local\Android\Sdk\build-tools\XX.X.X\
    pause
    exit /b 1
)

echo [2/3] 签名 APK (apksigner)...
apksigner sign --ks "%KEYSTORE%" --ks-key-alias %KEYALIAS% --ks-pass pass:%STOREPASS% --key-pass pass:%KEYPASS% "%SIGNED_APK%"
if %errorlevel% neq 0 (
    echo [错误] apksigner 失败，请确保 apksigner 在 PATH 中
    pause
    exit /b 1
)

echo [3/3] 验证签名...
apksigner verify "%SIGNED_APK%"
if %errorlevel% equ 0 (
    echo.
    echo [成功] APK 已签名!
    echo 输出文件: %CD%\%SIGNED_APK%
    echo.
    echo 使用 ADB 安装:
    echo   adb install %SIGNED_APK%
) else (
    echo [错误] 签名验证失败
)

pause
