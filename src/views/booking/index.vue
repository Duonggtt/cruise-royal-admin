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
                        <Button label="Tạo đơn" severity="info" icon="pi pi-plus" @click="openNewBookingDialog()"/>
                        
                        <!-- User Selection Dialog -->
                        <Dialog v-model:visible="showUserSelectionDialog" modal header="Chọn Người Dùng" :style="{ width: '50vw' }">
                            <DataTable :value="users" @row-select="selectUser" selectionMode="single">
                                <Column field="id" header="ID"></Column>
                                <Column field="name" header="Tên"></Column>
                                <Column field="email" header="Email"></Column>
                            </DataTable>
                        </Dialog>

                        <!-- New Booking Dialog -->
                        <Dialog v-model:visible="showNewBookingDialog" modal header="Thêm mới đơn đặt" :style="{ width: '70vw' }">
                            <div class="p-fluid grid">
                                <div class="col-12 md:col-6 mb-2">
                                    <label for="user">Người dùng đã chọn</label>
                                    <InputText id="user" :value="selectedUser ? selectedUser.name : ''" disabled />
                                </div>
                                <div class="col-12 md:col-6 mb-2">
                                    <label for="name">Tên du thuyền</label>
                                    <Dropdown 
                                        v-model="selectedCruise"
                                        :options="cruises" 
                                        optionLabel="name" 
                                        optionValue="id" 
                                        placeholder="Chọn du thuyền..." 
                                        class="w-full"
                                        @change="onCruiseSelect"
                                    />
                                </div>
                                <div class="col-12 md:col-6 mb-2">
                                    <label for="guestQuantity">Số lượng khách</label>
                                    <InputNumber id="guestQuantity" v-model="newBooking.guestQuantity" required />
                                </div>
                                <div class="col-12 md:col-6 mb-2">
                                    <label for="bookingDate">Ngày đặt</label>
                                    <Calendar id="bookingDate" v-model="newBooking.bookingDate" dateFormat="dd/mm/yy" />
                                </div>
                                <div class="col-12 md:col-6 mb-2">
                                    <label for="paymentStatus">Trạng thái thanh toán</label>
                                    <Dropdown 
                                        v-model="newBooking.paymentStatus"
                                        :options="paymentStatusOptions" 
                                        optionLabel="label" 
                                        optionValue="value" 
                                        placeholder="Chọn trạng thái thanh toán"
                                        class="w-full"
                                    />
                                </div>
                                <div class="col-12 md:col-6 mb-2">
                                    <label for="bookingStatus">Trạng thái đơn đặt</label>
                                    <Dropdown 
                                        v-model="newBooking.bookingStatus"
                                        :options="bookingStatusOptions" 
                                        optionLabel="label" 
                                        optionValue="value" 
                                        placeholder="Chọn trạng thái đơn đặt"
                                        class="w-full"
                                    />
                                </div>
                                <div class="col-12 mb-2">
                                    <label for="note">Ghi chú</label>
                                    <Textarea id="note" v-model="newBooking.note" rows="3" />
                                </div>
                                <div class="col-12 mb-2">
                                    <Button label="Chọn Cabin" icon="pi pi-list" @click="openCabinSelectionDialog" :disabled="!selectedCruise" />
                                </div>
                            </div>
                            <template #footer>
                                <Button label="Hủy" icon="pi pi-times" @click="closeNewBookingDialog" class="p-button-text"/>
                                <Button label="Tạo đơn" icon="pi pi-check" @click="createNewBooking" autofocus />
                            </template>
                        </Dialog>

                        <!-- Cabin Selection Dialog -->
                        <Dialog v-model:visible="showCabinSelectionDialog" modal header="Chọn Cabin" :style="{ width: '80vw' }">
                            <div class="grid">
                                <div v-for="cabin in cabins" :key="cabin.id" class="col-12 md:col-6 lg:col-4 xl:col-3 mb-3">
                                    <Card>
                                        <template #title>
                                            {{ cabin.cabinType.name }}
                                        </template>
                                        <template #content>
                                            <p>Số phòng trống: {{ cabin.availableRooms }}</p>
                                            <p>Sức chứa: {{ cabin.cabinType.maxGuests }}</p>
                                            <p>Giá: {{ cabin.cabinType.price }}</p>
                                        </template>
                                        <template #footer>
                                            <div class="flex align-items-center justify-content-between">
                                                <InputNumber 
                                                    v-model.number="cabinBookingsComputed[cabin.id]" 
                                                    :min="0" 
                                                    :max="cabin.availableRooms" 
                                                    showButtons
                                                />
                                            </div>
                                            <small v-if="cabinBookingsComputed[cabin.id] >= cabin.availableRooms" class="p-error">
                                                Vượt quá số phòng còn trống, lấy max
                                            </small>
                                        </template>
                                    </Card>
                                </div>
                            </div>
                            <template #footer>
                                <Button label="Hủy" icon="pi pi-times" @click="closeCabinSelectionDialog" class="p-button-text"/>
                                <Button label="Xác nhận" icon="pi pi-check" @click="confirmCabinSelection" />
                            </template>
                        </Dialog>
                    </span>
                    <span>
                        <Button label="Refresh" severity="info" icon="pi pi-refresh" @click="resetData()"/>
                    </span>
                </div>
                <IconField iconPosition="left">
                    <InputIcon class="pi pi-search cursor-pointer" @click="searchByUser_Name"></InputIcon>
                    <InputText placeholder="Tìm kiếm theo tên user..." v-model="searchName" />
                </IconField>
            </div>
            <hr>
            <DataTable showGridlines :value="bookings" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                <Column field="id" header="ID đơn đặt" style="width: 10%"></Column>
                <Column field="userDto.name" header="Tên người đặt" style="width: 20%"></Column>
                <Column field="cruiseDto.name" header="Tên du thuyền" style="width: 25%"></Column>
                <Column field="guestQuantity" header="Số lượng khách" style="width: 5%"></Column>
                <Column field="bookingDate" header="Ngày đặt" style="width: 15%"></Column>
                <Column field="paymentStatus" header="Thanh toán" style="width: 15%">
                    <template #body="slotProps">
                        <Button v-if="slotProps.data.paymentStatus === false" severity="warn" icon="pi pi-dollar" aria-label="Check" label="Done" @click="setPaymentStatus(slotProps.data.id)"/>
                        <span v-else :class="getPaymentStatus(slotProps.data.paymentStatus) === 'Đã thanh toán' ? 'text-green-500' : 'text-orange-500'">
                            {{ getPaymentStatus(slotProps.data.paymentStatus) }}
                        </span>
                    </template>
                </Column>
                <Column field="bookingStatus" header="Trạng thái" style="width: 10%">
                    <template #body="slotProps">
                        <Button v-if="slotProps.data.bookingStatus === true" severity="info" aria-label="Check" icon="pi pi-check" label="Checkout" @click="setBookingStatus(slotProps.data.id)"/>
                        <span v-else :class="getStatus(slotProps.data.bookingStatus) === 'Đã đặt' ? 'text-orange-500' : 'text-orange-500'">
                            {{ getStatus(slotProps.data.bookingStatus) }}
                        </span>
                    </template> 
                </Column>
                <Column header="Thao tác" style="width: 30%">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <ConfirmPopup></ConfirmPopup>
                        <Button icon="pi pi-search" severity="success" aria-label="Search" @click="fetchBookingDetail(slotProps.data.id)"/>
                        <Button icon="pi pi-times" severity="danger" aria-label="Cancel" @click="confirm2($event, slotProps.data.id)" />
                        <Button v-if="slotProps.data.paymentStatus == false" icon="pi pi-dollar" label="Abate" @click="getPaymentInfo(slotProps.data.id)"/>    
                    </div>
                </template>
                </Column>
            </DataTable>
            <Dialog v-model:visible="showBookingDetailModal" modal header="Chi tiết đơn đặt" :style="{ width: '40vw' }">
                <h4>Thông tin đơn đặt</h4>
                <div class="grid ml-4">
                    <div class="col-12 md:col-6">
                        <div class="mb-2">
                            <strong>ID đơn đặt:</strong>
                        </div>
                        <div class="mb-2">
                            <strong>Ngày đặt:</strong>
                        </div>
                        <div class="mb-2">
                            <strong>Ngày tạo đơn:</strong>
                        </div>
                        <div class="mb-2">
                            <strong>Số lượng khách:</strong>
                        </div>
                        <div class="mb-2">
                            <strong>Tổng giá:</strong>
                        </div>
                        <div class="mb-2">
                            <strong>Trạng thái đơn đặt:</strong>
                        </div>
                        <div class="mb-2">
                            <strong>Trạng thái thanh toán:</strong>
                        </div>
                        <div class="mb-2">
                            <strong>Ghi chú:</strong>
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="mb-2">{{ bookingDetail.id }}</div>
                        <div class="mb-2">{{ bookingDetail.bookingDate }}</div>
                        <div class="mb-2">{{ bookingDetail.orderDate }}</div>
                        <div class="mb-2">{{ bookingDetail.guestQuantity }}</div>
                        <div class="mb-2">{{ formatPrice(bookingDetail.totalPrice) }} vnđ</div>
                        <div class="mb-2">{{ getStatus(Boolean(bookingDetail.bookingStatus)) }}</div>
                        <div class="mb-2">{{ getPaymentStatus(Boolean(bookingDetail.paymentStatus)) }}</div>
                        <div class="mb-2">{{ bookingDetail.note }}</div>
                    </div>
                </div>

                <h4 class="mt-4">Thông tin người dùng</h4>
                <div class="grid ml-4">
                    <div class="col-12 md:col-6">
                        <div class="mb-2"><strong>Tên:</strong></div>
                        <div class="mb-2"><strong>Điện thoại:</strong></div>
                        <div class="mb-2"><strong>Email:</strong></div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="mb-2">{{ bookingDetail.userDto.name }}</div>
                        <div class="mb-2">{{ bookingDetail.userDto.phone }}</div>
                        <div class="mb-2">{{ bookingDetail.userDto.email }}</div>
                    </div>
                </div>

                <h4 class="mt-4">Thông tin du thuyền</h4>
                <div class="grid ml-4">
                    <div class="col-12 md:col-6">
                        <div class="mb-2"><strong>Tên du thuyền:</strong></div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="mb-2">{{ bookingDetail.cruiseDto.name }}</div>
                    </div>
                </div>

                <h4 class="mt-4">Cabin đã đặt</h4>
                <p>Tổng số loại phòng ngủ: {{ groupedCabins.length }}</p>
                <div v-if="groupedCabins.length > 0" class="grid">
                    <div v-for="cabin in groupedCabins" :key="cabin.id" class="col-12 md:col-6 lg:col-4 xl:col-3 mb-4">
                        <div class="border rounded p-3 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                            <h4 class="text-lg font-semibold text-blue-600">{{ cabin.name }}</h4>
                            <p class="mt-2 text-gray-600">Số lượng: {{ cabin.count }}</p>
                        </div>
                    </div>
                </div>
                <div v-else>
                    Không có thông tin cabin.
                </div>
            </Dialog>
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

