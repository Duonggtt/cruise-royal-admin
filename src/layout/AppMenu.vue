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
            { label: 'Người dùng', icon: 'pi pi-fw pi-user', to: '/users' }
        ]
    },
    {
        label: 'Quản lý du thuyền',
        items: [
            { label: 'Du thuyền', icon: 'pi pi-prime', to: '/cruises' },
            { label: 'Phòng ngủ', icon: 'pi pi-slack', to: '/cabins' },
            { label: 'Danh mục', icon: 'pi pi-bookmark', to: '/tags' },
            { label: 'Bài viết', icon: 'pi pi-th-large', to: '/sections' },
            { label: 'Luật lệ', icon: 'pi pi-book', to: '/rules' },
        ]
    },
    {
        label: 'Quản lý địa điểm',
        items: [
            { label: 'Lộ trình', icon: 'pi pi-map', to: '/locations' },
        ]
    },
    {
        label: 'Quản lý chủ sở hữu',
        items: [
            { label: 'Các chủ sở hữu', icon: 'pi pi-fw pi-users', to: '/owners' },
        ]
    },
    {
        label: 'Quản lý đặt vé',
        items: [
            { label: 'Đơn đặt', icon: 'pi pi-fw pi-cart-plus', to: '/bookings' },
            { label: 'Lịch sử', icon: 'pi pi-fw pi-history', to: '/historys' }
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
