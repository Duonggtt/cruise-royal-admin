<template>
    <Toast/>
    <div v-if="isAdmin">
        <div v-if="state === 'default'">
            <div class="pb-4">
                <span class="flex font-semibold text-3xl pb-3">Danh sách phòng ngủ</span>
                <Breadcrumb :home="home" :model="items" />
            </div>
            
            <div class="card">
                <div class="flex justify-content-between w-full">
                    <div class="flex gap-2">
                        <span>
                            <Button label="Thêm mới" severity="info" icon="pi pi-plus" @click="changeState('create')"/>
                        </span>
                        <span>
                            <Button label="Refresh" severity="info" icon="pi pi-refresh" @click="resetData()"/>
                        </span>
                    </div>
                    <div class="w-6">
                        <Dropdown 
                            v-model="selectedCruise"
                            :options="cruises" 
                            optionLabel="name" 
                            optionValue="id" 
                            placeholder="Chọn du thuyền..." 
                            class="w-full"
                            @change="onCruiseChange"
                        />
                    </div>
                </div>
                <hr>
                <DataTable showGridlines :value="cabins" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                    <Column field="id" header="ID" style="width: 10%"></Column>
                    <Column field="cabinType.name" header="Tên phòng" style="width: 20%"></Column>
                    <Column field="cabinType.roomSize" header="Kích cỡ" style="width: 15%"></Column>
                    <Column field="roomQuantity" header="Số lượng phòng" style="width: 15%"></Column>
                    <Column field="cabinType.maxGuests" header="Số người ở" style="width: 15%"></Column>
                    <Column field="cabinType.price" header="Giá phòng" style="width: 15%"></Column>
                    <Column header="Thao tác" style="width: 25%">
                    <template #body="slotProps">
                        <div class="flex gap-2">
                        <ConfirmPopup></ConfirmPopup>
                        <Button icon="pi pi-search" severity="success" aria-label="Search" @click="fetchCabinDetail(slotProps.data.id)"/>
                        <Button icon="pi pi-times" severity="danger" aria-label="Cancel" @click="confirm2($event, slotProps.data.id)" />
                        </div>
                    </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div v-else-if="state === 'update'">
            <div class="pb-1 flex justify-content-between">
                <span class="font-semibold text-3xl">Cập nhật thông tin phòng</span>
                <span class="mr-4">
                    <Button label="Quay lại" class="flex justify-end float-end" severity="info" icon="pi pi-undo" @click="changeState('default')"/>
                </span>
            </div>
            <div class="col-12 mt-2">
                <div class="card">
                    <span class="text-xl text-gray-600 font-semibold">Thông tin phòng</span>
                    <hr>
                    <div class="p-fluid formgrid grid mt-2 mb-4">
                        <div class="field col-12 md:col-6">
                            <label for="name">Tên phòng</label>
                            <InputText v-model="cabinDetail.cabinType.name" id="name" type="text" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="roomSize">Kích thước phòng</label>
                            <InputText v-model="cabinDetail.cabinType.roomSize" id="roomSize" type="number" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="maxGuests">Số người 1 phòng</label>
                            <InputText v-model="cabinDetail.cabinType.maxGuests" id="maxGuests" type="number" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="price">Giá phòng</label>
                            <InputText v-model="cabinDetail.cabinType.price" id="price" type="number" />
                        </div>
                        <div class="field col-12">
                            <label for="description">Mô tả</label>
                            <Textarea v-model="cabinDetail.cabinType.description" id="description" rows="4" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="roomQuantity">Số lượng phòng</label>
                            <InputText v-model="cabinDetail.roomQuantity" id="roomQuantity" type="number" disabled/>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="availableRooms">Số phòng còn trống</label>
                            <InputText v-model="cabinDetail.availableRooms" id="availableRooms" type="number" disabled />
                        </div>
                        <div class="field col-12">
                            <label for="tags">Danh mục</label>
                            <MultiSelect v-model="selectedTags" 
                                        :options="tags" 
                                        optionLabel="name" 
                                        optionValue="id"
                                        placeholder="Chọn danh mục"
                                        :maxSelectedLabels="5" 
                                        class="w-full md:w-40rem" />
                        </div>
                    </div>
                    <Button type="submit" label="Cập nhật" severity="info" icon="pi pi-check" @click="updateCabin()"/>
                </div>
            </div>
        </div>
        <div v-else-if="state === 'create'">
            <div class="pb-1 flex justify-content-between">
                <span class="font-semibold text-3xl">Thêm phòng mới</span>
                <span class="mr-4">
                    <Button label="Quay lại" class="flex justify-end float-end" severity="info" icon="pi pi-undo" @click="changeState('default')"/>
                </span>
            </div>
            <div class="col-12 mt-2">
                <div class="card">
                    <span class="text-xl text-gray-600 font-semibold">Info</span>
                    <hr>
                    <div class="p-fluid formgrid grid mt-2 mb-4">
                        <div class="field col-12 md:col-6">
                            <label for="name">Tên phòng</label>
                            <InputText v-model="newCabin.cabinType.name" id="name" type="text" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="launchedYear">Kích thước phòng</label>
                            <InputText v-model="newCabin.cabinType.roomSize" id="roomSize" type="number" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="cabinQuantity">Số người 1 phòng</label>
                            <InputText v-model="newCabin.cabinType.maxGuests" id="maxGuests" type="number" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="cabinQuantity">Giá phòng</label>
                            <InputText v-model="newCabin.cabinType.price" id="price" type="number" />
                        </div>
                        <div class="field col-12">
                            <label for="description">Mô tả</label>
                            <Textarea v-model="newCabin.cabinType.description" id="description" rows="4" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="cabinQuantity">Số lượng phòng</label>
                            <InputText v-model="newCabin.roomQuantity" id="roomQuantity" type="number" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="tags">Danh mục</label>
                            <MultiSelect v-model="newCabin.cabinType.tagIds" 
                                        :options="tags" 
                                        optionLabel="name" 
                                        optionValue="id"
                                        placeholder="Chọn danh mục"
                                        :maxSelectedLabels="3" 
                                        class="w-full md:w-40rem" />
                        </div>
                    </div>
                    <Button type="submit" label="Thêm mới" severity="info" icon="pi pi-plus" @click="createCabinType()"/>
                </div>
            </div>
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


