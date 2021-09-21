/**
 * Main js file with required imports.
 * Initialized global web3 variable  
 */
import { createApp } from 'vue'
import App from './App.vue'
import Web3 from 'xdc3'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/styles/style.css'
import 'vue-loading-overlay/dist/vue-loading.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'datatables.net/js/jquery.dataTables.min.js'
import 'datatables.net-responsive/js/dataTables.responsive.min.js'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import 'datatables.net-bs5/js/dataTables.bootstrap5.min.js'
import '@/assets/js/dt-sort-date.js'

import "noty/lib/noty.css";
import "noty/lib/themes/metroui.css";
import {LOADER_COLOR} from '@/assets/js/config.js'

/**
 * Created the application
 */
const app = createApp(App)

/**
 * Initializes the router
 */
app.use(router)

app.mount('#app')

if (window.ethereum) {
    app.config.globalProperties.$web3js = new Web3(window.ethereum);
    window.ethereum.enable();
}

app.config.globalProperties.$loaderColor = LOADER_COLOR;