import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logGPSError } from '../utils/errorLogger'

// Мокаем геолокацию
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
}

// Мокаем navigator.geolocation
Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})

describe('GPS Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GPS Support Detection', () => {
    it('должен определить поддержку GPS', () => {
      expect(navigator.geolocation).toBeDefined()
      expect(typeof navigator.geolocation.getCurrentPosition).toBe('function')
    })
  })

  describe('GPS Position Request', () => {
    it('должен успешно получить позицию', async () => {
      const mockPosition: GeolocationPosition = {
        coords: {
          latitude: 55.7558,
          longitude: 37.6176,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
        toJSON: () => ({}),
      }

      mockGeolocation.getCurrentPosition.mockImplementation((success: (pos: GeolocationPosition) => void) => {
        success(mockPosition)
      })

      const getGPSPosition = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          })
        })
      }

      const position = await getGPSPosition()
      
      expect(position.coords.latitude).toBe(55.7558)
      expect(position.coords.longitude).toBe(37.6176)
      expect(position.coords.accuracy).toBe(10)
    })

    it('должен обработать ошибку GPS', async () => {
      const mockError = {
        code: 1,
        message: 'User denied Geolocation',
      }

      mockGeolocation.getCurrentPosition.mockImplementation((success: any, error: (err: any) => void) => {
        error(mockError)
      })

      const getGPSPosition = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          })
        })
      }

      await expect(getGPSPosition()).rejects.toEqual(mockError)
    })

    it('должен логировать GPS ошибки', () => {
      const mockError = new Error('GPS Error')
      const mockPosition: GeolocationPosition = {
        coords: {
          latitude: 55.7558,
          longitude: 37.6176,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
        toJSON: () => ({}),
      }

      // Мокаем логгер
      const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      logGPSError(mockError, mockPosition)

      expect(logSpy).toHaveBeenCalled()
      
      logSpy.mockRestore()
    })
  })

  describe('GPS Accuracy Validation', () => {
    it('должен проверить точность GPS', () => {
      const validateGPSAccuracy = (accuracy: number): boolean => {
        return accuracy <= 20 // Точность в метрах
      }

      expect(validateGPSAccuracy(5)).toBe(true)
      expect(validateGPSAccuracy(15)).toBe(true)
      expect(validateGPSAccuracy(25)).toBe(false)
      expect(validateGPSAccuracy(100)).toBe(false)
    })

    it('должен предупредить о низкой точности', () => {
      const checkGPSAccuracy = (accuracy: number): { isGood: boolean; message: string } => {
        if (accuracy <= 5) {
          return { isGood: true, message: 'Отличная точность GPS' }
        } else if (accuracy <= 15) {
          return { isGood: true, message: 'Хорошая точность GPS' }
        } else if (accuracy <= 30) {
          return { isGood: false, message: 'Умеренная точность GPS' }
        } else {
          return { isGood: false, message: 'Низкая точность GPS' }
        }
      }

      expect(checkGPSAccuracy(3)).toEqual({ isGood: true, message: 'Отличная точность GPS' })
      expect(checkGPSAccuracy(10)).toEqual({ isGood: true, message: 'Хорошая точность GPS' })
      expect(checkGPSAccuracy(25)).toEqual({ isGood: false, message: 'Умеренная точность GPS' })
      expect(checkGPSAccuracy(50)).toEqual({ isGood: false, message: 'Низкая точность GPS' })
    })
  })
})
