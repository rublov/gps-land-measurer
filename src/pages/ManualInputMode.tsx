import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

const ManualInputMode = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('manualInputMode')}</h1>
      <div className="space-y-6 w-full max-w-sm">
        <div>
          <Label htmlFor="sqMeters">{t('areaInSqMeters')}</Label>
          <Input id="sqMeters" type="number" placeholder="0" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="hectares">{t('areaInHectares')}</Label>
          <Input id="hectares" type="number" placeholder="0" className="mt-1" />
        </div>
        <div className="flex flex-col items-center">
          <Label className="text-lg font-semibold">{t('areaInSotkas')}:</Label>
          <span className="text-2xl font-bold mt-2">0 {t('sotkas')}</span>
        </div>
        <Button className="w-full">{t('calculate')}</Button>
      </div>
      <Link to="/" className="mt-8">
        <Button variant="outline">{t('returnToHome')}</Button>
      </Link>
    </div>
  );
};

export default ManualInputMode;