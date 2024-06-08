
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/mdc-light-indigo/theme.css' // theme
import 'primevue/resources/primevue.min.css'; // core css
import 'primeicons/primeicons.css' // icons
import '@/assets/styles.scss';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {ripple: true})

app.mount('#app')
