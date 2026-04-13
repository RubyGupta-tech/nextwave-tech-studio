import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // Prevent Vite from trying to process serverless functions in /api
    server: {
        watch: {
            ignored: ['**/api/**'],
        },
    },
})