<script lang="ts">
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
            state: 'default',
            cruises: [] as any[],
            selectedCruise: ref(null),
            cabinTypeId: '',
            roomQuantity: '',
            tags: [{id: 0, name: ''}],
            items: ref([
                { label: 'Quản lý du thuyền' }, 
                { label: 'Phòng ngủ' }, 
            ]),
            home: ref({
                icon: 'pi pi-home'
            }),
            selectedTags: [{id: 0, name: ''}],
            cabinDetail: {
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
            },
            newCabin: {
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
                    tagIds: [],
                    cabinTypeImageIds: [],
                },
            },
            cabinType: {},
            cabins: [
                {
                    id: '',
                    roomQuantity: '',
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
        };
    },
    mounted() {
        this.fetchCabins();
        this.fetchCruises();
        this.fetchTags();
    },
    methods: {
        searchCabinTypeByName() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cabin-types/search?name=${this.newCabin.cabinType.name}`;
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
                this.cabinType = data;
                this.cabinTypeId = data.id;
                this.createCabin();
            })
            .catch(error => {
                console.log("Error fetching cruise list!", error);
            });
        },
        createCabin() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cabins/create`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    roomQuantity : this.roomQuantity,
                    cabinTypeId : this.cabinTypeId,
                    cruiseId : this.selectedCruise,
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
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Thêm phòng mới thành công!', life: 3000 });
                    this.changeState('default');
                    this.fetchCabinByCruiseId(this.selectedCruise);
                }
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi thêm mới loại phòng!', life: 3000 });
                console.log("Error creating cabin type!", error);
            });
        },
        createCabinType() {
            this.roomQuantity = this.newCabin.roomQuantity;
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cabin-types/create`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    name : this.newCabin.cabinType.name,
                    description : this.newCabin.cabinType.description,
                    maxGuests : this.newCabin.cabinType.maxGuests,
                    roomQuantity : this.newCabin.roomQuantity,
                    roomSize : this.newCabin.cabinType.roomSize,
                    price : this.newCabin.cabinType.price,
                    tagIds : this.newCabin.cabinType.tagIds,
                    cabinTypeImageIds : this.newCabin.cabinType.cabinTypeImageIds,
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
                    this.searchCabinTypeByName();
                }
                if(res.status ===500) {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Tên phòng đã tồn tại!', life: 3000 });
                }
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi thêm mới loại phòng!', life: 3000 });
                console.log("Error creating cabin type!", error);
            });
        },
        onCruiseChange() {
            if (this.selectedCruise) {
                this.fetchCabinByCruiseId(this.selectedCruise);
            } else {
                this.fetchCabins();
            }
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
        fetchCabinByCruiseId(cruiseId: any) {
            const url = `${api_url}/cabins?cruiseId=${cruiseId}`;
            fetch(url, {
            })
            .then(res => res.json())
            .then(data => {
                this.cabins = data;
                console.log("Cabin list: ", this.cabins);
            })
            .catch(error => {
                console.log("Error fetching cabin list!", error);
            });
        },
        fetchCabins() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cabins/auth`;
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
                this.cabins = data;
                console.log("Cabin list: ", this.cabins);
            })
            .catch(error => {
                console.log("Error fetching cabin list!", error);
            });
        },
        resetData() {
            this.fetchCabins();
            this.selectedCruise = null;
            this.selectedTags = [];
            this.newCabin = {
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
                    tagIds: [],
                    cabinTypeImageIds: [],
                },
            };
        },
        fetchTags() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/tags/`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                this.tags = data;
                console.log("Tags list: ", this.tags );
            })
            .catch(error => {
                console.log("Error fetching tags list!", error);
            });
        },
        confirm2(event: any, cabinId: number) {
            this.confirm.require({
                target: event.currentTarget,
                message: 'Bạn có chắc muốn xóa không?',
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
                acceptClass: 'p-button-danger p-button-sm',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                accept: () => {
                    this.removeCabin(cabinId);
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Đã hủy xóa!', life: 3000 });
                }
            });
        },
        removeCabin(cabinId: any) {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cabins/${cabinId}`;
            fetch(url, {
                method: 'DELETE',
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
            .then(res => {
                if(res.status === 500) {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Phòng đang có người đặt, Không thể xóa', life: 3000 });
                }
                if(res.status === 200) {
                    this.$toast.add({ severity: 'info', summary: 'Thao tác', detail: 'Xóa thành công!', life: 3000 });
                    setTimeout(() => {
                        this.fetchCabins();
                    }, 1500);
                }
            })
        },
        changeState(newState: string) {
            if(newState === 'create' && this.selectedCruise === null) {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Vui lòng chọn du thuyền trước khi thêm phòng!', life: 3000 });
                return;
            }
            this.state = newState;
        },
        fetchCabinDetail(cabinId: number) {
            this.state = 'update';
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cabins/${cabinId}`;
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
                this.cabinDetail = data;
                this.selectedTags = this.cabinDetail.cabinType.tags ? this.cabinDetail.cabinType.tags.map(tag => tag.id) : [];
                console.log("Cabin detail: ", data);
            })
            .catch(error => {
                console.log("Error fetching cabin detail!", error);
            });
        },
        updateCabin() {
            this.state = 'default';
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cabin-types/update/${this.cabinDetail.cabinType.id}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    name: this.cabinDetail.cabinType.name,
                    description: this.cabinDetail.cabinType.description,
                    maxGuests: this.cabinDetail.cabinType.maxGuests,
                    roomSize: this.cabinDetail.cabinType.roomSize,
                    price: this.cabinDetail.cabinType.price,
                    tagIds: this.selectedTags,
                    cabinTypeImageIds: this.cabinDetail.cabinType.cabinTypeImages.map(image => image.id),
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
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Sửa thông tin thành công', life: 3000 });
                    // toast.add({ severity: 'success', summary: 'Update', detail: `Sửa thông tin thành công`, life: 3000 });
                    setTimeout(() => {
                        this.changeState('default');
                        this.fetchCabins();
                    }, 1500);
                }
            })
            .catch(error => {
                // router.replace("/");
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi sửa thông tin!', life: 3000 });
                console.log("Error updating user!", error);
            });
        }
    }
};

</script>