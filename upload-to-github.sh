#!/bin/bash

echo "🚀 Загрузка GPS Land Measurer на GitHub"
echo "======================================"

# Проверяем статус git
echo "📋 Статус git репозитория..."
git status

# Добавляем все файлы
echo "📁 Добавление файлов..."
git add .

# Коммит
echo "💾 Создание коммита..."
git commit -m "GPS Land Measurer: APK ready for GitHub Actions build"

# Создаем репозиторий на GitHub (если GitHub CLI установлен)
echo "🌐 Создание репозитория на GitHub..."
if command -v gh &> /dev/null; then
    gh repo create gps-land-measurer --public --description "GPS приложение для измерения земельных участков с автоматической сборкой APK" --clone=false
    
    # Добавляем remote
    git remote add origin https://github.com/$(gh api user --jq .login)/gps-land-measurer.git
    
    # Пушим
    echo "⬆️ Загрузка на GitHub..."
    git push -u origin main
    
    echo "✅ Проект загружен!"
    echo "🔗 Ссылка: https://github.com/$(gh api user --jq .login)/gps-land-measurer"
    echo "🏗️ GitHub Actions начнет сборку APK автоматически"
    echo "📱 APK будет доступен в разделе Actions → Artifacts"
else
    echo "❌ GitHub CLI не установлен"
    echo "📝 Инструкции для ручной загрузки:"
    echo "1. Создайте репозиторий на github.com"
    echo "2. Выполните команды:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/gps-land-measurer.git"
    echo "   git push -u origin main"
fi

echo ""
echo "🎯 После загрузки:"
echo "• GitHub Actions автоматически соберет APK"
echo "• Проверьте раздел Actions на GitHub"
echo "• Скачайте готовый APK из Artifacts"
