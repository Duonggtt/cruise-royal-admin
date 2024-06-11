
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Breadcrumb from 'primevue/breadcrumb';
import OverlayPanel from 'primevue/overlaypanel';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $toastr: typeof toastr;
    }
  }
const app = createApp(App)
app.config.globalProperties.$toastr = toastr;
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {ripple: true})
app.use(ToastService);
app.use(ConfirmationService);


app.component('InputText', InputText)
app.component('Password', Password)
app.component('Button', Button)
app.component('Checkbox', Checkbox)
app.component('Toast', Toast)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('Breadcrumb', Breadcrumb)
app.component('OverlayPanel', OverlayPanel)
app.component('Textarea', Textarea)
app.component('Dropdown', Dropdown)
app.component('Dialog', Dialog)
app.component('ConfirmPopup', ConfirmPopup)


app.mount('#app')
