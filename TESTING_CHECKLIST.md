# 🧪 ПОЛНОЕ РУКОВОДСТВО ПО ТЕСТИРОВАНИЮ "Землемер"

## 📍 ШАГ 1: ПРОВЕРЯЕМ ЧТО СЕРВЕР ЗАПУЩЕН

### На компьютере:
1. Откройте браузер
2. Перейдите по адресу: **http://localhost:8080**
3. ✅ Должна открыться главная страница "Землемер"

---

## 📱 ШАГ 2: ТЕСТИРОВАНИЕ НА КОМПЬЮТЕРЕ (Desktop)

### 2.1 Проверка базового интерфейса
- [ ] **Заголовок** "Добро пожаловать в Землемер" отображается
- [ ] **Боковое меню** слева работает (можно открыть/закрыть)
- [ ] **Переключатель темы** в правом верхнем углу работает
- [ ] **Все пункты меню** кликабельны:
  - Главный Экран
  - Режим GPS-маркеров  
  - Режим Прогулки
  - Ручной Ввод
  - История Измерений
  - Настройки

### 2.2 Тестирование GPS-маркеров
1. **Нажмите "Режим GPS-маркеров"**
2. **Разрешите доступ к геолокации** (всплывающее окно браузера)
3. ✅ Должна появиться карта с вашим местоположением
4. ✅ Должна отображаться "Точность GPS: X м"
5. **Нажмите "Поставить Маркер"** - на карте появится красная точка
6. **Поставьте еще 2-3 маркера** вокруг небольшой области
7. **Нажмите "Рассчитать Площадь"**
8. ✅ Должен появиться результат в сотках и м²

### 2.3 Сохранение измерения
1. **Нажмите "Сохранить Измерение"**
2. **Введите название:** "Тестовый участок"
3. **Нажмите "Сохранить"**
4. ✅ Должно появиться уведомление об успешном сохранении

### 2.4 Проверка истории
1. **Перейдите в "История Измерений"**
2. ✅ Должно отображаться сохраненное измерение
3. **Нажмите "Показать на карте"**
4. ✅ Карта должна показать ваш участок

---

## 📱 ШАГ 3: ТЕСТИРОВАНИЕ НА ТЕЛЕФОНЕ

### 3.1 Подключение телефона
1. **Убедитесь** что телефон подключен к той же Wi-Fi что и компьютер
2. **На телефоне откройте браузер** (лучше Chrome)
3. **Перейдите по адресу:** `http://192.168.2.104:8080`
4. ✅ Должна открыться мобильная версия приложения

### 3.2 Проверка мобильного интерфейса
- [ ] **Меню-гамбургер** в левом верхнем углу работает
- [ ] **Боковое меню** выдвигается и скрывается
- [ ] **Все кнопки достаточно большие** для нажатия пальцем
- [ ] **Текст читаем** на маленьком экране
- [ ] **Карта масштабируется** жестами (щипок, прокрутка)

### 3.3 Тестирование GPS на телефоне
1. **Перейдите в "Режим GPS-маркеров"**
2. **Разрешите доступ к геолокации**
3. ✅ Карта должна показать ваше текущее местоположение
4. **Попробуйте поставить маркеры** тапом по карте
5. **Протестируйте "Режим Прогулки":**
   - Нажмите "Начать Замер"
   - Пройдите небольшой маршрут (хотя бы по комнате)
   - Нажмите "Завершить Замер"
   - ✅ Должна рассчитаться площадь

---

## 🎯 ШАГ 4: РАСШИРЕННОЕ ТЕСТИРОВАНИЕ

### 4.1 Ручной ввод
1. **Перейдите в "Ручной Ввод"**
2. **Введите тестовые значения:**
   - Длина: 50
   - Ширина: 30
3. **Нажмите "Рассчитать"**
4. ✅ Результат должен быть: 15 соток (1500 м²)

### 4.2 Настройки
1. **Откройте "Настройки"**
2. **Попробуйте изменить:**
   - Тип карты (спутник, гибрид, дорожная)
   - Тему (светлая/темная)
3. ✅ Изменения должны применяться сразу

### 4.3 Экспорт (может не работать в мобильном браузере)
1. **В истории измерений найдите сохраненный участок**
2. **Попробуйте "Экспорт в PDF"**
3. ✅ Должен скачаться PDF файл с картой и данными

---

## 🚨 ЧТО ДЕЛАТЬ ЕСЛИ ЧТО-TO НЕ РАБОТАЕТ

### GPS не определяется:
1. ✅ Проверьте разрешения в браузере
2. ✅ Убедитесь что GPS включен на устройстве
3. ✅ Попробуйте обновить страницу
4. ⚠️ В HTTP режиме GPS может быть неточным

### Карта не загружается:
1. ✅ Проверьте интернет соединение
2. ✅ Подождите 10-15 секунд
3. ✅ Обновите страницу

### Интерфейс "сломан":
1. ✅ Попробуйте другой браузер
2. ✅ Очистите кеш (Ctrl+F5)
3. ✅ Попробуйте режим инкогнито

---

## 📊 ЧЕК-ЛИСТ УСПЕШНОГО ТЕСТИРОВАНИЯ

### Базовая функциональность:
- [ ] Приложение загружается на компьютере
- [ ] Приложение загружается на телефоне  
- [ ] Меню и навигация работают
- [ ] Темы переключаются
- [ ] Все страницы открываются

### GPS функции:
- [ ] Геолокация определяется
- [ ] Маркеры ставятся на карту
- [ ] Площадь рассчитывается корректно
- [ ] Режим прогулки отслеживает движение

### Сохранение данных:
- [ ] Измерения сохраняются
- [ ] История отображается корректно
- [ ] Настройки сохраняются между сессиями

### Мобильная версия:
- [ ] Интерфейс адаптирован под телефон
- [ ] GPS работает на мобильном
- [ ] Жесты карты работают
- [ ] Клавиатура не перекрывает интерфейс

---

## 🎉 ЕСЛИ ВСЕ РАБОТАЕТ

**Поздравляю!** Ваш проект полностью функционален и готов к использованию!

### Следующие шаги:
1. **Для продакшена:** Деплой на Vercel/Netlify с HTTPS
2. **Для улучшения:** Добавить тестирование (из ROADMAP.md)
3. **Для бизнеса:** Добавить аналитику и монетизацию

---

## 📞 ОБРАТНАЯ СВЯЗЬ

После тестирования ответьте на вопросы:
1. Какие функции работают отлично?
2. Что вызвало затруднения?
3. Какие ошибки обнаружили?
4. Насколько интуитивен интерфейс?
5. Подходит ли точность GPS для ваших задач?

Эта информация поможет определить приоритеты для дальнейшего развития!
