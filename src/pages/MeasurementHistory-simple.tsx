import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { SoundButton } from '@/components/ui/sound-button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { playSound } from '@/utils/sound';

interface Measurement {
  id: string;
  name: string;
  areaSqMeters: number;
  areaSotkas: number;
  date: string;
  coordinates?: { lat: number; lng: number }[];
}

// Простые функции для работы с localStorage
const loadMeasurements = (): Measurement[] => {
  try {
    const stored = localStorage.getItem('landMeasurements');
    console.log('Загрузка из localStorage:', stored);
    const parsed = stored ? JSON.parse(stored) : [];
    console.log('Распарсенные измерения:', parsed);
    return parsed;
  } catch (error) {
    console.error('Ошибка загрузки измерений:', error);
    return [];
  }
};

const deleteMeasurement = (id: string): void => {
  try {
    const measurements = loadMeasurements();
    const filtered = measurements.filter(m => m.id !== id);
    localStorage.setItem('landMeasurements', JSON.stringify(filtered));
  } catch (error) {
    console.error('Ошибка удаления измерения:', error);
  }
};

const clearAllMeasurements = (): void => {
  try {
    localStorage.removeItem('landMeasurements');
  } catch (error) {
    console.error('Ошибка очистки измерений:', error);
  }
};

const MeasurementHistorySimple = () => {
  const { t } = useTranslation();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = loadMeasurements();
    setMeasurements(data);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это измерение?')) {
      deleteMeasurement(id);
      loadData();
      toast.success('Измерение удалено');
    }
  };

  const handleClearAll = () => {
    if (confirm('Вы уверены, что хотите удалить ВСЕ измерения? Это действие нельзя отменить.')) {
      clearAllMeasurements();
      setMeasurements([]);
      toast.success('Все измерения удалены');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const exportToText = () => {
    if (measurements.length === 0) {
      toast.error('Нет данных для экспорта');
      return;
    }

    let text = 'ИСТОРИЯ ИЗМЕРЕНИЙ ЗЕМЛИ\\n';
    text += '================================\\n\\n';
    
    measurements.forEach((measurement, index) => {
      text += `Измерение ${index + 1}:\\n`;
      text += `Название: ${measurement.name}\\n`;
      text += `Площадь: ${measurement.areaSqMeters.toFixed(1)} м² (${measurement.areaSotkas.toFixed(2)} соток)\\n`;
      text += `Дата: ${formatDate(measurement.date)}\\n`;
      if (measurement.coordinates) {
        text += `Координат: ${measurement.coordinates.length}\\n`;
      }
      text += '\\n';
    });

    // Создаем и скачиваем файл
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `измерения_земли_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Данные экспортированы в текстовый файл');
  };

  const addTestMeasurement = () => {
    const testMeasurement = {
      id: Date.now().toString(),
      name: 'Тестовый участок',
      areaSqMeters: 1000,
      areaSotkas: 10,
      date: new Date().toISOString(),
      coordinates: [
        { lat: 55.7558, lng: 37.6173 },
        { lat: 55.7568, lng: 37.6183 },
        { lat: 55.7548, lng: 37.6193 }
      ]
    };
    
    const measurements = loadMeasurements();
    measurements.push(testMeasurement);
    localStorage.setItem('landMeasurements', JSON.stringify(measurements));
    loadData();
    toast.success('Тестовое измерение добавлено');
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('measurementHistory')}</h1>
        <Link to="/">
          <SoundButton variant="outline" soundType="click">← {t('home')}</SoundButton>
        </Link>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{measurements.length}</div>
          <div className="text-sm text-blue-800">Всего измерений</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {measurements.reduce((sum, m) => sum + m.areaSqMeters, 0).toFixed(0)}
          </div>
          <div className="text-sm text-green-800">Общая площадь (м²)</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {measurements.reduce((sum, m) => sum + m.areaSotkas, 0).toFixed(1)}
          </div>
          <div className="text-sm text-yellow-800">Общая площадь (соток)</div>
        </div>
      </div>

      {/* Действия */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={exportToText} disabled={measurements.length === 0}>
          📄 Экспорт в текст
        </Button>
        <Button 
          onClick={handleClearAll} 
          variant="destructive"
          disabled={measurements.length === 0}
        >
          🗑️ Удалить все
        </Button>
        <Button onClick={addTestMeasurement} variant="outline">
          🧪 Добавить тест
        </Button>
        <Button onClick={loadData} variant="outline">
          🔄 Обновить
        </Button>
      </div>

      {/* Список измерений */}
      {measurements.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📏</div>
          <h3 className="text-xl font-semibold mb-2">Пока нет сохраненных измерений</h3>
          <p className="text-gray-600 mb-4">
            Начните измерение участка, чтобы увидеть результаты здесь
          </p>
          <div className="space-x-2">
            <Link to="/gps-marker-mode">
              <Button>📍 GPS маркеры</Button>
            </Link>
            <Link to="/walking-mode">
              <Button variant="outline">🚶 Режим прогулки</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {measurements.map((measurement) => (
            <div key={measurement.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{measurement.name}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Площадь:</span>
                      <div className="font-medium">{measurement.areaSqMeters.toFixed(1)} м²</div>
                    </div>
                    <div>
                      <span className="text-gray-600">В сотках:</span>
                      <div className="font-medium">{measurement.areaSotkas.toFixed(2)} соток</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Дата:</span>
                      <div className="font-medium">{formatDate(measurement.date)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Координат:</span>
                      <div className="font-medium">
                        {measurement.coordinates ? measurement.coordinates.length : 'Нет'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => setSelectedMeasurement(measurement)}
                    size="sm"
                    variant="outline"
                  >
                    👁️ Детали
                  </Button>
                  <Button
                    onClick={() => handleDelete(measurement.id)}
                    size="sm"
                    variant="destructive"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Диалог с деталями */}
      {selectedMeasurement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Детали измерения</h3>
              <Button 
                onClick={() => setSelectedMeasurement(null)}
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Название:</span>
                <div className="font-medium">{selectedMeasurement.name}</div>
              </div>
              <div>
                <span className="text-gray-600">Площадь:</span>
                <div className="font-medium">
                  {selectedMeasurement.areaSqMeters.toFixed(1)} м² 
                  ({selectedMeasurement.areaSotkas.toFixed(2)} соток)
                </div>
              </div>
              <div>
                <span className="text-gray-600">Дата измерения:</span>
                <div className="font-medium">{formatDate(selectedMeasurement.date)}</div>
              </div>
              {selectedMeasurement.coordinates && (
                <div>
                  <span className="text-gray-600">Координаты ({selectedMeasurement.coordinates.length} точек):</span>
                  <div className="max-h-32 overflow-y-auto text-xs mt-1 space-y-1">
                    {selectedMeasurement.coordinates.map((coord, index) => (
                      <div key={index} className="bg-gray-100 p-1 rounded">
                        {index + 1}: {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementHistorySimple;
