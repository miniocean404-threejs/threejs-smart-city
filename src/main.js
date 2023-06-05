import { createApp } from 'vue'
import '@/css/base/base.scss'
import App from './App.vue'
import store from '@/store/index.js'
import router from '@/router/index.js'

createApp(App).use(router).use(store).mount('#app')
