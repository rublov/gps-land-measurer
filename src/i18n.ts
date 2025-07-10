import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: {
          "appName": "Землемер",
          "home": "Главный Экран",
          "gpsMarkerMode": "Режим GPS-маркеров",
          "walkingMode": "Режим Прогулки",
          "manualInputMode": "Ручной Ввод",
          "measurementHistory": "История Измерений",
          "settings": "Настройки",
          "welcomeTitle": "Добро пожаловать в Землемер",
          "welcomeMessage": "Выберите режим измерения или просмотрите историю.",
          "placeMarker": "Поставить Маркер",
          "deleteLast": "Удалить Последний",
          "clearAll": "Очистить Все",
          "calculateArea": "Рассчитать Площадь",
          "gpsAccuracy": "Точность GPS",
          "area": "Площадь",
          "sotkas": "соток",
          "squareMeters": "м²",
          "startMeasurement": "Начать Замер",
          "endMeasurement": "Завершить Замер",
          "cancel": "Отменить",
          "currentArea": "Текущая Площадь",
          "areaInSqMeters": "Площадь в м²",
          "areaInHectares": "Площадь в гектарах",
          "areaInSotkas": "Площадь в сотках",
          "calculate": "Рассчитать",
          "saveMeasurement": "Сохранить Измерение",
          "plotName": "Название Участка",
          "save": "Сохранить",
          "exportToPdf": "Экспорт в PDF",
          "exportToExcel": "Экспорт в Excel",
          "deleteMeasurement": "Удалить Измерение",
          "noMeasurementsYet": "Пока нет сохраненных измерений.",
          "language": "Язык",
          "units": "Единицы",
          "mapType": "Тип карты",
          "returnToHome": "Вернуться на Главную",
          "pageNotFound": "Страница не найдена",
          "notEnoughMarkers": "Для расчета площади необходимо поставить минимум 3 маркера.",
          "weakGpsSignal": "Слабый сигнал GPS. Точность измерения может быть снижена. Пожалуйста, найдите место с лучшим приемом.",
          "insufficientData": "Недостаточно данных для точного расчета площади. Пожалуйста, пройдите по всему периметру участка.",
          "gpsAccessError": "Для работы приложения необходим доступ к GPS. Пожалуйста, разрешите доступ в настройках устройства.",
          "saveExportError": "Произошла ошибка при сохранении/экспорте данных. Попробуйте еще раз.",
          "invalidInput": "Пожалуйста, введите корректное числовое значение.",
        }
      }
    },
    lng: "ru", // default language
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false, // react already escapes by default
    }
  });

export default i18n;