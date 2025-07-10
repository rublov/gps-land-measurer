import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GpsMarkerMode = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('gpsMarkerMode')}</h1>
      <p className="text-lg mb-8 text-center">
        {t('placeMarker')}... ({t('gpsAccuracy')}: 0 м)
      </p>
      <div className="space-y-4 w-full max-w-sm">
        <Button className="w-full">{t('placeMarker')}</Button>
        <Button className="w-full" variant="secondary">{t('deleteLast')}</Button>
        <Button className="w-full" variant="destructive">{t('clearAll')}</Button>
        <Button className="w-full" disabled>{t('calculateArea')}</Button>
      </div>
      <Link to="/" className="mt-8">
        <Button variant="outline">{t('returnToHome')}</Button>
      </Link>
    </div>
  );
};

export default GpsMarkerMode;