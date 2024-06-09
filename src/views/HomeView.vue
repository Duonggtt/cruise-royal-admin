
<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import { useToast } from "primevue/usetoast";
import {useAuthStore} from '@/stores/counter';
const toast = useToast();
const checked = ref(false);

const router = useRouter(); 

    function onSubmit() {
        toast.add({ severity: 'error', summary: 'Authentication', detail: `Đăng xuất thành công!`, life: 3000 });
        setTimeout(() => {
            useAuthStore().logout();
        }, 1000);
    }

</script>
<template>
    <div>
        <h1 class="text-2xl font-sans font-bold">Trang chủ</h1>
        <Button label="Đăng xuất" class="w-full p-3 text-xl" @click="onSubmit"></Button>
        <Toast/>
    </div>
</template>