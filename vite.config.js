import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/savingMoney/', // ตั้งค่า Base URL ให้ตรงกับชื่อ Repository บน GitHub Pages
  server: {
    port: 3000,
    open: true
  }
})
