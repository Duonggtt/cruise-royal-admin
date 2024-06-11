<script setup>
import { useLayout } from '@/layout/composables/layout';
import { reactive, ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router'; 
import { useToast } from "primevue/usetoast";
import {useAuthStore} from '@/stores/counter';
const toast = useToast();

const { layoutConfig } = useLayout();
const checked = ref(false);

const logoUrl = computed(() => {
    return `/Logo-Cruise-Royal.svg`;
});

const router = useRouter(); 
const user = reactive({
      username: '',
      password: ''
});

    function onSubmit() {
        if(user.username !== '' && user.password !== '') {
            useAuthStore().login(user.username, user.password).then((res) => {
                if(res) {
                    toast.add({ severity: 'success', summary: 'Authentication', detail: `Chào mừng ${user.username} quay lại!`, life: 3000 });
                }else {
                    const isAdminOrEmployee = localStorage.getItem('isAdminOrEmployee');
                    if(isAdminOrEmployee === 'false') {
                        toast.add({ severity: 'error', summary: 'Authorization', detail: 'Không có quyền truy cập!', life: 3000 });
                        localStorage.removeItem('isAdminOrEmployee');
                    }else {
                        toast.add({ severity: 'error', summary: 'Authentication', detail: 'Username hoặc password không đúng!', life: 3000 });
                    }
                }
            })
        }else {
            toast.add({ severity: 'error', summary: 'Authentication', detail: 'Vui lòng nhập username và password!', life: 3000 });
        }
    }

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Login</div>
                        <span class="text-600 font-medium">Cruise Royal Admin</span>
                    </div>

                    <div>
                        <label for="username" class="block text-900 text-xl font-medium mb-2">Tên đăng nhập</label>
                        <InputText id="username" type="text" placeholder="Tên đăng nhập" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="user.username" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Mật khẩu</label>
                        <Password id="password1" v-model="user.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <Button label="Sign In" class="w-full p-3 text-xl mt-4" type="submit" @click="onSubmit"></Button>
                    </div>
                </div>
            </div>
        </div>
        <Toast />
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>