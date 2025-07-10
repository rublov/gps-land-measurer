import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { convertSqMetersToSotkas } from '@/utils/geometry';
import { toast } from 'sonner';
import SaveMeasurementDialog from '@/components/SaveMeasurementDialog';

const ManualInputMode = () => {
  const { t } = useTranslation();
  const [sqMetersInput, setSqMetersInput] = useState<string>('');
  const [hectaresInput, setHectaresInput] = useState<string>('');
  const [calculatedSotkas, setCalculatedSotkas] = useState<number>(0);
  const [calculatedSqMeters, setCalculatedSqMeters] = useState<number>(0);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);


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
      toast.error(t('invalidInput'));
      setHectaresInput('');
      convertAndSetSotkas(0);
      return;
    }

    setHectaresInput((numValue / 10000).toFixed(4)); // 1 hectare = 10000 m²
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
      toast.error(t('invalidInput'));
      setSqMetersInput('');
      convertAndSetSotkas(0);
      return;
    }

    const sqM = numValue * 10000; // 1 hectare = 10000 m²
    setSqMetersInput(sqM.toFixed(2));
    convertAndSetSotkas(sqM);
  };

  const handleOpenSaveDialog = () => {
    if (calculatedSqMeters > 0) {
      setIsSaveDialogOpen(true);
    } else {
      toast.error(t('invalidInput'));
    }
  };

  const handleSaveSuccess = () => {
    setSqMetersInput('');
    setHectaresInput('');
    setCalculatedSotkas(0);
    setCalculatedSqMeters(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('manualInputMode')}</h1>
      <div className="space-y-6 w-full max-w-sm">
        <div>
          <Label htmlFor="sqMeters">{t('areaInSqMeters')}</Label>
          <Input
            id="sqMeters"
            type="number"
            placeholder="0"
            className="mt-1"
            value={sqMetersInput}
            onChange={handleSqMetersChange}
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="hectares">{t('areaInHectares')}</Label>
          <Input
            id="hectares"
            type="number"
            placeholder="0"
            className="mt-1"
            value={hectaresInput}
            onChange={handleHectaresChange}
            min="0"
          />
        </div>
        <div className="flex flex-col items-center">
          <Label className="text-lg font-semibold">{t('areaInSotkas')}:</Label>
          <span className="text-2xl font-bold mt-2">
            {calculatedSotkas.toFixed(2)} {t('sotkas')}
          </span>
        </div>
        <Button className="w-full" onClick={handleOpenSaveDialog} disabled={calculatedSqMeters === 0}>
          {t('saveMeasurement')}
        </Button>
      </div>

      <SaveMeasurementDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        areaSqMeters={calculatedSqMeters}
        areaSotkas={calculatedSotkas}
      />
    </div>
  );
};

export default ManualInputMode;