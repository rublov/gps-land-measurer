import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { loadSettings, saveSettings, AppSettings } from '@/utils/storage';
import { soundManager, playSound } from '@/utils/sound';
import { SoundButton } from '@/components/ui/sound-button';

const SettingsSimple = () => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
  const [soundVolume, setSoundVolume] = useState(soundManager.getVolume());

  useEffect(() => {
    // Ensure i18n language matches loaded settings on component mount
    if (i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [i18n, settings.language]);

  const handleLanguageChange = (value: string) => {
    const newSettings = { ...settings, language: value };
    setSettings(newSettings);
    saveSettings(newSettings);
    i18n.changeLanguage(value);
  };

  const handleMapTypeChange = (value: string) => {
    const newSettings = { ...settings, mapType: value as AppSettings['mapType'] };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundManager.setEnabled(enabled);
    if (enabled) {
      playSound('success'); // Тестовый звук при включении
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const volume = value[0];
    setSoundVolume(volume);
    soundManager.setVolume(volume);
  };

  const testSound = () => {
    playSound('click');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
        <Link to="/">
          <SoundButton variant="outline" soundType="click">← {t('home')}</SoundButton>
        </Link>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Язык */}
        <div className="space-y-2">
          <Label htmlFor="language-select" className="text-lg">{t('language')}:</Label>
          <Select value={settings.language} onValueChange={handleLanguageChange}>
            <SelectTrigger id="language-select">
              <SelectValue placeholder={t('language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ru">Русский</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Единицы */}
        <div className="space-y-2">
          <Label className="text-lg">{t('units')}:</Label>
          <div className="p-3 border rounded-md bg-gray-50">
            соток / м²
          </div>
        </div>

        {/* Тип карты */}
        <div className="space-y-2">
          <Label htmlFor="map-type-select" className="text-lg">{t('mapType')}:</Label>
          <Select value={settings.mapType} onValueChange={handleMapTypeChange}>
            <SelectTrigger id="map-type-select">
              <SelectValue placeholder={t('mapType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roadmap">Стандартная</SelectItem>
              <SelectItem value="satellite">Спутник</SelectItem>
              <SelectItem value="hybrid">Гибрид</SelectItem>
              <SelectItem value="terrain">Рельеф</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Звуковые настройки */}
        <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold">🔊 Звуковые эффекты</h3>
          
          {/* Включение/выключение звуков */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-toggle" className="text-base">Включить звуки:</Label>
            <Switch
              id="sound-toggle"
              checked={soundEnabled}
              onCheckedChange={handleSoundToggle}
            />
          </div>

          {/* Громкость */}
          {soundEnabled && (
            <>
              <div className="space-y-2">
                <Label className="text-base">Громкость: {Math.round(soundVolume * 100)}%</Label>
                <Slider
                  value={[soundVolume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Тест звука */}
              <SoundButton 
                onClick={testSound} 
                variant="outline" 
                size="sm"
                soundType="notification"
                className="w-full"
              >
                🎵 Тест звука
              </SoundButton>
            </>
          )}

          {/* Информация о звуках */}
          <div className="text-xs text-gray-600 space-y-1">
            <div>• Звуки воспроизводятся при:</div>
            <div className="ml-2">- Нажатии кнопок</div>
            <div className="ml-2">- Получении GPS</div>
            <div className="ml-2">- Добавлении маркеров</div>
            <div className="ml-2">- Расчете площади</div>
            <div className="ml-2">- Сохранении данных</div>
          </div>
        </div>

        {/* Дополнительные настройки */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">⚙️ Дополнительно</h3>
          
          <SoundButton 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            variant="destructive"
            size="sm"
            soundType="delete"
            className="w-full"
          >
            🗑️ Сбросить все данные
          </SoundButton>
          
          <div className="text-xs text-gray-500 text-center">
            Это удалит все измерения и настройки
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSimple;
