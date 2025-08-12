@echo off
REM Generate Release Keystore for Dahabiyat Nile Cruise App
REM This creates a production-ready keystore for Google Play Store

echo.
echo 🔐 Generating Release Keystore for Dahabiyat Nile Cruise
echo =======================================================
echo.

REM Keystore configuration
set KEYSTORE_NAME=dahabiyat-release.keystore
set KEY_ALIAS=dahabiyat-release
set KEYSTORE_PATH=android\app\%KEYSTORE_NAME%
set PROPERTIES_PATH=android\app\keystore.properties

echo 🔑 Keystore: %KEYSTORE_NAME%
echo 🏷️  Alias: %KEY_ALIAS%
echo.

REM Check if keystore already exists
if exist "%KEYSTORE_PATH%" (
    echo ⚠️  Keystore already exists at: %KEYSTORE_PATH%
    set /p OVERWRITE="Do you want to overwrite it? (y/N): "
    if /i not "%OVERWRITE%"=="y" (
        echo ℹ️  Keeping existing keystore
        pause
        exit /b 0
    )
    del "%KEYSTORE_PATH%"
)

echo 📝 Please provide the following information for your keystore:
echo.

REM Collect keystore information
set /p STORE_PASSWORD="Store Password (min 6 characters): "
if "%STORE_PASSWORD%"=="" (
    echo ❌ Store password cannot be empty!
    pause
    exit /b 1
)

set /p STORE_PASSWORD_CONFIRM="Confirm Store Password: "
if not "%STORE_PASSWORD%"=="%STORE_PASSWORD_CONFIRM%" (
    echo ❌ Passwords don't match!
    pause
    exit /b 1
)

set /p KEY_PASSWORD="Key Password (min 6 characters, can be same as store password): "
if "%KEY_PASSWORD%"=="" (
    echo ❌ Key password cannot be empty!
    pause
    exit /b 1
)

echo.
echo 📋 Certificate Information:
set /p CN="First and Last Name (e.g., Dahabiyat Nile Cruise): "
set /p O="Organization (e.g., Dahabiyat Nile Cruise Company): "
set /p OU="Organizational Unit (e.g., Mobile Development): "
set /p L="City (e.g., Aswan): "
set /p ST="State/Province (e.g., Aswan): "
set /p C="Country Code (e.g., EG): "

echo.
echo 🔧 Generating keystore...

REM Generate the keystore
keytool -genkey -v -keystore "%KEYSTORE_PATH%" -alias "%KEY_ALIAS%" -keyalg RSA -keysize 2048 -validity 10000 -storepass "%STORE_PASSWORD%" -keypass "%KEY_PASSWORD%" -dname "CN=%CN%, OU=%OU%, O=%O%, L=%L%, ST=%ST%, C=%C%"

if %errorlevel% equ 0 (
    echo ✅ Keystore generated successfully!
) else (
    echo ❌ Failed to generate keystore!
    pause
    exit /b 1
)

echo.
echo 📝 Creating keystore.properties...

REM Create keystore.properties file
(
    echo storeFile=%KEYSTORE_NAME%
    echo storePassword=%STORE_PASSWORD%
    echo keyAlias=%KEY_ALIAS%
    echo keyPassword=%KEY_PASSWORD%
) > "%PROPERTIES_PATH%"

echo ✅ keystore.properties created

echo.
echo 📊 Keystore Information:
echo ================================
echo 📁 Keystore File: %KEYSTORE_PATH%
echo 🏷️  Key Alias: %KEY_ALIAS%
echo ⏰ Validity: 10000 days (~27 years)
echo 🔐 Algorithm: RSA 2048-bit
echo.

echo 🔍 Certificate Details:
keytool -list -v -keystore "%KEYSTORE_PATH%" -alias "%KEY_ALIAS%" -storepass "%STORE_PASSWORD%" | findstr /n "^" | findstr "^[1-9]:" | findstr /v "^[2-9][0-9]:"

echo.
echo ✅ Release keystore setup complete!
echo.
echo 📋 Next Steps:
echo 1. Keep your keystore file and passwords SECURE
echo 2. Backup the keystore file to a safe location
echo 3. Run build-release.bat to build signed APK/AAB
echo 4. Upload AAB to Google Play Console
echo.

echo ⚠️  IMPORTANT SECURITY NOTES:
echo • Never commit keystore.properties to version control
echo • Store keystore file and passwords securely
echo • If you lose the keystore, you cannot update your app on Google Play
echo • Make multiple backups of your keystore file
echo.

echo 📁 Files created:
echo • %KEYSTORE_PATH% (keystore file)
echo • %PROPERTIES_PATH% (configuration)
echo.

REM Add to .gitignore if it exists
if exist ".gitignore" (
    findstr /c:"keystore.properties" .gitignore >nul
    if %errorlevel% neq 0 (
        echo. >> .gitignore
        echo # Keystore files >> .gitignore
        echo android/app/keystore.properties >> .gitignore
        echo android/app/*.keystore >> .gitignore
        echo ✅ Added keystore files to .gitignore
    )
)

echo.
echo 🔐 Keystore generation completed successfully!
echo.
echo Press any key to continue...
pause >nul
