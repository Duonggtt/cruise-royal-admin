
<template>
    <Toast/>
    <div v-if="isAdmin">
        <div class="pb-4">
            <span class="flex font-semibold text-3xl pb-3">Danh sách chủ sở hữu</span>
            <Breadcrumb :home="home" :model="items" />
        </div>
        
        <div class="card">
            <div class="flex justify-content-between">
                <div class="flex gap-2">
                    <span>
                        <Button label="Thêm mới" severity="info" icon="pi pi-plus" @click="displayModal = true"/>
                        <Dialog v-model:visible="displayModal" modal header="Thêm chủ sở hữu mới" :style="{ width: '50vw' }">
                            <div class="flex flex-column gap-2">
                                <label for="name">Họ tên</label>
                                <InputText id="name" v-model="ownerNew.name" placeholder="Nhập tên chủ sở hữu" />
                            </div>
                            <template #footer>
                                <Button label="Hủy" icon="pi pi-times" @click="closeModal" text />
                                <Button label="Lưu" icon="pi pi-check" @click="saveNewOwner" autofocus />
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
            <DataTable showGridlines :value="owners" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                <Column field="id" header="ID" style="width: 25%"></Column>
                <Column field="name" header="Họ tên" style="width: 25%"></Column>
                <Column header="Thao tác" style="width: 20%">
                    <template #body="slotProps">
                       <div class="flex gap-2">
                        <ConfirmPopup></ConfirmPopup>
                        <Button icon="pi pi-search" severity="success" aria-label="Search" @click="fetchOwnerDetail(slotProps.data.id)" />
                        <Button icon="pi pi-times" severity="danger" label="Hủy hợp tác" aria-label="Cancel" @click="confirm2($event, slotProps.data.id)"/>
                       </div>
                    </template>
                </Column>
            </DataTable>
            <Dialog v-model:visible="displayDetailModal" modal header="Chi tiết chủ sở hữu" :style="{ width: '30vw' }">
                <div class="flex flex-column gap-2">
                    <div><strong>Mã chủ sở hữu:</strong> {{ ownerDetail.id }}</div>
                    <div><strong>Họ tên:</strong> {{ ownerDetail.name }}</div>
                    <div v-if="ownerDetail.cruiseNames && ownerDetail.cruiseNames.length > 0">
                        <strong>Du thuyền sở hữu:</strong>
                        <ul>
                            <li v-for="(cruiseName, index) in ownerDetail.cruiseNames" :key="index">
                                {{ cruiseName }}
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <strong>Du thuyền sở hữu:</strong> Không có
                    </div>
                </div>
                <template #footer>
                    <Button label="Đóng" icon="pi pi-times" @click="displayDetailModal = false" text />
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

interface OwnerNew {
  name: string;
}

interface OwnerDetail {
    id: number;
    name: string;
    cruiseNames: string[];
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
            displayModal: false,
            searchName: '',
            items: ref([
                { label: 'Quản lý thông tin chủ sở hữu' }, 
                { label: 'Chủ sở hữu' }, 
            ]),
            roles: [],
            role: {id:'',name:''},
            home: ref({
                icon: 'pi pi-home'
            }),
            owners: [{id: '', name: ''}],
            ownerNew: {
                name: '',
            } as OwnerNew,
            ownerDetail: {
                id: 0,
                name: '',
                cruiseNames: [],
            } as OwnerDetail,
            displayDetailModal: false,
        };
    },
    mounted() {
        this.fetchOwners();
    },
    methods: {
        fetchOwnerDetail(ownerId: any) {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/owners/detail/${ownerId}`;
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
                this.ownerDetail = data;
                this.displayDetailModal = true;
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi lấy thông tin chủ sở hữu!', life: 3000 });
                console.log("Error fetching owner details!", error);
            });
        },
        closeModal() {
            this.displayModal = false;
            this.ownerNew.name = '';
        },

        saveNewOwner() {
            if (this.ownerNew.name.trim()) {
                this.createOwner();
                this.closeModal();
            } else {
                this.$toast.add({ severity: 'warn', summary: 'Lỗi', detail: 'Vui lòng nhập tên chủ sở hữu', life: 3000 });
            }
        },
        searchByName() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/owners/search?name=${this.searchName}`;
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
                this.owners = data;
            })
            .catch(error => {
                // router.replace("/");
                console.log("Error fetching owners list!", error);
            });
        },
        resetData() {
            this.searchName = '';
            this.fetchOwners();
        },
        fetchOwners() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/owners/auth`;
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
                this.owners = data;
            })
            .catch(error => {
                // router.replace("/");
                console.log("Error fetching owners list!", error);
            });

        },
        createOwner() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/owners/create`;  // Update this to the correct endpoint
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify(this.ownerNew)
            })
            .then(res => {
                if (res.status === 403) {
                    this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res.json();
            })
            .then(data => {
                this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Tạo chủ sở hữu thành công!', life: 3000 });
                this.ownerNew.name = '';
                this.fetchOwners();  // Refresh the list after creating a new owner
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi tạo chủ sở hữu!', life: 3000 });
                console.log("Error creating owner!", error);
            });
        },
        updateOwner(ownerId: any) {
            const access_token = localStorage.getItem('access_token');
            // const toast = useToast();
            const url = `${api_url}/auth/user/update/${userId}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify(this.userDetail)
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
                console.log("response: ", this.userDetail)
                if(res.status === 200) {
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Sửa thông tin thành công', life: 3000 });
                    // toast.add({ severity: 'success', summary: 'Update', detail: `Sửa thông tin thành công`, life: 3000 });
                    setTimeout(() => {
                        this.fetchOwners();
                    }, 1500);
                }
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi sửa thông tin!', life: 3000 });
            });
        },
        confirm2(event: any, ownerId: number) {
            this.confirm.require({
                target: event.currentTarget,
                message: 'Bạn có chắc muốn xóa không?',
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
                acceptClass: 'p-button-danger p-button-sm',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                accept: () => {
                    this.removeOwner(ownerId);
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Đã hủy xóa!', life: 3000 });
                }
            });
        },
        removeOwner(ownerId: number) {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/owners/${ownerId}`;
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
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Người này vẫn đang sở hữu du thuyền!', life: 3000 });
                }
                if(res.status === 200) {
                    this.$toast.add({ severity: 'info', summary: 'Thao tác', detail: 'Xóa thành công!', life: 3000 });
                    setTimeout(() => {
                        this.fetchOwners();
                    }, 1500);
                }
            })
        },
    },
};
</script>