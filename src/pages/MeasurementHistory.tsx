import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MeasurementHistory = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 mt-12 text-center">{t('measurementHistory')}</h1>
      <div className="flex-grow flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">{t('noMeasurementsYet')}</p>
      </div>
      <Link to="/" className="mt-8 mb-4">
        <Button variant="outline">{t('returnToHome')}</Button>
      </Link>
    </div>
  );
};

export default MeasurementHistory;