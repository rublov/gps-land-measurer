# PowerShell скрипт для создания APK
# Землемер - APK Builder для Windows

Write-Host "🚀 Начинаем создание APK для Землемера..." -ForegroundColor Green

# Проверяем наличие Java
Write-Host "🔍 Проверка Java..." -ForegroundColor Yellow
java -version

# Создаем папку для Android SDK
$sdkPath = Join-Path $PWD "android-sdk"
if (-not (Test-Path $sdkPath)) {
    Write-Host "📥 Создаем папку для Android SDK..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $sdkPath -Force | Out-Null
    
    # Скачиваем command line tools
    Write-Host "📥 Скачиваем Android SDK Command Line Tools..." -ForegroundColor Yellow
    $toolsUrl = "https://dl.google.com/android/repository/commandlinetools-win-8092744_latest.zip"
    $toolsZip = Join-Path $sdkPath "commandlinetools.zip"
    
    try {
        Invoke-WebRequest -Uri $toolsUrl -OutFile $toolsZip
        
        # Распаковываем
        Write-Host "📦 Распаковываем SDK..." -ForegroundColor Yellow
        Expand-Archive -Path $toolsZip -DestinationPath $sdkPath -Force
        
        # Создаем правильную структуру папок
        $cmdToolsPath = Join-Path $sdkPath "cmdline-tools"
        $latestPath = Join-Path $cmdToolsPath "latest"
        
        if (Test-Path $cmdToolsPath) {
            New-Item -ItemType Directory -Path $latestPath -Force | Out-Null
            Get-ChildItem -Path $cmdToolsPath -Exclude "latest" | Move-Item -Destination $latestPath -Force
        }
        
        Remove-Item $toolsZip -Force
        Write-Host "✅ Android SDK установлен!" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Ошибка скачивания SDK: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Устанавливаем переменные среды
$env:ANDROID_HOME = $sdkPath
$env:PATH = "$sdkPath\cmdline-tools\latest\bin;$env:PATH"

Write-Host "📱 Android SDK путь: $env:ANDROID_HOME" -ForegroundColor Cyan

# Создаем local.properties
$localPropsPath = Join-Path $PWD "android\local.properties"
$sdkDir = $sdkPath -replace "\\", "\\"
"sdk.dir=$sdkDir" | Out-File -FilePath $localPropsPath -Encoding UTF8

Write-Host "⚙️ Создан local.properties" -ForegroundColor Green

# Устанавливаем необходимые пакеты Android
Write-Host "📦 Устанавливаем Android пакеты..." -ForegroundColor Yellow
$sdkManagerPath = Join-Path $sdkPath "cmdline-tools\latest\bin\sdkmanager.bat"

if (Test-Path $sdkManagerPath) {
    & $sdkManagerPath --install "platform-tools" "platforms;android-30" "build-tools;30.0.3" --sdk_root=$sdkPath
}

# Собираем APK
Write-Host "🔨 Собираем APK..." -ForegroundColor Yellow
Set-Location "android"

$gradlewPath = ".\gradlew.bat"
if (Test-Path $gradlewPath) {
    & $gradlewPath assembleDebug
} else {
    Write-Host "❌ gradlew.bat не найден" -ForegroundColor Red
}

# Проверяем результат
$apkPath = "app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    Write-Host "✅ APK создан успешно!" -ForegroundColor Green
    Write-Host "📱 Файл: $apkPath" -ForegroundColor Cyan
    
    # Копируем APK в корень проекта
    $targetApk = "..\zemljemer-debug.apk"
    Copy-Item $apkPath $targetApk -Force
    
    Write-Host "📱 Скопирован как: zemljemer-debug.apk" -ForegroundColor Green
    
    # Показываем размер файла
    $fileInfo = Get-Item $targetApk
    $sizeInMB = [math]::Round($fileInfo.Length / 1MB, 2)
    Write-Host "📊 Размер APK: $sizeInMB MB" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ Ошибка создания APK" -ForegroundColor Red
}

Set-Location ".."
Write-Host "🎉 Готово!" -ForegroundColor Green
