# Скрипт для создания APK на Windows
# PowerShell версия

Write-Host "🚀 Создание APK приложения Землемер" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Создание веб-сборки
Write-Host "🏗️ Создание веб-сборки..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при сборке!" -ForegroundColor Red
    exit 1
}

# Синхронизация с Android
Write-Host "📱 Синхронизация с Android..." -ForegroundColor Yellow
npx cap sync android

# Копирование файлов
Write-Host "📋 Копирование файлов..." -ForegroundColor Yellow
npx cap copy android

# Создание APK
Write-Host "🔨 Создание APK через Gradle..." -ForegroundColor Yellow
Set-Location android

if (Test-Path "gradlew.bat") {
    .\gradlew.bat assembleDebug
} else {
    Write-Host "⚠️ gradlew.bat не найден. Попробуйте:" -ForegroundColor Yellow
    Write-Host "1. Установить Android Studio" -ForegroundColor Cyan
    Write-Host "2. Открыть проект: npx cap open android" -ForegroundColor Cyan
    Write-Host "3. В Android Studio: Build -> Build APK(s)" -ForegroundColor Cyan
    exit 1
}

Set-Location ..

# Проверка результата
$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    Write-Host "✅ APK успешно создан!" -ForegroundColor Green
    Write-Host "📱 Файл: $apkPath" -ForegroundColor Green
    Write-Host "🎯 Установите APK на телефон для максимальной точности GPS!" -ForegroundColor Cyan
    
    # Показать размер файла
    $fileSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "📊 Размер APK: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
} else {
    Write-Host "❌ APK не найден. Возможные решения:" -ForegroundColor Red
    Write-Host "1. Установите Android Studio и Android SDK" -ForegroundColor Yellow
    Write-Host "2. Настройте переменные окружения ANDROID_HOME" -ForegroundColor Yellow
    Write-Host "3. Используйте веб-версии пока что" -ForegroundColor Yellow
}

Write-Host "`n📱 Альтернативы пока APK создается:" -ForegroundColor Magenta
Write-Host "• mobile-gps-fixed.html - мобильная версия" -ForegroundColor White
Write-Host "• index.html - полная версия с калибровкой" -ForegroundColor White
Write-Host "• ready-apps.html - все приложения" -ForegroundColor White
