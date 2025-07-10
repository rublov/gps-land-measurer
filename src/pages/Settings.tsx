import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('settings')}</h1>
      <div className="space-y-4 w-full max-w-sm">
        <div className="flex justify-between items-center">
          <span className="text-lg">{t('language')}:</span>
          <span className="text-lg font-semibold">Русский</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg">{t('units')}:</span>
          <span className="text-lg font-semibold">{t('sotkas')} / {t('squareMeters')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg">{t('mapType')}:</span>
          <span className="text-lg font-semibold">Стандартная</span>
        </div>
      </div>
      <Link to="/" className="mt-8">
        <Button variant="outline">{t('returnToHome')}</Button>
      </Link>
    </div>
  );
};

export default Settings;