
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-light-indigo/theme.css' // theme
import 'primevue/resources/primevue.min.css'; // core css
import 'primeicons/primeicons.css' // icons
import '@/assets/styles.scss';

import InputText from 'primevue/inputtext';
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {ripple: true})
app.use(ToastService);
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Button', Button)
app.component('Checkbox', Checkbox)
app.component('Toast', Toast)

app.mount('#app')
