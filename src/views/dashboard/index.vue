<template>
    <dir v-if="isAdmin">
        <div>
            <div class="pb-4">
                <span class="flex font-semibold text-3xl pb-3">Báo cáo - thống kê</span>
                <Breadcrumb :home="home" :model="items" />
            </div>
            <div class="flex justify-evenly gap-5 w-full">
                <Card class="w-3 px-2 text-gray-500">
                    <template #title>
                        <div class="flex gap-8">
                            <span>
                                Đơn hàng
                            </span>
                            <div>
                                <Button icon="pi pi-shopping-cart text-blue-700 font-bold" disabled class="bg-blue-200 border-none px-2 py-2"></Button>
                            </div>
                        </div>
                    </template>
                    <template #content>
                        <p class="m-0 font-bold text-xl">
                            123 <span class="text-blue-400"> đơn đặt</span>
                        </p>
                    </template>
                    <template #footer>
                        <p class="m-0">
                            <span class="text-green-400">20 new</span> seen last visit
                        </p>
                    </template>
                </Card>
                <Card class="w-3 px-2 text-gray-500">
                    <template #title>
                        <div class="flex gap-8">
                            <span>
                                Doanh thu
                            </span>
                            <div>
                                <Button icon="pi pi-dollar text-orange-700 font-bold" disabled class="bg-orange-200 border-none px-2 py-2"></Button>
                            </div>
                        </div>
                    </template>
                    <template #content>
                        <p class="m-0 font-bold text-xl">
                            240.000.000.000 <span class="text-orange-400"> vnđ</span>
                        </p>
                    </template>
                    <template #footer>
                        <p class="m-0">
                            <span class="text-green-400">+52% </span> seen last visit
                        </p>
                    </template>
                </Card>
                <Card class="w-3 px-2 text-gray-500">
                    <template #title>
                        <div class="flex gap-8">
                            <span>
                                Khách hàng
                            </span>
                            <div>
                                <Button icon="pi pi-user text-blue-700 font-bold" disabled class="bg-cyan-200 border-none px-2 py-2"></Button>
                            </div>
                        </div>
                    </template>
                    <template #content>
                        <p class="m-0 font-bold text-xl">
                            {{ userCount}} <span class="text-cyan-400"> khách hàng</span>
                        </p>
                    </template>
                    <template #footer>
                        <p class="m-0">
                            <span class="text-green-400">2 new</span> seen last visit
                        </p>
                    </template>
                </Card>
                <Card class="w-3 px-2 text-gray-500">
                    <template #title>
                        <div class="flex gap-8">
                            <span>
                                Du thuyền
                            </span>
                            <div>
                                <Button icon="pi pi-shopping-cart text-purple-700 font-bold" disabled class="bg-purple-200 border-none px-2 py-2"></Button>
                            </div>
                        </div>
                    </template>
                    <template #content>
                        <p class="m-0 font-bold text-xl">
                            {{ cruiseCount }} <span class="text-purple-400"> du thuyền</span>
                        </p>
                    </template>
                    <template #footer>
                        <p class="m-0">
                            <span class="text-green-400">3 new</span> seen last visit
                        </p>
                    </template>
                </Card>
            </div>
        </div>
        <div class="mt-5 flex gap-5">
            <div class="card w-full">
                <div class="flex justify-content-between align-items-center mb-5">
                    <h5 class="text-gray-600 text-2xl font-bold">Top du thuyền được thuê nhiều nhất</h5>
                </div>
                <ul class="list-none p-0 m-0">
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Space T-Shirt</span>
                            <div class="mt-1 text-600">Clothing</div>
                        </div>
                        <div class="mt-2 md:mt-0 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-orange-500 h-full" style="width: 50%"></div>
                            </div>
                            <span class="text-orange-500 ml-3 font-medium">%50</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Portal Sticker</span>
                            <div class="mt-1 text-600">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-cyan-500 h-full" style="width: 16%"></div>
                            </div>
                            <span class="text-cyan-500 ml-3 font-medium">%16</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Supernova Sticker</span>
                            <div class="mt-1 text-600">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-pink-500 h-full" style="width: 67%"></div>
                            </div>
                            <span class="text-pink-500 ml-3 font-medium">%67</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Wonders Notebook</span>
                            <div class="mt-1 text-600">Office</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-green-500 h-full" style="width: 35%"></div>
                            </div>
                            <span class="text-green-500 ml-3 font-medium">%35</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Mat Black Case</span>
                            <div class="mt-1 text-600">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-purple-500 h-full" style="width: 75%"></div>
                            </div>
                            <span class="text-purple-500 ml-3 font-medium">%75</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Robots T-Shirt</span>
                            <div class="mt-1 text-600">Clothing</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-teal-500 h-full" style="width: 40%"></div>
                            </div>
                            <span class="text-teal-500 ml-3 font-medium">%40</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="card flex justify-content-center w-full">
                <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
            </div>
        </div>
    </dir>
    <div v-else>
        <Card class="flex text-center pt-2 ">
            <template #title>
                <span class="text-3xl text-gray-500">Unauthenticated!</span>
            </template>
        </Card>
    </div>
</template>

<script lang="ts" >
import Vue from 'vue'
import {useAuthStore} from '@/stores/counter';
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { API_URL } from '@/stores/config'; 

const api_url = API_URL;


export default {
    setup() {
        const confirm = useConfirm();

        // ...

        return {
            confirm,
        }
    },
    computed: {
        isAdmin() {
            return useAuthStore().isAdmin;
        },
    },
    data() {
        return {
            items: ref([
                { label: 'Báo cáo - thống kê' }, 
            ]),
            home: ref({
                icon: 'pi pi-home'
            }),
            userCount: ref(0),
            cruiseCount: ref(0),
        };
    },
    mounted() {
        this.fetchUsers();
        this.fetchCruise();
    },
    methods: {
        fetchCruise() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cruises/auth`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(res => {
                // If the token has expired
               if (res.status === 403) {
                this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                //  toast.add({ severity: 'error', summary: 'Authentication', detail: `Phiên đăng nhập hết hạn!`, life: 3000 });
                 useAuthStore().logout();
               }
                return res;
            })
            .then(res => res.json())
            .then(data => {
                this.cruiseCount = data.length;
                console.log(this.cruiseCount);
            })
            .catch(error => {
                console.log("Error fetching cruise list!", error);
            });
        },
        fetchUsers() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/users`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}` // Use the token here
                }
            })
            .then(res => {
                // If the token has expired
               if (res.status === 403) {
                this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                //  toast.add({ severity: 'error', summary: 'Authentication', detail: `Phiên đăng nhập hết hạn!`, life: 3000 });
                 useAuthStore().logout();
               }
                return res;
            })
            .then(res => res.json())
            .then(data => {
                this.userCount = data.length;
                console.log(this.userCount);
            })
            .catch(error => {
                // router.replace("/");
                console.log("Error fetching class list!", error);
            });
        }
    },
};
</script>