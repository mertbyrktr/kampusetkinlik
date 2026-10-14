import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // CSS küçültücüsünün büyük öğrenci numarasını yuvarlayıp tema rengini değiştirmesini önle.
  build: {
    cssMinify: false,
  },
})
