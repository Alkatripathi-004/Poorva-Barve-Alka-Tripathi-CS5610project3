import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['sudoku-frontend-l2s9.onrender.com', 'localhost']
  }
})