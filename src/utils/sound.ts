// Система звуков для приложения землемера

export type SoundType = 
  | 'click'         // Обычный клик по кнопкам
  | 'success'       // Успешные действия (сохранение, добавление маркера)
  | 'error'         // Ошибки и предупреждения
  | 'gps-beep'      // Получение GPS координат
  | 'marker-add'    // Добавление маркера на карту
  | 'calculate'     // Расчет площади
  | 'delete'        // Удаление маркеров/измерений
  | 'notification'; // Общие уведомления

class SoundManager {
  private static instance: SoundManager;
  private audioCache: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.7;

  private constructor() {
    this.loadSettings();
    this.preloadSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private loadSettings() {
    try {
      const settings = localStorage.getItem('appSoundSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.enabled = parsed.enabled ?? true;
        this.volume = parsed.volume ?? 0.7;
      }
    } catch (error) {
      console.warn('Ошибка загрузки настроек звука:', error);
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem('appSoundSettings', JSON.stringify({
        enabled: this.enabled,
        volume: this.volume
      }));
    } catch (error) {
      console.warn('Ошибка сохранения настроек звука:', error);
    }
  }

  private preloadSounds() {
    const soundFiles: Record<SoundType, string> = {
      'click': '/sounds/click.mp3',
      'success': '/sounds/success.mp3',
      'error': '/sounds/error.mp3',
      'gps-beep': '/sounds/gps-beep.mp3',
      'marker-add': '/sounds/marker-add.mp3',
      'calculate': '/sounds/calculate.mp3',
      'delete': '/sounds/delete.mp3',
      'notification': '/sounds/notification.mp3'
    };

    Object.entries(soundFiles).forEach(([soundType, filePath]) => {
      try {
        const audio = new Audio(filePath);
        audio.volume = this.volume;
        audio.preload = 'auto';
        
        // Обработка ошибок загрузки
        audio.addEventListener('error', () => {
          console.warn(`Не удалось загрузить звук: ${filePath}`);
        });

        this.audioCache.set(soundType as SoundType, audio);
      } catch (error) {
        console.warn(`Ошибка создания аудио для ${soundType}:`, error);
      }
    });
  }

  public play(soundType: SoundType, options?: { volume?: number; delay?: number }) {
    if (!this.enabled) return;

    try {
      const audio = this.audioCache.get(soundType);
      if (!audio) {
        console.warn(`Звук ${soundType} не найден`);
        return;
      }

      // Клонируем аудио для одновременного воспроизведения
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = options?.volume ?? this.volume;

      const playSound = () => {
        audioClone.currentTime = 0;
        audioClone.play().catch(error => {
          console.warn(`Ошибка воспроизведения звука ${soundType}:`, error);
        });
      };

      if (options?.delay) {
        setTimeout(playSound, options.delay);
      } else {
        playSound();
      }
    } catch (error) {
      console.warn(`Ошибка воспроизведения звука ${soundType}:`, error);
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.saveSettings();
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
    
    // Обновляем громкость всех загруженных звуков
    this.audioCache.forEach(audio => {
      audio.volume = this.volume;
    });
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleEnabled(): boolean {
    this.enabled = !this.enabled;
    this.saveSettings();
    return this.enabled;
  }
}

// Экспортируем singleton instance
export const soundManager = SoundManager.getInstance();

// Удобные функции для быстрого использования
export const playSound = (soundType: SoundType, options?: { volume?: number; delay?: number }) => {
  soundManager.play(soundType, options);
};

export const toggleSound = () => soundManager.toggleEnabled();
export const isSoundEnabled = () => soundManager.isEnabled();
export const setSoundVolume = (volume: number) => soundManager.setVolume(volume);
export const getSoundVolume = () => soundManager.getVolume();
