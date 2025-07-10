import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // Keep Link for potential internal links if needed, but remove 'Return to Home'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { loadSettings, saveSettings, AppSettings } from '@/utils/storage';
// import { MadeWithDyad } from "@/components/made-with-dyad"; // Removed MadeWithDyad

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<AppSettings>(loadSettings());

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

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full"> {/* Removed min-h-screen and bg/text colors as Layout handles it */}
      <h1 className="text-3xl font-bold mb-6 text-center">{t('settings')}</h1>
      <div className="space-y-6 w-full max-w-sm">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="language-select" className="text-lg">{t('language')}:</Label>
          <Select value={settings.language} onValueChange={handleLanguageChange}>
            <SelectTrigger id="language-select" className="w-full">
              <SelectValue placeholder={t('language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ru">Русский</SelectItem>
              {/* Add other languages here if supported in i18n.ts */}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="units-display" className="text-lg">{t('units')}:</Label>
          {/* For simplicity, units are fixed to sotkas/m² as per requirements.
              If more unit options were needed, a Select component would be used here. */}
          <span id="units-display" className="text-lg font-semibold p-2 border rounded-md bg-background">
            {t('sotkas')} / {t('squareMeters')}
          </span>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="map-type-select" className="text-lg">{t('mapType')}:</Label>
          <Select value={settings.mapType} onValueChange={handleMapTypeChange}>
            <SelectTrigger id="map-type-select" className="w-full">
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
      </div>
      {/* Removed Link to home as sidebar handles navigation */}
      {/* MadeWithDyad is now in Layout, remove from here */}
    </div>
  );
};

export default Settings;