// Простой логгер для отслеживания ошибок
interface ErrorLog {
  timestamp: string;
  error: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: ErrorLog[] = [];
  
  private constructor() {
    // Слушаем глобальные ошибки
    window.addEventListener('error', (event) => {
      this.logError(event.error, {
        context: 'Global Error Handler',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Слушаем необработанные Promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(event.reason, {
        context: 'Unhandled Promise Rejection',
      });
    });
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  public logError(error: Error | string, context?: Record<string, any>) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...context,
    };

    this.errors.push(errorLog);
    
    // Ограничиваем количество ошибок в памяти
    if (this.errors.length > 100) {
      this.errors.shift();
    }

    // Логируем в консоль в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorLog);
    }

    // Сохраняем в localStorage для возможного отправления позже
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('app_error_logs', JSON.stringify(this.errors));
    } catch (e) {
      console.warn('Failed to save error logs to localStorage:', e);
    }
  }

  public getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  public clearErrors() {
    this.errors = [];
    localStorage.removeItem('app_error_logs');
  }

  public async sendErrorsToServer(endpoint: string) {
    if (this.errors.length === 0) return;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errors: this.errors,
          appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
        }),
      });

      if (response.ok) {
        this.clearErrors();
      }
    } catch (error) {
      console.error('Failed to send errors to server:', error);
    }
  }
}

// Экспортируем синглтон
export const errorLogger = ErrorLogger.getInstance();

// Удобные функции для использования в компонентах
export const logError = (error: Error | string, context?: Record<string, any>) => {
  errorLogger.logError(error, context);
};

export const logGPSError = (error: Error | string, position?: GeolocationPosition) => {
  errorLogger.logError(error, {
    context: 'GPS Error',
    position: position ? {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
    } : undefined,
  });
};

export const logMeasurementError = (error: Error | string, measurement?: any) => {
  errorLogger.logError(error, {
    context: 'Measurement Error',
    measurement: measurement ? {
      points: measurement.points?.length || 0,
      area: measurement.area,
      perimeter: measurement.perimeter,
    } : undefined,
  });
};