interface Cabin {
  id: number;
  cabinTypeDto: {
    id: number;
    name: string;
  };
}

interface BookingDetail {
  id: string;
  bookingDate: string;
  orderDate: string;
  guestQuantity: string;
  totalPrice: string;
  note: string;
  bookingStatus: string;
  paymentStatus: string;
  userDto: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  cabinDto: Cabin[];
  cruiseDto: {
    id: string;
    name: string;
  };
}

interface GroupedCabin {
  id: number;
  name: string;
  count: number;
}

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
        isAdmin() { 
            return useAuthStore().isAdmin;
        },
        cabinBookingsComputed: {
            get() {
            return this.cabinBookings;
            },
            set(newValue: any) {
            Object.keys(newValue).forEach(cabinId => {
                const cabin = this.cabins.find(c => c.id === cabinId);
                if (cabin && newValue[cabinId] > cabin.availableRooms) {
                    newValue[cabinId] = cabin.availableRooms;
                }
            });
            this.cabinBookings = {...newValue};
            }
        },
        groupedCabins(): GroupedCabin[] {
            if (!this.bookingDetail || !Array.isArray(this.bookingDetail.cabinDto)) {
            console.log('No cabin data available');
            return [];
            }

            const groups = this.bookingDetail.cabinDto.reduce((acc: {[key: number]: GroupedCabin}, cabin: Cabin) => {
            if (!cabin || !cabin.cabinTypeDto) {
                console.log('Invalid cabin data:', cabin);
                return acc;
            }

            const key = cabin.cabinTypeDto.id;
            if (key === undefined) {
                console.log('Invalid cabin type id:', cabin.cabinTypeDto);
                return acc;
            }

            if (!acc[key]) {
                acc[key] = {
                    id: cabin.cabinTypeDto.id,
                    name: cabin.cabinTypeDto.name || 'Unknown',
                    count: 1
                };
            } else {
                acc[key].count++;
            }
            return acc;
            }, {});

            const result = Object.values(groups) as GroupedCabin[];
            console.log('Grouped cabins:', result);
            return result;
        }
    },
    data() {
        return {
            state: 'default',
            paymentAmount: 0,
            paymentInfo: '',
            totalPricePayment: 0,
            items: ref([
                { label: 'Quản lý đặt vé' }, 
                { label: 'Vé' }, 
            ]),
            home: ref({
                icon: 'pi pi-home'
            }),
            paymentStatusOptions: [
                { label: 'Đã thanh toán', value: true },
                { label: 'Chưa thanh toán', value: false }
            ],
            bookingStatusOptions: [
                { label: 'Đang đặt', value: true },
                { label: 'Đã đặt', value: false }
            ],
            searchName: '',
            showNewBookingDialog: false,
            showBookingDetailsDialog: false,
            showBookingDetailModal: false,
            showUserSelectionDialog: false,
            showCabinSelectionDialog: false,
            visible: false,
            cabins: [
                {
                    id: '',
                    roomQuantity: '',
                    availableRooms: '',
                    cabinType: {
                        id: '',
                        name: '',
                        description: '',
                        maxGuests: '',
                        roomSize: '',
                        price: '',
                        tags: [],
                        cabinTypeImages: [],
                    },
                }
            ],
            cabinBookings: {} as any,
            users: [],
            selectedUser: {id: '',name: '', email: '', phone: ''},
            cruises: [] as any[],
            selectedCruise: ref(null),
            newBooking: {
                bookingDate: '',
                guestQuantity: 0,
                note: '',
                bookingStatus: 0,
                paymentStatus: 0,
                cabinBookings: {
                    
                },
                userId: '',
                cruiseId: ''
            },
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
            bookingDetail: {
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
                cabinDto: [],
                cruiseDto: {
                    id: '',
                    name: '',
                }
                } as BookingDetail,
        };
    },
    mounted() {
        this.fetchBookings();
    },
    methods: {
        getTotalPriceByBookingId(bookingId: any) {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/total-price/${bookingId}`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(res => {
                if (res.status === 403) {
                    this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res;
            })
            .then(res => res.json())
            .then(data => {
                this.totalPricePayment = data;
            })
        },
        getPaymentInfo(bookingId: any) {
            this.getTotalPriceByBookingId(bookingId);
            setTimeout(() => {
                this.paymentAmount = this.totalPricePayment;
                this.paymentInfo = `Thanh toan hoa don ${bookingId}`;
                this.initiatePayment();
            }, 1000);
        },
        async initiatePayment() {
            console.log("Payment amount:", this.paymentAmount);
            console.log("Payment info:", this.paymentInfo);
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/payment/create`;
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                    body: JSON.stringify({
                        amount: this.paymentAmount, 
                        orderInfo: this.paymentInfo
                    })
                });

                if (res.status === 403) {
                    this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                    return;
                }

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.text();
                console.log("Response data:", data);
                
                if (data.startsWith('http://') || data.startsWith('https://')) {
                    window.location.href = data;
                } else {
                    console.error("Invalid response format:", data);
                    throw new Error("Invalid response format");
                }
            } catch (error) {
                console.error("Error payment!", error);
                this.$toast.add({ severity: 'error', summary: 'Payment', detail: 'Thanh toán thất bại!', life: 3000 });
            }
        },
        formatNumberAsCurrency(number: any) {
            return number.toLocaleString('vi-VN');
        },
        formatPrice(price: any) {
            return new Intl.NumberFormat('vi-VN').format(price);
        },
        onCruiseSelect() {
            // Reset cabin selections when cruise changes
            this.cabinBookings = {};
        },
        openCabinSelectionDialog() {
            this.showCabinSelectionDialog = true;
            this.fetchCabins();
        },
        closeCabinSelectionDialog() {
            this.showCabinSelectionDialog = false;
        },
        fetchCabins() {
            console.log("Selected cruise: ", this.selectedCruise);
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cabins?cruiseId=${this.selectedCruise}`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(res => {
                if (res.status === 403) {
                    this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res;
            })
            .then(res => res.json())
            .then(data => {
                this.cabins = data;
                console.log("Cabin list: ", this.cabins);
                // Initialize quantities
                this.cabins.forEach(cabin => {
                    if (!this.cabinBookings[cabin.id]) {
                        this.$set(this.cabinBookings, cabin.id, 0);
                    }
                });
            })
            .catch(error => {
                console.log("Error fetching cabin list!", error);
            });
        },
        confirmCabinSelection() {
            // Filter out cabins with quantity 0
            const selectedCabins = Object.entries(this.cabinBookings)
                .filter(([_, quantity]) => quantity > 0)
                .reduce((acc, [id, quantity]) => {
                    acc[id] = quantity;
                    return acc;
                }, {});
            this.$toast.add({ severity: 'info', summary: 'Thao tác', detail: 'Chọn phòng ngủ thành công!', life: 3000 });
            this.newBooking.cabinBookings = selectedCabins;
            this.closeCabinSelectionDialog();
        },
        fetchCruises() {
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
                this.cruises = data;
                console.log("Cruise list: ", this.cruises);
            })
            .catch(error => {
                console.log("Error fetching cruise list!", error);
            });
        },
        setPaymentStatus(bookingId: any) {
            this.state = 'default';
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/update-payment-status/${bookingId}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    paymentStatus: true
                })
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
            .then(res => {
                if(res.status === 201) {
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Thanh toán thành công!', life: 3000 });
                    // toast.add({ severity: 'success', summary: 'Update', detail: `Sửa thông tin thành công`, life: 3000 });
                    setTimeout(() => {
                        this.fetchBookings();
                    }, 1500);
                }
            })
            .catch(error => {
                // router.replace("/");
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi sửa thông tin!', life: 3000 });
                console.log("Error updating payment status!", error);
            });
        },
        setBookingStatus(bookingId: any) {
            this.state = 'default';
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/check-out/${bookingId}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    bookingStatus: false
                })
            })
            .then(res => {
                if (res.status === 500) {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Vui lòng thanh toán trước!', life: 3000 });
                    return;
                }
                // If the token has expired
               if (res.status === 403) {
                this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                //  toast.add({ severity: 'error', summary: 'Authentication', detail: `Phiên đăng nhập hết hạn!`, life: 3000 });
                 useAuthStore().logout();
               }
                return res;
            })
            .then(res => {
                if(res.status === 201) {
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Hoàn trả du thuyền thành công!', life: 3000 });
                    // toast.add({ severity: 'success', summary: 'Update', detail: `Sửa thông tin thành công`, life: 3000 });
                    setTimeout(() => {
                        this.fetchBookings();
                    }, 1500);
                }
            })
            .catch(error => {
                // router.replace("/");
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi sửa thông tin!', life: 3000 });
                console.log("Error updating status!", error);
            });
        },
        getStatus(status: boolean) {
            return status ? 'Đang đặt' : 'Đã đặt';
        },
        getPaymentStatus(status: boolean) {
            return status ? 'Đã thanh toán' : 'Chưa thanh toán';
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
        createNewBooking() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/create`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    bookingDate: this.formatDate(this.newBooking.bookingDate),
                    guestQuantity: this.newBooking.guestQuantity,
                    note: this.newBooking.note,
                    bookingStatus: this.newBooking.bookingStatus,
                    paymentStatus: this.newBooking.paymentStatus,
                    cabinBookings: this.newBooking.cabinBookings,
                    userId: this.selectedUser.id,
                    cruiseId: this.selectedCruise
                })
            })
            .then(res => {
                if (res.status === 403) {
                    this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res;
            })
            .then(res => {
                if(res.status === 201) {
                    console.log(res);
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Tạo mới đơn đặt thành công', life: 3000 });
                    setTimeout(() => {
                        this.fetchBookings();
                        this.showNewBookingDialog = false;
                    }, 1500);
                }
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi tạo đơn đặt mới!', life: 3000 });
                console.log("Error creating booking !", error);
            });
        },
        searchByUser_Name() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/search-by-user?name=${this.searchName}`;
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
                console.log("Booking list by name: ", this.bookings);
            })
            .catch(error => {
                console.log("Error fetching booking list!", error);
            });
        },
        fetchBookingDetail(id: number) {
            this.showBookingDetailModal = true;
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/detail/${id}`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(res => {
                if (res.status === 403) {
                    this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res.json();
            })
            .then(data => {
                this.bookingDetail = data;
                console.log("Booking detail: ", data);
            })
            .catch(error => {
                console.log("Error fetching booking detail!", error);
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch booking details', life: 3000 });
            });
        },
        openNewBookingDialog() {
            this.showUserSelectionDialog = true;
            this.fetchUsers();
        },
        selectUser(user: any) {
            console.log("Selected user: ", user.data);
            this.selectedUser = user.data;
            this.showUserSelectionDialog = false;
            this.showNewBookingDialog = true;
            this.fetchCruises();
        },
        fetchUsers() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/users`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
            }
            })
            .then(res => {
                if (res.status === 403) {
                    this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
            }
                return res;
            })
            .then(res => res.json())
            .then(data => {
                this.users = data;
            })
                .catch(error => {
                console.log("Error fetching user list!", error);
            });
        },
        closeNewBookingDialog() {
            this.showNewBookingDialog = false;
            this.newBooking = {
                bookingDate: '',
                guestQuantity: 0,
                note: '',
                bookingStatus: 0,
                paymentStatus: 0,
                cabinBookings: {
                    
                },
                userId: '',
                cruiseId: ''
            };
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
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/bookings/${bookingId}`;
            fetch(url, {
                method: 'DELETE',
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
            .then(res => {
                if(res.status === 200) {
                    this.$toast.add({ severity: 'info', summary: 'Thao tác', detail: 'Hủy đơn thành công!', life: 3000 });
                    setTimeout(() => {
                        this.fetchBookings();
                    }, 1500);
                }
            })
        },
    }
};

</script>
