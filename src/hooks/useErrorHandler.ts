import { useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { GPSError } from '@/types';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  customMessage?: string;
}

export const useErrorHandler = () => {
  const { t } = useTranslation();

  const handleError = useCallback((
    error: Error | GPSError | unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const { showToast = true, logError = true, customMessage } = options;

    if (logError) {
      console.error('Error occurred:', error);
    }

    if (showToast) {
      let message = customMessage || t('genericError');

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        message = (error as GPSError).message;
      }

      toast.error(message);
    }
  }, [t]);

  const handleGPSError = useCallback((error: GeolocationPositionError) => {
    let message = t('gpsAccessError');

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = t('gpsPermissionDenied');
        break;
      case error.POSITION_UNAVAILABLE:
        message = t('gpsPositionUnavailable');
        break;
      case error.TIMEOUT:
        message = t('gpsTimeout');
        break;
      default:
        message = t('gpsGenericError');
    }

    toast.error(message);
    console.error('GPS Error:', error);
  }, [t]);

  const handleNetworkError = useCallback((error: Error) => {
    toast.error(t('networkError'));
    console.error('Network Error:', error);
  }, [t]);

  const handleValidationError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  return {
    handleError,
    handleGPSError,
    handleNetworkError,
    handleValidationError
  };
};
