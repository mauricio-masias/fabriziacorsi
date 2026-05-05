import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            publicDirectory: 'public_html',
            refresh: true,
        }),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: false,
            },
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/unit/setup.js'],
        include: ['tests/Unit/**/*.test.js'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            include: ['resources/js/**'],
        },
    },
});
