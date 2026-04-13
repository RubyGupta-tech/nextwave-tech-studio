import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // This redirects local /api calls to your live site, 
            // bypassing the local file analysis errors.
            '/api': {
                target: 'https://dnextwave.com',
                changeOrigin: true,
                secure: true,
            }
        }
    }
})
