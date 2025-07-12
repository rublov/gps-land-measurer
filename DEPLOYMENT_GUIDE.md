# Quick Start Guide для проекта "Землемер"

## 🚀 Быстрый запуск разработки

```bash
# 1. Установка зависимостей
pnpm install

# 2. Запуск в режиме разработки
pnpm run dev

# 3. Сборка для продакшена
pnpm run build

# 4. Предварительный просмотр продакшен сборки
pnpm run preview
```

## 🔧 Настройка для продакшена

### 1. Создать .env файл:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

### 2. Настроить домен в Google Maps Console
- Добавить ваш домен в разрешенные для API ключа

### 3. Настроить веб-сервер (Nginx пример):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
    
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📱 Тестирование на устройствах

1. **Desktop:** Chrome, Firefox, Safari, Edge
2. **Mobile:** iOS Safari, Android Chrome
3. **GPS функции:** Требуют HTTPS в продакшене

## 🛠️ Команды для разработчиков

```bash
# Анализ размера бандла
pnpm run build
npx vite-bundle-analyzer dist

# Проверка типов
npx tsc --noEmit

# Форматирование кода (если настроено)
npx prettier --write src/

# Проверка на ошибки
npx eslint src/
```

## 📋 Чек-лист перед деплоем

- [ ] Все переменные окружения настроены
- [ ] Google Maps API ключ работает для домена
- [ ] Тестирование на мобильных устройствах
- [ ] Проверка работы GPS функций
- [ ] Тестирование экспорта PDF/Excel
- [ ] Проверка темной/светлой темы
- [ ] Валидация всех форм ввода
