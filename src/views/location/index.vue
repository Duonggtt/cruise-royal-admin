
<template>
    <Toast/>
    <div v-if="isAdmin">
        <div class="pb-4">
            <span class="flex font-semibold text-3xl pb-3">Danh sách địa điểm - lộ trình</span>
            <Breadcrumb :home="home" :model="items" />
        </div>
        
        <div class="card">
            <div class="flex justify-content-between">
                <div class="flex gap-2">
                    <span>
                        <Button label="Thêm mới" severity="info" icon="pi pi-plus" @click="openCreateModal"/>
                        <Dialog 
                            v-model:visible="displayCreateModal" 
                            modal 
                            header="Thêm mới địa điểm" 
                            :style="{ width: '40rem' }" 
                            :breakpoints="{ '640px': '95vw' }"
                        >
                            <div class="flex flex-column gap-4 p-4">
                                <div class="field">
                                    <label for="newRouteName" class="text-sm font-medium text-gray-700 mb-1">Lộ trình</label>
                                    <InputText id="newRouteName" v-model="locationNew.routeName" class="w-full" />
                                </div>
                                <div class="field">
                                    <label for="newAddress" class="text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                                    <InputText id="newAddress" v-model="locationNew.address" class="w-full" />
                                </div>
                                <div class="field">
                                    <label for="newCity" class="text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                                    <InputText id="newCity" v-model="locationNew.city" class="w-full" />
                                </div>
                            </div>
                            <template #footer>
                                <div class="flex justify-end gap-2">
                                    <Button 
                                        label="Hủy" 
                                        icon="pi pi-times" 
                                        @click="closeCreateModal" 
                                        class="p-button-text"
                                    />
                                    <Button 
                                        label="Tạo mới" 
                                        icon="pi pi-check" 
                                        @click="createLocation" 
                                        autofocus
                                    />
                                </div>
                            </template>
                        </Dialog>
                    </span>
                    <span>
                        <Button label="Refresh" severity="info" icon="pi pi-refresh" @click="resetData()"/>
                    </span>
                </div>
                <IconField iconPosition="left">
                    <InputIcon class="pi pi-search cursor-pointer" @click="searchByName"></InputIcon>
                    <InputText placeholder="Nhập tên..." v-model="searchName" />
                </IconField>
            </div>
            <hr>
            <DataTable showGridlines :value="locations" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                <Column field="id" header="ID" style="width: 10%"></Column>
                <Column field="routeName" header="Lộ trình" style="width: 40%"></Column>
                <Column field="address" header="Địa điểm" style="width: 35%"></Column>
                <Column field="city" header="Thành phố" style="width: 20%"></Column>
                <Column header="Thao tác" style="width: 20%">
                    <template #body="slotProps">
                       <div class="flex gap-2">
                        <ConfirmPopup></ConfirmPopup>
                        <Button icon="pi pi-search" severity="success" aria-label="Search" @click="fetchLocationDetail(slotProps.data.id)" />
                        <Button icon="pi pi-times" severity="danger" aria-label="Cancel" @click="confirm2($event, slotProps.data.id)"/>
                       </div>
                    </template>
                </Column>
            </DataTable>
            <Dialog 
                v-model:visible="displayDetailModal" 
                modal 
                header="Chi tiết địa điểm" 
                :style="{ width: '40rem' }" 
                :breakpoints="{ '640px': '95vw' }"
            >
                <div class="flex flex-column gap-4 p-4">
                    <div class="field">
                        <label for="routeName" class="text-sm font-medium text-gray-700 mb-1">Lộ trình</label>
                        <InputText id="routeName" v-model="locationDetail.routeName" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="address" class="text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                        <InputText id="address" v-model="locationDetail.address" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="city" class="text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                        <InputText id="city" v-model="locationDetail.city" class="w-full" />
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-end gap-2">
                        <Button 
                            label="Hủy" 
                            icon="pi pi-times" 
                            @click="closeDetailModal" 
                            class="p-button-text"
                        />
                        <Button 
                            label="Lưu" 
                            icon="pi pi-check" 
                            @click="saveLocationDetail" 
                            autofocus
                        />
                    </div>
                </template>
            </Dialog>
        </div>
    </div>
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

