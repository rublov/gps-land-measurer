import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { loadMeasurements, deleteMeasurement, clearAllMeasurements, Measurement } from '@/utils/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';
import { Trash2, FileText, FileSpreadsheet } from 'lucide-react'; // Icons for delete and export

const MeasurementHistory = () => {
  const { t } = useTranslation();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const fetchMeasurements = () => {
    setMeasurements(loadMeasurements());
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const handleDelete = (id: string) => {
    deleteMeasurement(id);
    fetchMeasurements(); // Refresh the list
    toast.success(t('deleteMeasurement') + '!');
  };

  const handleClearAll = () => {
    if (window.confirm("Вы уверены, что хотите удалить все измерения?")) {
      clearAllMeasurements();
      fetchMeasurements(); // Refresh the list
      toast.success("Все измерения удалены!");
    }
  };

  // Placeholder for export functions
  const handleExportPdf = (measurement: Measurement) => {
    toast.info(`Экспорт "${measurement.name}" в PDF (не реализовано)`);
    // Logic for PDF export would go here
  };

  const handleExportExcel = (measurement: Measurement) => {
    toast.info(`Экспорт "${measurement.name}" в Excel (не реализовано)`);
    // Logic for Excel export would go here
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 mt-12 text-center">{t('measurementHistory')}</h1>

      {measurements.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">{t('noMeasurementsYet')}</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-4 mb-8">
          {measurements.map((m) => (
            <Card key={m.id} className="w-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{m.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  {t('area')}: {m.areaSotkas.toFixed(2)} {t('sotkas')} ({m.areaSqMeters.toFixed(2)} {t('squareMeters')})
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(m.date), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                </p>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleExportPdf(m)}>
                    <FileText className="h-4 w-4 mr-2" /> {t('exportToPdf')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportExcel(m)}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" /> {t('exportToExcel')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="destructive" className="w-full mt-4" onClick={handleClearAll}>
            {t('clearAll')}
          </Button>
        </div>
      )}

      <Link to="/" className="mt-8 mb-4">
        <Button variant="outline">{t('returnToHome')}</Button>
      </Link>
    </div>
  );
};

export default MeasurementHistory;