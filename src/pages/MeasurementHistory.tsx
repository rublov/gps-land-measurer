import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // Keep Link for potential internal links if needed, but remove 'Return to Home'
import { loadMeasurements, deleteMeasurement, clearAllMeasurements, Measurement } from '@/utils/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';
import { Trash2, FileText, FileSpreadsheet } from 'lucide-react'; // Icons for delete and export
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MadeWithDyad } from "@/components/made-with-dyad"; // Import MadeWithDyad

const MeasurementHistory = () => {
  const { t } = useTranslation();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [measurementToDelete, setMeasurementToDelete] = useState<string | null>(null);


  const fetchMeasurements = () => {
    setMeasurements(loadMeasurements());
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const handleDeleteClick = (id: string) => {
    setMeasurementToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (measurementToDelete) {
      deleteMeasurement(measurementToDelete);
      fetchMeasurements(); // Refresh the list
      toast.success(t('deleteMeasurement') + '!');
      setMeasurementToDelete(null);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleClearAll = () => {
    clearAllMeasurements();
    fetchMeasurements(); // Refresh the list
    toast.success("Все измерения удалены!");
    setIsClearAllConfirmOpen(false); // Close dialog after action
  };

  const handleExportPdf = async (measurement: Measurement) => {
    toast.info(`Генерация PDF для "${measurement.name}"...`);
    try {
      // Create a temporary div to render the content for PDF
      const content = document.createElement('div');
      content.style.padding = '20px';
      content.style.fontFamily = 'Arial, sans-serif';
      content.innerHTML = `
        <h1 style="font-size: 24px; margin-bottom: 10px;">${t('appName')} - ${t('saveMeasurement')}</h1>
        <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${t('plotName')}: ${measurement.name}</p>
        <p style="font-size: 16px; margin-bottom: 5px;">${t('area')}: ${measurement.areaSotkas.toFixed(2)} ${t('sotkas')} (${measurement.areaSqMeters.toFixed(2)} ${t('squareMeters')})</p>
        <p style="font-size: 14px; color: #555;">${format(new Date(measurement.date), 'dd MMMM yyyy, HH:mm', { locale: ru })}</p>
        <p style="font-size: 12px; color: #888; margin-top: 20px;">Примечание: Карта не включена в PDF-экспорт.</p>
      `;
      document.body.appendChild(content); // Temporarily add to DOM for html2canvas

      const canvas = await html2canvas(content, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // A4 width - 20mm margin
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10; // Initial position from top

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${measurement.name}_${format(new Date(measurement.date), 'yyyyMMdd')}.pdf`);
      document.body.removeChild(content); // Remove temporary div
      toast.success(t('exportToPdf') + ' ' + t('save') + '!');
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error(t('saveExportError'));
    }
  };

  const handleExportExcel = (measurement: Measurement) => {
    try {
      const headers = [t('plotName'), t('areaInSotkas'), t('areaInSqMeters'), t('date')];
      const data = [
        measurement.name,
        measurement.areaSotkas.toFixed(2),
        measurement.areaSqMeters.toFixed(2),
        format(new Date(measurement.date), 'dd.MM.yyyy HH:mm', { locale: ru }),
      ];

      const csvContent = [headers.join(','), data.join(',')].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) { // Feature detection for download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${measurement.name}_${format(new Date(measurement.date), 'yyyyMMdd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t('exportToExcel') + ' ' + t('save') + '!');
      } else {
        toast.error(t('saveExportError') + ': ' + 'Ваш браузер не поддерживает скачивание файлов.');
      }
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error(t('saveExportError'));
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full"> {/* Removed min-h-screen and bg/text colors as Layout handles it */}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(m.id)}
                    aria-label={`Удалить измерение ${m.name}`} // Added aria-label
                  >
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
                  <Button variant="outline" size="sm" onClick={() => handleExportPdf(m)} aria-label={`Экспорт ${m.name} в PDF`}>
                    <FileText className="h-4 w-4 mr-2" /> {t('exportToPdf')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportExcel(m)} aria-label={`Экспорт ${m.name} в Excel`}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" /> {t('exportToExcel')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <AlertDialog open={isClearAllConfirmOpen} onOpenChange={setIsClearAllConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full mt-4">
                {t('clearAll')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие безвозвратно удалит все сохраненные измерения.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>Удалить все</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Removed Link to home as sidebar handles navigation */}

      {/* AlertDialog for individual measurement deletion */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие безвозвратно удалит выбранное измерение.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* MadeWithDyad is now in Layout, remove from here */}
    </div>
  );
};

export default MeasurementHistory;