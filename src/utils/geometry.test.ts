import { describe, it, expect } from 'vitest'
import { 
  calculateDistance, 
  calculateArea, 
  calculatePerimeter 
} from '../utils/geometry'
import { LatLng } from '../types'

describe('Geometry Utils', () => {
  const testPoints: LatLng[] = [
    { lat: 55.7558, lng: 37.6176 }, // Москва
    { lat: 55.7559, lng: 37.6177 }, // Рядом с Москвой
    { lat: 55.7560, lng: 37.6178 }, // Еще рядом
    { lat: 55.7561, lng: 37.6179 }, // И еще рядом
  ]

  describe('calculateDistance', () => {
    it('должен вычислить расстояние между двумя точками', () => {
      const distance = calculateDistance(testPoints[0], testPoints[1])
      expect(distance).toBeGreaterThan(0)
      expect(distance).toBeLessThan(100) // Должно быть небольшое расстояние
    })

    it('должен вернуть 0 для одинаковых точек', () => {
      const distance = calculateDistance(testPoints[0], testPoints[0])
      expect(distance).toBe(0)
    })

    it('должен работать с отрицательными координатами', () => {
      const point1: LatLng = { lat: -55.7558, lng: -37.6176 }
      const point2: LatLng = { lat: -55.7559, lng: -37.6177 }
      const distance = calculateDistance(point1, point2)
      expect(distance).toBeGreaterThan(0)
    })
  })

  describe('calculatePerimeter', () => {
    it('должен вычислить периметр для массива точек', () => {
      const perimeter = calculatePerimeter(testPoints)
      expect(perimeter).toBeGreaterThan(0)
    })

    it('должен вернуть 0 для менее чем 2 точек', () => {
      expect(calculatePerimeter([])).toBe(0)
      expect(calculatePerimeter([testPoints[0]])).toBe(0)
    })

    it('должен вычислить периметр для двух точек', () => {
      const perimeter = calculatePerimeter([testPoints[0], testPoints[1]])
      const directDistance = calculateDistance(testPoints[0], testPoints[1])
      expect(perimeter).toBeCloseTo(directDistance, 5)
    })
  })

  describe('calculateArea', () => {
    it('должен вычислить площадь для квадрата', () => {
      // Создаем примерный квадрат
      const square: LatLng[] = [
        { lat: 55.0000, lng: 37.0000 },
        { lat: 55.0001, lng: 37.0000 },
        { lat: 55.0001, lng: 37.0001 },
        { lat: 55.0000, lng: 37.0001 },
      ]
      
      const area = calculateArea(square)
      expect(area).toBeGreaterThan(0)
    })

    it('должен вернуть 0 для менее чем 3 точек', () => {
      expect(calculateArea([])).toBe(0)
      expect(calculateArea([testPoints[0]])).toBe(0)
      expect(calculateArea([testPoints[0], testPoints[1]])).toBe(0)
    })

    it('должен вычислить площадь треугольника', () => {
      const triangle = [testPoints[0], testPoints[1], testPoints[2]]
      const area = calculateArea(triangle)
      expect(area).toBeGreaterThan(0)
    })
  })
})
