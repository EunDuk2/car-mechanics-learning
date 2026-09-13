import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({build:{rollupOptions:{input:{main:resolve(import.meta.dirname,'index.html'),assembly:resolve(import.meta.dirname,'assembly.html'),mechanics:resolve(import.meta.dirname,'mechanics.html')}}}});
