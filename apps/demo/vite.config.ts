import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "react-mini-store": path.resolve(__dirname, "../../packages/react-mini-store/src"),
        },
    },
})
