#!/bin/bash

# Скрипт для создания APK через Capacitor Cloud Build
# Этот скрипт поможет создать APK без Android Studio

echo "🚀 Создание APK приложения Землемер"
echo "=================================="

# Проверка Capacitor Cloud CLI
echo "📦 Проверка Capacitor Cloud CLI..."
if ! command -v @capacitor/cli &> /dev/null; then
    echo "❌ Capacitor CLI не найден. Установка..."
    npm install -g @capacitor/cli
fi

# Логин в Capacitor Cloud (если нужно)
echo "🔑 Вход в Capacitor Cloud..."
echo "Если у вас нет аккаунта, зарегистрируйтесь на https://capacitorjs.com/cloud"

# Создание сборки
echo "🏗️ Создание веб-сборки..."
npm run build

echo "📱 Синхронизация с Android..."
npx cap sync android

echo "📋 Копирование файлов..."
npx cap copy android

echo "� Создание APK через Gradle..."
cd android
./gradlew assembleDebug

echo "✅ APK создан!"
echo "📱 Файл находится в: android/app/build/outputs/apk/debug/app-debug.apk"
echo "� Установите APK на телефон для максимальной точности GPS!"
