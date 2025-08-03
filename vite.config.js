import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    publicPath: process.env.NODE_ENV === "production" ? "horse_racing" : "/",
    base: 'horse_racing',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    plugins: [
        vue(),
        svgLoader()
    ]
})