interface LocationNew {
    routeName: string;
    address: string;
    city: string;
}

interface LocationDetail {
    id: number;
    routeName: string;
    address: string;
    city: string;
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
    },
    data() {
        return {
            displayDetailModal: false,
            displayCreateModal: false,
            searchName: '',
            items: ref([
                { label: 'Quản lý thông tin lộ trình' }, 
                { label: 'Địa điểm - Lộ trình' }, 
            ]),
            roles: [],
            role: {id:'',name:''},
            home: ref({
                icon: 'pi pi-home'
            }),
            locations: [{id: '', routeName: '', address: '', city: ''}],
            locationNew: {
                routeName: '', 
                address: '', 
                city: ''
            } as LocationNew,
            locationDetail: {
                id: 0, 
                routeName: '', 
                address: '', 
                city: ''
            } as LocationDetail,
        };
    },
    mounted() {
        this.fetchLocations();
    },
    methods: {
        closeDetailModal() {
            this.displayDetailModal = false;
        },
        closeCreateModal() {
            this.displayCreateModal = false;
        },
        openCreateModal() {
            this.locationNew = {
                routeName: '',
                address: '',
                city: ''
            };
            this.displayCreateModal = true;
        },
        saveLocationDetail() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/locations/${this.locationDetail.id}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify(this.locationDetail)
            })
            .then(res => {
                if (res.status === 403) {
                    this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res.json();
            })
            .then(data => {
                this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Cập nhật thông tin địa điểm thành công!', life: 3000 });
                this.closeDetailModal();
                this.fetchLocations();  // Refresh the list
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi cập nhật thông tin địa điểm!', life: 3000 });
                console.log("Error updating location details!", error);
            });
        },
        fetchLocationDetail(locationId: any) {
            this.displayDetailModal = true;
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/locations/${locationId}`;
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
                this.locationDetail = data;
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi lấy thông tin địa điểm!', life: 3000 });
                console.log("Error fetching location details!", error);
            });
        },
        searchByName() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/locations/search?city=${this.searchName}`;
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
                console.log(data);
                this.locations = data;
            })
            .catch(error => {
                // router.replace("/");
                console.log("Error fetching location list!", error);
            });
        },
        resetData() {
            this.searchName = '';
            this.fetchLocations();
        },
        fetchLocations() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/locations/auth/`;
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
                console.log(data);
                this.locations = data;
            })
            .catch(error => {
                // router.replace("/");
                console.log("Error fetching owners list!", error);
            });

        },
        createLocation() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/locations/create`;  // Update this to the correct endpoint
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify(this.locationNew)
            })
            .then(res => {
                if (res.status === 403) {
                    this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res.json();
            })
            .then(data => {
                this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Tạo lộ trình thành công!', life: 3000 });
                this.closeCreateModal();
                this.fetchLocations();   // Refresh the list after creating a new owner
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi tạo lộ trình!', life: 3000 });
                console.log("Error creating owner!", error);
            });
        },
        confirm2(event: any, locationId: number) {
            this.confirm.require({
                target: event.currentTarget,
                message: 'Bạn có chắc muốn xóa không?',
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
                acceptClass: 'p-button-danger p-button-sm',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                accept: () => {
                    this.removeLocation(locationId);
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Đã hủy xóa!', life: 3000 });
                }
            });
        },
        removeLocation(locationId: number) {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/locations/${locationId}`;
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
                if(res.status === 404) {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lộ trình này đang được sử dụng!', life: 3000 });
                }
                if(res.status === 200) {
                    this.$toast.add({ severity: 'info', summary: 'Thao tác', detail: 'Xóa thành công!', life: 3000 });
                    setTimeout(() => {
                        this.fetchLocations();
                    }, 1500);
                }
            })
        },
    },
};
</script>