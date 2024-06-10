<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import {useAuthStore} from '@/stores/counter';

const { layoutConfig, onMenuToggle } = useLayout();
import { useToast } from "primevue/usetoast";
const toast = useToast();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
function onSubmit() {
        toast.add({ severity: 'error', summary: 'Authentication', detail: `Đăng xuất thành công!`, life: 3000 });
        setTimeout(() => {
            useAuthStore().logout();
        }, 1000);
    }
const op = ref();
onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `/Logo-Cruise-Royal.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const toggle = (event) => {
    op.value.toggle(event);
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/home" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span class="text-gray-700 font-semibold text-2xl">CR-Admin</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="toggle" class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button>
            <OverlayPanel ref="op">
                <div class="flex flex-column gap-3 w-11rem">
                    <div>
                        <span class="font-medium text-900 block mb-2">Setting...</span>
                        <hr>
                        <Button label="Đăng xuất" class="text-gray-700 bg-white border border-gray-300 focus:outline-none ml-1 hover:bg-gray-100 rounded-lg text-md px-5 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600" 
                            icon="pi pi-sign-out" iconPos="right" @click="onSubmit"/>
                    </div>
                </div>
            </OverlayPanel>
        </div>
        <Toast/>
    </div>
</template>

<style lang="scss" scoped></style>
