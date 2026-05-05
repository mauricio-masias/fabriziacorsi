import { createApp } from 'vue'
import App from './App.vue'
import '../css/app.css'

const el = document.getElementById('app')
window.__env = {
    apiUrl: el.dataset.apiurl ?? 'http://localhost:4040/api/v1',
    gtmId: el.dataset.gtmid ?? 'GTM-XXXXXXX',
}

createApp(App).mount(el)
