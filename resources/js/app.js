import { createApp } from 'vue'
import App from './App.vue'
import '../css/app.css'
import { printSignature } from './lib/signature'

printSignature()

createApp(App).mount('#app')
