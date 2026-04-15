import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Points to the LIVE Vercel deployment for real database access
            '/api': {
                target: 'https://dnextwave.com',
                changeOrigin: true,
                secure: true,
            }
        }
    }
})
