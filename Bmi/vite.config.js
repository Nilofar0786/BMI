import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/BMI/', // इसे जोड़ना ज़रूरी है ताकि GitHub आपके एसेट्स ढूंढ सके
})
