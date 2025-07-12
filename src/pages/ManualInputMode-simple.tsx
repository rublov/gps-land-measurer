import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { convertSqMetersToSotkas } from '@/utils/geometry';
import { toast } from 'sonner';

// Функция для сохранения измерения
const saveMeasurement = (name: string, areaSqMeters: number, areaSotkas: number) => {
  try {
    console.log('Manual: Попытка сохранения измерения:', { name, areaSqMeters, areaSotkas });
    
    const measurements = JSON.parse(localStorage.getItem('landMeasurements') || '[]');
    console.log('Manual: Существующие измерения:', measurements);
    
    const newMeasurement = {
      id: Date.now().toString(),
      name: name || `Ручной ввод от ${new Date().toLocaleDateString()}`,
      areaSqMeters,
      areaSotkas,
      date: new Date().toISOString(),
      coordinates: [] // Для ручного ввода нет координат
    };
    
    console.log('Manual: Новое измерение:', newMeasurement);
    
    measurements.push(newMeasurement);
    localStorage.setItem('landMeasurements', JSON.stringify(measurements));
    
    console.log('Manual: Сохранено в localStorage:', JSON.parse(localStorage.getItem('landMeasurements') || '[]'));
    
    return true;
  } catch (error) {
    console.error('Manual: Ошибка сохранения:', error);
    return false;
  }
};

const ManualInputModeSimple = () => {
  const { t } = useTranslation();
  const [sqMetersInput, setSqMetersInput] = useState<string>('');
  const [hectaresInput, setHectaresInput] = useState<string>('');
  const [calculatedSotkas, setCalculatedSotkas] = useState<number>(0);
  const [calculatedSqMeters, setCalculatedSqMeters] = useState<number>(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  const convertAndSetSotkas = (sqM: number) => {
    if (isNaN(sqM) || sqM < 0) {
      setCalculatedSotkas(0);
      setCalculatedSqMeters(0);
      return;
    }
    setCalculatedSqMeters(sqM);
    setCalculatedSotkas(convertSqMetersToSotkas(sqM));
  };

  const handleSqMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSqMetersInput(value);
    const numValue = parseFloat(value);

    if (value === '' || isNaN(numValue)) {
      setHectaresInput('');
      convertAndSetSotkas(0);
      return;
    }

    if (numValue < 0) {
      toast.error('Некорректный ввод');
      setHectaresInput('');
      convertAndSetSotkas(0);
      return;
    }

    setHectaresInput((numValue / 10000).toFixed(4));
    convertAndSetSotkas(numValue);
  };

  const handleHectaresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHectaresInput(value);
    const numValue = parseFloat(value);

    if (value === '' || isNaN(numValue)) {
      setSqMetersInput('');
      convertAndSetSotkas(0);
      return;
    }

    if (numValue < 0) {
      toast.error('Некорректный ввод');
      setSqMetersInput('');
      convertAndSetSotkas(0);
      return;
    }

    const sqMeters = numValue * 10000;
    setSqMetersInput(sqMeters.toString());
    convertAndSetSotkas(sqMeters);
  };

  const handleSave = () => {
    if (calculatedSqMeters === 0) {
      toast.error('Введите площадь для сохранения');
      return;
    }
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    if (saveMeasurement(saveName, calculatedSqMeters, calculatedSotkas)) {
      toast.success('Измерение сохранено!');
      setShowSaveDialog(false);
      setSaveName('');
      // Очищаем поля
      setSqMetersInput('');
      setHectaresInput('');
      setCalculatedSqMeters(0);
      setCalculatedSotkas(0);
    } else {
      toast.error('Ошибка при сохранении');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('manualInputMode')}</h1>
        <Link to="/">
          <Button variant="outline">← {t('home')}</Button>
        </Link>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Ввод в квадратных метрах */}
        <div className="space-y-2">
          <label htmlFor="sqmeters" className="text-sm font-medium">
            Площадь в м²
          </label>
          <Input
            id="sqmeters"
            type="number"
            value={sqMetersInput}
            onChange={handleSqMetersChange}
            placeholder="100"
            className="text-lg"
          />
        </div>

        {/* Ввод в гектарах */}
        <div className="space-y-2">
          <label htmlFor="hectares" className="text-sm font-medium">
            Площадь в гектарах
          </label>
          <Input
            id="hectares"
            type="number"
            step="0.0001"
            value={hectaresInput}
            onChange={handleHectaresChange}
            placeholder="0.0100"
            className="text-lg"
          />
        </div>

        {/* Результат в сотках */}
        {calculatedSotkas > 0 && (
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Площадь в сотках:</h3>
            <div className="text-3xl font-bold text-green-600">
              {calculatedSotkas.toFixed(2)} соток
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {calculatedSqMeters.toFixed(1)} м² = {(calculatedSqMeters / 10000).toFixed(4)} га
            </div>
          </div>
        )}

        {/* Кнопка сохранения */}
        <Button 
          onClick={handleSave} 
          disabled={calculatedSqMeters === 0}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          💾 Сохранить Измерение
        </Button>

        {/* Справочная информация */}
        <div className="bg-blue-50 p-4 rounded-lg text-sm">
          <h4 className="font-semibold mb-2">Справка по единицам измерения:</h4>
          <ul className="space-y-1 text-gray-700">
            <li>• 1 сотка = 100 м²</li>
            <li>• 1 гектар = 10,000 м² = 100 соток</li>
            <li>• 1 м² = 0.01 соток</li>
          </ul>
        </div>
      </div>

      {/* Диалог сохранения */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Сохранить измерение</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название участка:</label>
                <Input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Например: Дачный участок"
                  className="w-full"
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div>Площадь: {calculatedSqMeters.toFixed(1)} м²</div>
                <div>В сотках: {calculatedSotkas.toFixed(2)} соток</div>
                <div>В гектарах: {(calculatedSqMeters / 10000).toFixed(4)} га</div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={() => setShowSaveDialog(false)} variant="outline" className="flex-1">
                Отмена
              </Button>
              <Button onClick={confirmSave} className="flex-1 bg-green-600 hover:bg-green-700">
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualInputModeSimple;
