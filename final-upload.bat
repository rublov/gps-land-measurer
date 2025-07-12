@echo off
echo 🚀 Финальная загрузка на GitHub
echo ============================

echo 📋 Создание файла для GitHub upload...

REM Создаем пакет для загрузки
echo 📦 Архивирование проекта...
powershell "Compress-Archive -Path *.* -DestinationPath github-upload.zip -Force"

echo ✅ Проект готов для загрузки!
echo.
echo 📁 Файлы для загрузки:
echo   • github-upload.zip - весь проект
echo   • .github/workflows/build-apk.yml - автосборка APK
echo.
echo 🌐 Следующие шаги:
echo 1. Перейдите на https://github.com/new
echo 2. Имя репозитория: gps-land-measurer
echo 3. Загрузите файл github-upload.zip
echo 4. GitHub Actions автоматически соберет APK!
echo.
echo 📱 APK будет готов через 5-10 минут в разделе Actions
pause
