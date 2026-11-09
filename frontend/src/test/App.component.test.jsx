import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'

const sample = {
  id: 1, name: 'Test Pasta', ingredients: 'Pasta\nSalt',
  instructions: 'Boil and serve.', cookTime: '20 minutes'
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('Recipe Sharing App - React components', () => {
  it('loads and displays recipes from the API', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [sample] })
    render(<App />)
    expect(await screen.findByText('Test Pasta')).toBeInTheDocument()
    expect(screen.getByText('All Recipes (1)')).toBeInTheDocument()
    expect(screen.getByText('Pasta')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/recipes')
  })

  it('submits a recipe and refreshes the recipe list', async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => sample })
      .mockResolvedValueOnce({ ok: true, json: async () => [sample] })
    render(<App />)
    await screen.findByText(/No recipes yet/)
    fireEvent.change(screen.getByPlaceholderText('Recipe Name'), { target: { value: sample.name } })
    fireEvent.change(screen.getByPlaceholderText('Cook Time (e.g., 30 minutes)'), { target: { value: sample.cookTime } })
    fireEvent.change(screen.getByPlaceholderText('Ingredients (one per line)'), { target: { value: sample.ingredients } })
    fireEvent.change(screen.getByPlaceholderText('Cooking Instructions'), { target: { value: sample.instructions } })
    fireEvent.click(screen.getByRole('button', { name: 'Add Recipe' }))
    expect(await screen.findByText(sample.name)).toBeInTheDocument()
    expect(fetch).toHaveBeenNthCalledWith(2, 'http://localhost:5000/api/recipes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: sample.name, ingredients: sample.ingredients,
        instructions: sample.instructions, cookTime: sample.cookTime })
    })
    await waitFor(() => expect(screen.getByPlaceholderText('Recipe Name')).toHaveValue(''))
  })
})
