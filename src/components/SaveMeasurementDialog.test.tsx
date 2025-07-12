import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SaveMeasurementDialog from '../components/SaveMeasurementDialog'

// Мокаем toast
vi.mock('../utils/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Мокаем storage
vi.mock('../utils/storage', () => ({
  saveMeasurement: vi.fn(() => Promise.resolve()),
}))

// Мокаем i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('SaveMeasurementDialog', () => {
  const mockPoints = [
    { lat: 55.7558, lng: 37.6176 },
    { lat: 55.7559, lng: 37.6177 },
    { lat: 55.7560, lng: 37.6178 },
  ]

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    areaSqMeters: 1000,
    areaSotkas: 10,
    coordinates: mockPoints,
  }

  it('должен отображаться когда isOpen = true', () => {
    render(<SaveMeasurementDialog {...defaultProps} />)
    expect(screen.getByText('Сохранить измерение')).toBeInTheDocument()
  })

  it('не должен отображаться когда isOpen = false', () => {
    render(<SaveMeasurementDialog {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Сохранить измерение')).not.toBeInTheDocument()
  })

  it('должен показывать данные измерения', () => {
    render(<SaveMeasurementDialog {...defaultProps} />)
    
    expect(screen.getByText('1 000 м²')).toBeInTheDocument()
    expect(screen.getByText('10 соток')).toBeInTheDocument()
    expect(screen.getByText('3 точки')).toBeInTheDocument()
  })

  it('должен позволять вводить название', async () => {
    const user = userEvent.setup()
    render(<SaveMeasurementDialog {...defaultProps} />)
    
    const nameInput = screen.getByPlaceholderText('Введите название участка')
    await user.type(nameInput, 'Тестовый участок')
    
    expect(nameInput).toHaveValue('Тестовый участок')
  })

  it('должен позволять вводить описание', async () => {
    const user = userEvent.setup()
    render(<SaveMeasurementDialog {...defaultProps} />)
    
    const descriptionInput = screen.getByPlaceholderText('Добавьте описание (необязательно)')
    await user.type(descriptionInput, 'Тестовое описание')
    
    expect(descriptionInput).toHaveValue('Тестовое описание')
  })

  it('должен вызывать onClose при нажатии Отмена', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SaveMeasurementDialog {...defaultProps} onClose={onClose} />)
    
    await user.click(screen.getByText('Отмена'))
    expect(onClose).toHaveBeenCalled()
  })

  it('должен сохранять измерение при нажатии Сохранить', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { saveMeasurement } = await import('../utils/storage')
    
    render(<SaveMeasurementDialog {...defaultProps} onClose={onClose} />)
    
    const nameInput = screen.getByPlaceholderText('Введите название участка')
    await user.type(nameInput, 'Тестовый участок')
    
    await user.click(screen.getByText('Сохранить'))
    
    await waitFor(() => {
      expect(saveMeasurement).toHaveBeenCalledWith({
        name: 'Тестовый участок',
        description: '',
        areaSqMeters: 1000,
        areaSotkas: 10,
        coordinates: mockPoints,
        createdAt: expect.any(String),
        id: expect.any(String),
      })
    })
    
    expect(onClose).toHaveBeenCalled()
  })
})
