<template>
    <Toast/>
    <div v-if="state === 'default'">
        <div class="pb-4">
            <span class="flex font-semibold text-3xl pb-3">Danh sách đơn đặt du thuyền</span>
            <Breadcrumb :home="home" :model="items" />
        </div>
        <div class="card">
            <div class="flex justify-content-between">
                <div class="flex gap-2">
                    <span>
                        <Button label="Tạo đơn" severity="info" icon="pi pi-plus" @click="changeState('create')"/>
                    </span>
                    <span>
                        <Button label="Refresh" severity="info" icon="pi pi-refresh" @click="resetData()"/>
                    </span>
                </div>
                <IconField iconPosition="left">
                    <InputIcon class="pi pi-search cursor-pointer" @click="searchByName"></InputIcon>
                    <InputText placeholder="Tìm kiếm..." v-model="searchName" />
                </IconField>
            </div>
            <hr>
            <DataTable showGridlines :value="bookings" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                <Column field="id" header="ID đơn đặt" style="width: 10%"></Column>
                <Column field="userDto.name" header="Tên người đặt" style="width: 20%"></Column>
                <Column field="cruiseDto.name" header="Tên du thuyền" style="width: 15%"></Column>
                <Column field="guestQuantity" header="Số lượng khách" style="width: 15%"></Column>
                <Column field="bookingDate" header="Ngày đặt" style="width: 15%"></Column>
                <Column field="bookingStatus" header="Trạng thái" style="width: 15%"></Column>
                <Column header="Thao tác" style="width: 25%">
                <template #body="slotProps">
                    <div class="flex gap-2">
                    <ConfirmPopup></ConfirmPopup>
                    <Button icon="pi pi-search" severity="success" aria-label="Search" @click="fetchBookingDetail(slotProps.data.id)"/>
                    <Button icon="pi pi-times" severity="danger" aria-label="Cancel" @click="confirm2($event, slotProps.data.id)" />
                    </div>
                </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>


<script lang="ts">
import Vue from 'vue'
import {useAuthStore} from '@/stores/counter';
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { API_URL } from '@/stores/config';
import { icon } from '@fortawesome/fontawesome-svg-core';
const api_url = API_URL;


export default {
    setup() {
        const confirm = useConfirm();
        // ...
        return {
            confirm,
            // ...
        }
    },
    computed: {
        
    },
    data() {
        return {
            state: 'default',
            items: ref([
                { label: 'Quản lý đặt vé' }, 
                { label: 'Vé' }, 
            ]),
            home: ref({
                icon: 'pi pi-home'
            }),
            searchName: '',
            bookings: [
                {
                    id: '',
                    bookingDate: '',
                    orderDate: '',
                    guestQuantity: '',
                    totalPrice: '',
                    note: '',
                    bookingStatus: '',
                    paymentStatus: '',
                    userDto: {
                        id: '',
                        name: '',
                        phone: '',
                        email: '',
                    },
                    cabinDto: [
                        {
                            id: '',
                            cabinType: {
                                id: '',
                                name: '',
                            }
                        }
                    ],
                    cruiseDto: {
                        id: '',
                        name: '',
                    }
                }
            ],
        };
    },
    mounted() {
        this.fetchBookings();
    },
    methods: {
        getStatus(status: boolean) {
            return status ? 'Đang đặt' : 'Đã đặt';
        },
        changeState(newState: string) {
            this.state = newState;
        },
        resetData() {
            this.searchName = '';
            this.fetchBookings();
        },
        fetchBookings() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/`;
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
                this.bookings = data;
                console.log("Booking list: ", this.bookings);
            })
            .catch(error => {
                console.log("Error fetching booking list!", error);
            });
        },
        fetchUserByBooking() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/user/`;
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
                this.bookings = data;
                console.log("Booking list: ", this.bookings);
            })
            .catch(error => {
                console.log("Error fetching booking list!", error);
            });
        },
        searchByName() {
            
        },
        fetchBookingDetail(id: number) {
            
        },
        formatDate(date: any) {
            return date.toISOString().split('T')[0];
        },
        formatTime(time: any) {
            return time.toTimeString().split(' ')[0];
        },
        confirm2(event: any, bookingId: number) {
            this.confirm.require({
                target: event.currentTarget,
                message: 'Bạn có chắc muốn xóa không?',
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
                acceptClass: 'p-button-danger p-button-sm',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                accept: () => {
                    this.removeBooking(bookingId);
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Đã hủy xóa!', life: 3000 });
                }
            });
        },
        removeBooking(bookingId: number) {
            
        }
    }
};

</script>
