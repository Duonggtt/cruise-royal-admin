<template>
    <Toast/>
    <div v-if="state === 'default'">
        <div class="pb-4">
            <span class="flex font-semibold text-3xl pb-3">Danh sách du thuyền</span>
            <Breadcrumb :home="home" :model="items" />
        </div>
        
        <div class="card">
            <div class="flex justify-content-between">
                <div class="flex gap-2">
                    <span>
                        <Button label="Thêm mới" severity="info" icon="pi pi-plus" @click="changeState('create')"/>
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
            <DataTable showGridlines :value="cruises" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                <Column field="id" header="ID" style="width: 10%"></Column>
                <Column field="name" header="Tên du thuyền" style="width: 20%"></Column>
                <Column field="price" header="Giá thuyền" style="width: 15%"></Column>
                <Column field="launchedYear" header="Năm ra mắt" style="width: 15%"></Column>
                <Column field="cabinQuantity" header="Số lượng cabin" style="width: 15%"></Column>
                <Column field="owner.name" header="Chủ sở hữu" style="width: 15%"></Column>
                <Column header="Thao tác" style="width: 25%">
                <template #body="slotProps">
                    <div class="flex gap-2">
                    <ConfirmPopup></ConfirmPopup>
                    <Button icon="pi pi-search" severity="success" aria-label="Search" @click="fetchCruiseDetail(slotProps.data.id)"/>
                    <Button icon="pi pi-times" severity="danger" aria-label="Cancel" @click="confirm2($event, slotProps.data.id)" />
                    </div>
                </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <div v-else-if="state === 'update'">
        <div class="pb-1 flex justify-content-between">
            <span class="font-semibold text-3xl">Chi tiết du thuyền</span>
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
                        <label for="cruiseId">Mã du thuyền</label>
                        <InputText v-model="cruiseDetail.id" disabled id="cruiseId" type="text" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="name">Tên du thuyền</label>
                        <InputText v-model="cruiseDetail.name" id="name" type="text" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="launchedYear">Năm ra mắt</label>
                        <InputText v-model="cruiseDetail.launchedYear" id="launchedYear" type="number" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="cabinQuantity">Số lượng cabin</label>
                        <InputText v-model="cruiseDetail.cabinQuantity" id="cabinQuantity" type="number" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="material">Chất liệu</label>
                        <InputText v-model="cruiseDetail.material" id="material" type="text" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="owner">Chủ sở hữu</label>
                        <Dropdown id="role" v-model="cruiseDetail.owner.id" :options="owners" optionValue="id" optionLabel="name" placeholder="Chọn vai trò"></Dropdown>
                    </div>
                    <div class="field col-12">
                        <label for="description">Mô tả</label>
                        <Textarea v-model="cruiseDetail.description" id="description" rows="4" />
                    </div> 
                    <div class="field col-12">
                        <label for="shortDesc">Mô tả ngắn</label>
                        <Textarea v-model="formattedShortDesc" id="shortDesc" rows="4" />
                    </div>
                    <div class="field col-12">
                        <label for="rule">Luật lệ</label>
                        <hr>
                        <span class="flex pl-4 text-blue-500">{{ formattedRules }}</span>
                        <hr>
                        <!-- <Textarea v-modal="formattedRules" id="rule" rows="4" /> -->
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="tag">Danh mục</label>
                        <MultiSelect v-model="selectedTags" 
                                    display="chip" 
                                    :options="tags" 
                                    optionLabel="name" 
                                    optionValue="id"
                                    placeholder="Chọn danh mục"
                                    :maxSelectedLabels="3" 
                                    class="w-full md:w-40rem" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="routes">Lộ trình</label>
                        <Dropdown v-model="selectedRouteId" 
                        :options="routes" 
                        optionLabel="name" 
                        optionValue="id"
                        placeholder="Chọn lịch trình" 
                        class="w-full md:w-40rem"
                        @change="updateSelectedLocation" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="price">Giá</label>
                        <InputText v-model="cruiseDetail.price" id="price" type="number" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="ownedDate">Ngày sở hữu</label>
                        <InputText v-model="formattedOwnedDate" id="ownedDate" type="date" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="departureTime">Giờ khởi hành</label>
                        <InputText v-model="cruiseDetail.departureTime" id="departureTime" type="time" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="arrivalTime">Giờ đến</label>
                        <InputText v-model="cruiseDetail.arrivalTime" id="arrivalTime" type="time" />
                    </div>
                </div>
                <Button type="submit" label="Sửa" severity="info" icon="pi pi-pencil" @click="updateCruise(cruiseDetail.id)"/>
            </div>
        </div>
    </div>
    <div v-else-if="state === 'create'">
        <div class="pb-1 flex justify-content-between">
            <span class="font-semibold text-3xl">Thêm mới du thuyền</span>
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
                        <label for="name">Tên du thuyền</label>
                        <InputText v-model="newCruise.name" id="name" type="text" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="launchedYear">Năm ra mắt</label>
                        <InputText v-model="newCruise.launchedYear" id="launchedYear" type="number" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="cabinQuantity">Số lượng cabin</label>
                        <InputText v-model="newCruise.cabinQuantity" id="cabinQuantity" type="number" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="material">Chất liệu</label>
                        <InputText v-model="newCruise.material" id="material" type="text" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="owner">Chủ sở hữu</label>
                        <Dropdown v-model="newCruise.ownerId" :options="owners" optionLabel="name" optionValue="id" placeholder="Chọn chủ sở hữu"></Dropdown>
                    </div>
                    
                    <div class="field col-12 md:col-6">
                        <label for="rules">Luật lệ</label>
                        <MultiSelect v-model="newCruise.ruleIds" 
                                    :options="rules" 
                                    optionLabel="content" 
                                    optionValue="id"
                                    placeholder="Chọn luật lệ" />
                    </div>
                    <div class="field col-12">
                        <label for="description">Mô tả</label>
                        <Textarea v-model="newCruise.description" id="description" rows="4" />
                    </div>
                    <div class="field col-12">
                        <label for="shortDesc">Mô tả ngắn</label>
                        <Textarea v-model="formattedShortDesc" id="shortDesc" rows="4" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="tags">Danh mục</label>
                        <MultiSelect v-model="newCruise.tagIds" 
                                    :options="tags" 
                                    optionLabel="name" 
                                    optionValue="id"
                                    placeholder="Chọn danh mục"
                                    :maxSelectedLabels="3" 
                                    class="w-full md:w-40rem" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="location">Lộ trình</label>
                        <Dropdown v-model="newCruise.locationId" 
                                :options="routes" 
                                optionLabel="name" 
                                optionValue="id"
                                placeholder="Chọn lịch trình" 
                                class="w-full md:w-40rem" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="price">Giá</label>
                        <InputText v-model="newCruise.price" id="price" type="number" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="ownedDate">Ngày sở hữu</label>
                        <InputText v-model="newCruise.ownedDate" id="ownedDate" type="date" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="departureTime">Giờ khởi hành</label>
                        <InputText v-model="newCruise.departureTime" id="departureTime" type="time" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="arrivalTime">Giờ đến</label>
                        <InputText v-model="newCruise.arrivalTime" id="arrivalTime" type="time" />
                    </div>
                </div>
                <Button type="submit" label="Thêm mới" severity="info" icon="pi pi-plus" @click="createCruise"/>
            </div>
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
        formattedShortDesc: {
            get() {
                return this.cruiseDetail.shortDesc ? this.cruiseDetail.shortDesc.join('\n') : '';
            },
            set(value: any) {
                this.cruiseDetail.shortDesc = value.split('\n').map((item: string) => item.trim()).filter((item: string) => item !== '');
            }
        },
        formattedRules() {
            if (!this.cruiseDetail.rules || this.cruiseDetail.rules.length === 0) {
                return "Chưa có luật lệ!!";
            }
            return this.cruiseDetail.rules.map((rule: { content: any; }) => `- ${rule.content}`).join('\n');
        },
        isAdmin() { 
            return useAuthStore().isAdmin;
        },
        formattedOwnedDate: {
            get() {
                if (this.cruiseDetail.ownedDate) {
                const date = new Date(this.cruiseDetail.ownedDate);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
                }
                return '';
            },
            set(value: string|number|Date) {
                if (value) {
                const date = new Date(value);
                this.cruiseDetail.ownedDate = date.toISOString();
                } else {
                this.cruiseDetail.ownedDate = '';
                }
            }
        },
    },
    data() {
        return {
            selectedRouteId: null as number | null,
            selectedRouteName: '',
            cruises: [] as any[],
            selectedTags: [{id: 0, name: ''}],
            tags: [{id: 0, name: ''}],
            routes: [] as { name: string; id: number }[],
            locations: [],  
            searchName: '',
            items: ref([
                { label: 'Quản lý du thuyền' }, 
                { label: 'Du thuyền' }, 
            ]),
            roles: [],
            role: {id:'',name:''},
            home: ref({
                icon: 'pi pi-home'
            }),
            rules: [
                {
                    id: 0,
                    content: ''
                }
            ],
            state: 'default',
            cruiseDetailId: 0,
            cruiseDetail: {
                id: 0,
                name: '',
                launchedYear: 0,
                cabinQuantity: 0,
                material: '',
                description: '',
                price: 0,
                ownedDate: '',
                departureTime: '',
                shortDesc: [],
                arrivalTime: '',
                rules: [
                    {
                        id: 0,
                        content: ''
                    }
                ],
                tags: [],
                location: {
                    id: 0,
                    routeName: '',
                    address: '',
                    city: 0
                },
                owner: {
                    id: 0,
                    name: ''
                }
            },
            newCruise: {
                name: '',
                launchedYear: null,
                cabinQuantity: null,
                material: '',
                shortDesc: [],
                description: '',
                price: null,
                ownedDate: null,
                departureTime: null,
                arrivalTime: null,
                ruleIds: [],
                tagIds: [],
                ownerId: null,
                locationId: null
            },
            owners: [
                {
                    id: 0, 
                    name: ''
                }
            ],
        };
    },
    mounted() {
        this.fetchCruises();
        this.fetchOwners();
        this.fetchTags();
        this.fetchLocation();
        this.fetchRules();
    },
    methods: {
        onAdvancedUpload() {
            this.$toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
        },
        fetchRules() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/rules/auth`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                this.rules = data;
                console.log("rules list: ", this.rules );
            })
            .catch(error => {
                console.log("Error fetching rules list!", error);
            });
        },
        fetchLocation() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/locations/auth/`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                this.locations = data;
                console.log("Location list: ", this.locations);
                this.routes = this.locations.map((location: { routeName: string; id: number }) => {
                    return { name: location.routeName, id: location.id };
                });
            })
            .catch(error => {
                console.log("Error fetching locations list!", error);
            });
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
        fetchOwners() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/owners/auth`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                this.owners = data;
                console.log("Owner list: ", this.owners);
            })
            .catch(error => {
                console.log("Error fetching owners list!", error);
            });
        },
        resetData() {
            this.searchName = '';
            this.fetchCruises();
        },
        confirm2(event: any, cruiseId: number) {
            this.confirm.require({
                target: event.currentTarget,
                message: 'Bạn có chắc muốn xóa không?',
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
                acceptClass: 'p-button-danger p-button-sm',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                accept: () => {
                    this.removeCruise(cruiseId);
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Đã hủy xóa!', life: 3000 });
                }
            });
        },
        changeState(newState: string) {
            this.state = newState;
        },
        searchByName() {
            if(this.searchName === '') {
                this.$toast.add({ severity: 'warn', summary: 'Tìm kiếm', detail: 'Vui lòng nhập tên du thuyền !', life: 3000 });
                return;
            }
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cruises/filter?name=${this.searchName}`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
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
                this.cruises = [];
                this.cruises = [...(data as any[])];
                console.log("Cruise list: ", this.cruises);
                return this.cruises;
            })
            .catch(error => {
                // router.replace("/");
                this.$toast.add({ severity: 'error', summary: 'Tìm kiếm', detail: 'Không tìm thấy thông tin du thuyền!', life: 3000 });
                console.log("Error searching cruise!", error);
            });
        },
        updateSelectedLocation() {
            const selectedRoute = this.routes.find(route => route.id === this.selectedRouteId);
            if (selectedRoute) {
                this.cruiseDetail.location = this.locations.find(location => location.id === selectedRoute.id) || {
                    id: selectedRoute.id,
                    routeName: selectedRoute.name,
                    address: '',
                    city: 0
                };
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
        removeCruise(id: number) {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cruises/delete/${id}`;
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
                if(res.status === 500) {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Du thuyền đã có người đặt, không thể xóa!', life: 3000 });
                }
                if(res.status === 200) {
                    this.$toast.add({ severity: 'info', summary: 'Thao tác', detail: 'Xóa thành công!', life: 3000 });
                    setTimeout(() => {
                        this.fetchCruises();
                    }, 1500);
                }
            })
        },
        fetchCruiseDetail(cruiseId: number) {
            // const toast = useToast();
            this.changeState('update');
            this.cruiseDetailId = cruiseId;
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cruises/auth/${cruiseId}`;
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
                // this.userDetail = data;  
                this.cruiseDetail = data;
                this.selectedTags = this.cruiseDetail.tags ? this.cruiseDetail.tags.map(tag => tag.id) : [];
                this.selectedRouteId = this.cruiseDetail.location?.id || null;
                if (!Array.isArray(this.cruiseDetail.shortDesc)) {
                    this.cruiseDetail.shortDesc = this.cruiseDetail.shortDesc ? [this.cruiseDetail.shortDesc] : [];
                }
                console.log("Cruise detail: ", this.cruiseDetail);
            })
            .catch(error => {
                // router.replace("/");
                console.log("Error fetching cruise list!", error);
            });
        },
        createCruise() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/cruises/create`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    name: this.newCruise.name,
                    launchedYear: this.newCruise.launchedYear,
                    cabinQuantity: this.newCruise.cabinQuantity,
                    material: this.newCruise.material,
                    description: this.newCruise.description,
                    price: this.newCruise.price,
                    ownedDate: this.newCruise.ownedDate,
                    departureTime: this.newCruise.departureTime,
                    arrivalTime: this.newCruise.arrivalTime,
                    shortDesc: this.formattedShortDesc.split('\n').map(item => item.trim()).filter(item => item !== ''),
                    ruleIds: this.newCruise.ruleIds,
                    tagIds: this.newCruise.tagIds,
                    locationId: this.newCruise.locationId,
                    ownerId: this.newCruise.ownerId
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
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Thêm mới du thuyền thành công', life: 3000 });
                    setTimeout(() => {
                        this.changeState('default');
                        this.fetchCruises();
                    }, 1500);
                }
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi thêm mới du thuyền!', life: 3000 });
                console.log("Error creating cruise!", error);
            });
        },
        formatDate(date: any) {
            return date.toISOString().split('T')[0];
        },
        formatTime(time: any) {
            return time.toTimeString().split(' ')[0];
        },
        updateCruise(cruiseId: number) {
            const access_token = localStorage.getItem('access_token');
            // const toast = useToast();
            const url = `${api_url}/cruises/update/${cruiseId}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    name: this.cruiseDetail.name,
                    launchedYear: this.cruiseDetail.launchedYear,   
                    cabinQuantity: this.cruiseDetail.cabinQuantity,
                    material: this.cruiseDetail.material,
                    description: this.cruiseDetail.description,
                    price: this.cruiseDetail.price,
                    ownedDate: this.cruiseDetail.ownedDate,
                    departureTime: this.cruiseDetail.departureTime,
                    arrivalTime: this.cruiseDetail.arrivalTime,
                    shortDesc: this.formattedShortDesc.split('\n').map(item => item.trim()).filter(item => item !== ''),
                    ruleIds: this.cruiseDetail.rules.map((rule: { id: any; }) => rule.id),
                    tagIds: this.selectedTags,
                    locationId: this.selectedRouteId,
                    ownerId: this.cruiseDetail.owner.id
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
                console.log("response: ", this.cruiseDetail)
                if(res.status === 201) {
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Sửa thông tin thành công', life: 3000 });
                    // toast.add({ severity: 'success', summary: 'Update', detail: `Sửa thông tin thành công`, life: 3000 });
                    setTimeout(() => {
                        this.changeState('default');
                        this.fetchCruises();
                    }, 1500);
                }
            })
            .catch(error => {
                console.log(this.cruiseDetail)
                // router.replace("/");
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi sửa thông tin!', life: 3000 });
                console.log("Error updating user!", error);
            });
        },
    }
};
</script>