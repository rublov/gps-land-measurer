@echo off
echo Создание APK файла...
echo.

echo 1. Синхронизация с Android платформой...
call npx cap sync android

echo.
echo 2. Сборка проекта...
call npm run build

echo.
echo 3. Копирование файлов в Android проект...
call npx cap copy android

echo.
echo 4. Создание APK через Gradle...
cd android
call gradlew.bat assembleDebug

echo.
echo 5. Поиск созданного APK файла...
dir /s *.apk

echo.
echo APK должен быть в папке: android\app\build\outputs\apk\debug\
pause
