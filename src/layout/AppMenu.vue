<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Báo cáo - Thống kê',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
        label: 'Quản lý người dùng',
        items: [
            { label: 'Danh sách người dùng', icon: 'pi pi-fw pi-user', to: '/users' }
        ]
    },
    {
        label: 'Quản lý du thuyền',
        items: [
            { label: 'Du thuyền', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
            { label: 'Phòng ngủ', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
            { label: 'Danh mục', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
            { label: 'Danh sách phòng', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
        ]
    },
    {
        label: 'Quản lý đặt vé',
        items: [
            { label: 'Danh sách đơn đặt', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
            { label: 'Thêm mới ...', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' }
        ]
    },
    {
        label: 'Quản lý cái khác...',
        items: [
            {
                label: 'Submenu 1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 1.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 1.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            },
            {
                label: 'Submenu 2',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 2.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 2.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            }
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu space-y-2">
        <template v-for="(item, i) in model" :key="i">
            <app-menu-item v-if="!item.separator" :item="item" :index="i" class="font-normal text-gray-500 hover:text-gray-700 "></app-menu-item>
            <li v-if="item.separator" class="my-2 h-px bg-gray-200"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
