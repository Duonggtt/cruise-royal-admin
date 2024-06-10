
<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import { useToast } from "primevue/usetoast";
import {useAuthStore} from '@/stores/counter';
const toast = useToast();
const checked = ref(false);

const router = useRouter(); 
const user = localStorage.getItem('user');

    function onSubmit() {
        toast.add({ severity: 'error', summary: 'Authentication', detail: `Đăng xuất thành công!`, life: 3000 });
        setTimeout(() => {
            useAuthStore().logout();
        }, 1000);
    }

</script>
<template>
    <div class="container">
        <span class="flex font-semibold text-3xl pb-4">Trang chủ</span>
        <div class="card flex justify-content-between">
            <div class="flex items-center gap-4 ">
                <img class="w-1 h-1 rounded-full" src="/admin-avatar.png" alt="">
                <div class="font-medium dark:text-white mt-2">
                    <div class="font-semibold">ADMIN</div>
                    <div class="text-md text-gray-500 dark:text-gray-400">{{user}}</div>
                </div>
            </div>
            <div>
                <Button label="Đăng xuất" class="text-gray-700 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 rounded-lg text-md px-5 py-2 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600" 
                icon="pi pi-sign-out" iconPos="right" @click="onSubmit"/>
            </div>
        </div>
        <Toast/>
    </div>
</template>