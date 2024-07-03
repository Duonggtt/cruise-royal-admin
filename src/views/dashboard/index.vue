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
                            {{ countBooking }} <span class="text-blue-400"> đơn đặt</span>
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
                            {{ totalRevenue }} <span class="text-orange-400"> vnđ</span>
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
                    <li v-for="cruise in topCruises" :key="cruise.id" class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">{{ cruise.name }}</span>
                            <div class="mt-1 text-600">{{ formatPrice(cruise.price) }} VNĐ</div>
                        </div>
                        <div class="mt-2 md:mt-0 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div :class="getRandomColor()" class="h-full" :style="{ width: getRandomPercentage() + '%' }"></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="card w-full">
                <div class="flex justify-content-between align-items-center mb-2">
                    <h5 class="text-gray-600 text-2xl font-bold">Trạng thái các đơn đặt</h5>
                </div>
                <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-96" />
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
            chartData: {
                labels: ['Đã đặt', 'Đang đặt'],
                datasets: [
                {
                    data: [1, 1],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                    ]
                }
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            },
            items: ref([
                { label: 'Báo cáo - thống kê' }, 
            ]),
            home: ref({
                icon: 'pi pi-home'
            }),
            userCount: ref(0),
            cruiseCount: ref(0),
            topCruises: [{id: '', name: '', price: 0}],
            countBooking: 0,
            totalRevenue: 0,
            countBookingStatusTrue: 0,
            countBookingStatusFalse: 0,
        };
    },
    mounted() {
        this.fetchUsers();
        this.fetchCruise();
        this.fetchTopCruises();
        this.getCountBooking();
        this.getTotalRevenue();
        this.getCountBookingStatusFalse();
        this.getCountBookingStatusTrue();
        this.setDataChart();
    },
    watch: {
        countBookingStatusFalse(newVal) {
            if (newVal !== null) this.setDataChart();
        },
        countBookingStatusTrue(newVal) {
            if (newVal !== null) this.setDataChart();
        }
    },
    methods: {
        setDataChart() {
            this.chartData.datasets[0].data = [this.countBookingStatusFalse, this.countBookingStatusTrue];
        },
        getCountBookingStatusFalse() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/count-booking-false`;
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
                this.countBookingStatusFalse = data;
            })
            .catch(error => {
                console.log("Error fetching total revenue!", error);
            });
        },
        getCountBookingStatusTrue() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/count-booking-true`;
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
                this.countBookingStatusTrue = data;
            })
            .catch(error => {
                console.log("Error fetching total revenue!", error);
            });
        },
        formatNumberAsCurrency(number: any) {
            return number.toLocaleString('vi-VN');
        },
        getCountBooking() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/count-booking`;
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
                this.countBooking = data;
            })
            .catch(error => {
                console.log("Error fetching total revenue!", error);
            });
        },
        getTotalRevenue() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/total-revenue`;
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
                this.totalRevenue = this.formatNumberAsCurrency(data);
            })
            .catch(error => {
                console.log("Error fetching total revenue!", error);
            });
        },
        fetchTopCruises() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cruises/top-featured`;
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
                this.topCruises = data;
            })
            .catch(error => {
                console.log("Error fetching cruise list!", error);
            });
        },
        formatPrice(price: any) {
            return new Intl.NumberFormat('vi-VN').format(price);
        },
        getRandomColor() {
            const colors = ['bg-orange-500 text-orange-500', 'bg-cyan-500 text-cyan-500', 'bg-pink-500 text-pink-500', 'bg-green-500 text-green-500', 'bg-purple-500 text-purple-500', 'bg-teal-500 text-teal-500'];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        getRandomPercentage() {
            return Math.floor(Math.random() * 100) + 1;
        },
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