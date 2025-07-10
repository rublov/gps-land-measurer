import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { saveMeasurement, Measurement } from '@/utils/storage';

interface SaveMeasurementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  areaSqMeters: number;
  areaSotkas: number;
  coordinates?: { lat: number; lng: number }[];
  onSaveSuccess?: () => void;
}

const SaveMeasurementDialog: React.FC<SaveMeasurementDialogProps> = ({
  isOpen,
  onClose,
  areaSqMeters,
  areaSotkas,
  coordinates,
  onSaveSuccess,
}) => {
  const { t } = useTranslation();
  const [plotName, setPlotName] = useState<string>('');

  const handleSave = () => {
    if (!plotName.trim()) {
      toast.error(t('invalidInput'));
      return;
    }

    const newMeasurement: Measurement = {
      id: Date.now().toString(),
      name: plotName.trim(),
      areaSqMeters: parseFloat(areaSqMeters.toFixed(2)),
      areaSotkas: parseFloat(areaSotkas.toFixed(2)),
      date: new Date().toISOString(),
      coordinates: coordinates,
    };

    saveMeasurement(newMeasurement);
    toast.success(t('saveMeasurement') + ' ' + t('save') + '!');
    setPlotName('');
    onClose();
    onSaveSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('saveMeasurement')}</DialogTitle>
          <DialogDescription>
            {t('currentArea')}: {areaSotkas.toFixed(2)} {t('sotkas')} ({areaSqMeters.toFixed(2)} {t('squareMeters')})
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="plotName" className="text-right">
              {t('plotName')}
            </Label>
            <Input
              id="plotName"
              value={plotName}
              onChange={(e) => setPlotName(e.target.value)}
              className="col-span-3"
              placeholder={t('plotName')}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave}>{t('save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveMeasurementDialog;