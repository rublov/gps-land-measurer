#!/bin/bash

# Скрипт для установки Android SDK и создания APK
# Землемер - APK Builder

echo "🚀 Начинаем создание APK для Землемера..."

# Проверяем наличие Java
echo "🔍 Проверка Java..."
java -version 2>&1 | head -1

# Скачиваем Android SDK Command Line Tools
echo "📥 Скачиваем Android SDK..."
if [ ! -d "android-sdk" ]; then
    echo "Создаем папку android-sdk..."
    mkdir -p android-sdk
    cd android-sdk
    
    echo "Скачиваем command line tools..."
    # Для Windows
    curl -O https://dl.google.com/android/repository/commandlinetools-win-8092744_latest.zip
    
    echo "Распаковываем..."
    unzip commandlinetools-win-8092744_latest.zip
    
    # Создаем структуру папок
    mkdir -p cmdline-tools/latest
    mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true
    
    cd ..
fi

# Устанавливаем переменные среды
export ANDROID_HOME="$(pwd)/android-sdk"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

echo "📱 Android SDK установлен в: $ANDROID_HOME"

# Устанавливаем необходимые пакеты
echo "📦 Устанавливаем Android пакеты..."
sdkmanager --install "platform-tools" "platforms;android-30" "build-tools;30.0.3"

# Создаем local.properties для Android проекта
echo "⚙️ Настраиваем Android проект..."
echo "sdk.dir=$ANDROID_HOME" > android/local.properties

# Собираем APK
echo "🔨 Собираем APK..."
cd android
./gradlew assembleDebug

# Проверяем результат
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ APK создан успешно!"
    echo "📱 Файл: android/app/build/outputs/apk/debug/app-debug.apk"
    
    # Копируем APK в корень проекта
    cp app/build/outputs/apk/debug/app-debug.apk ../zemljemer-debug.apk
    echo "📱 Скопирован как: zemljemer-debug.apk"
    
    # Показываем размер файла
    ls -lh ../zemljemer-debug.apk
else
    echo "❌ Ошибка создания APK"
fi

echo "🎉 Готово!"
