
<template>
    <Toast/>
    <div v-if="state === 'default'">
        <div class="pb-4">
            <span class="flex font-semibold text-3xl pb-3">Danh sách người dùng</span>
            <Breadcrumb :home="home" :model="items" />
        </div>
        
        <div class="card">
            <div class="flex justify-content-between">
                <div>
                    <Button label="Thêm mới" severity="info" icon="pi pi-plus" @click="changeState('create')"/>
                </div>
                <IconField iconPosition="left">
                    <InputIcon class="pi pi-search cursor-pointer"> </InputIcon>
                    <InputText placeholder="Search" />
                </IconField>
            </div>
            <hr>
            <DataTable showGridlines :value="users" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                <Column field="id" header="ID" style="width: 25%"></Column>
                <Column field="name" header="Họ tên" style="width: 25%"></Column>
                <Column field="email" header="Email" style="width: 25%"></Column>
                <Column field="phone" header="Số điện thoại" style="width: 25%"></Column>
                <Column header="Thao tác" style="width: 20%">
                    <template #body="slotProps">
                       <div class="flex gap-2">
                        <ConfirmPopup></ConfirmPopup>
                        <Button icon="pi pi-search" severity="success" aria-label="Search" @click="fetchUserDetail(slotProps.data.id)" />
                        <Button icon="pi pi-times" severity="danger" aria-label="Cancel"   @click="confirm2($event, slotProps.data.id)"/>
                       </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <div v-else-if="state === 'update'">
        <div class="pb-1 flex justify-content-between">
            <span class="font-semibold text-3xl">Chi tiết người dùng</span>
            <span class="mr-4">
                <Button label="Quay lại" class="flex justify-end float-end" severity="info" icon="pi pi-undo" @click="changeState('default')"/>
            </span>
        </div>
        <div class="col-12 mt-2">
            <div class="card">
                <span class="text-xl text-gray-600 font-semibold">Profile</span>
                <hr>
                <div class="p-fluid formgrid grid mt-2 mb-4">
                    <div class="field col-12 md:col-6">
                        <label for="userId">Mã người dùng</label>
                        <InputText v-model="userDetail.id" disabled id="userId" type="text" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="name">Họ tên</label>
                        <InputText v-model="userDetail.name" id="name" type="text" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="username">Tên đăng nhập</label>
                        <InputText v-model="userDetail.username" id="username" type="text" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="password">Mật khẩu</label>
                        <InputText disabled v-model="userDetail.password" id="password" type="password" placeholder="đã mã hóa"/>
                    </div>
                    <div class="field col-12">
                        <label for="address">Địa chỉ</label>
                        <Textarea v-model="userDetail.address" id="address" rows="4" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="email">Email</label>
                        <InputText v-model="userDetail.email" id="email" type="text" />
                    </div>
                    <div v-if="isAdmin" class="field col-12 md:col-3">
                        <label for="role">Vai trò</label>
                        <Dropdown id="role" v-model="userDetail.roleIds[0]" :options="formattedRoles" optionValue="id" optionLabel="name" placeholder="Chọn vai trò"></Dropdown>
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="phone">Số điện thoại</label>
                        <InputText v-model="userDetail.phone" id="phone" type="text" />
                    </div>
                </div>
                <Button type="submit" label="Sửa" severity="info" icon="pi pi-pencil" @click="updateUser(userDetail.id)"/>
            </div>
        </div>
    </div>
    <div v-else-if="state === 'create'">
        <div class="pb-1 flex justify-content-between">
            <span class="font-semibold text-3xl">Thêm mới người dùng</span>
            <span class="mr-4">
                <Button label="Quay lại" class="flex justify-end float-end" severity="info" icon="pi pi-undo" @click="changeState('default')"/>
            </span>
        </div>
        <div class="col-12 mt-2">
            <div class="card">
                <span class="text-xl text-gray-600 font-semibold">Profile</span>
                <hr>
                <div class="p-fluid formgrid grid mt-2 mb-4">
                    <div class="field col-12 md:col-6">
                        <label for="userIdcr">Mã người dùng</label>
                        <InputText disabled id="userIdcr" type="text" placeholder="Tự động tạo"/>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="namecr">Họ tên</label>
                        <InputText v-model="userNew.name" id="namecr" type="text" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="usernamecr">Tên đăng nhập</label>
                        <InputText v-model="userNew.username" id="usernamecr" type="text"/>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="passwordcr">Mật khẩu</label>
                        <InputText v-model="userNew.password" id="passwordcr" type="password"/>
                    </div>
                    <div class="field col-12">
                        <label for="addresscr">Địa chỉ</label>
                        <Textarea v-model="userNew.address" id="addresscr" rows="4" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="emailcr">Email</label>
                        <InputText v-model="userNew.email" id="emailcr" type="text" />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="rolecr">Vai trò</label>
                        <Dropdown id="rolecr" v-model="userNew.roleIds[0]" :options="formattedRoles"  optionValue="id" optionLabel="name" placeholder="Select role"></Dropdown>
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="phonecr">Số điện thoại</label>
                        <InputText v-model="userNew.phone" id="phonecr" type="text" />
                    </div>
                </div>
                <Button type="submit" label="Thêm mới" severity="info" icon="pi pi-plus" @click="createUser()"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" >
import Vue from 'vue'
import {useAuthStore} from '@/stores/counter';
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { useConfirm } from "primevue/useconfirm";

interface UserNew {
  name: string;
  username: string;
  password: string;
  address: string;
  email: string;
  roleIds: number[]; 
  phone: string;
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
        formattedRoles() {
            return this.roles.map((rl: { id:any, name: any; }) => {
                let name = rl.name;
                switch(rl.name) {
                case 'ROLE_USER':
                    name = 'Khách hàng';
                    break;
                case 'ROLE_EMPLOYEE':
                    name = 'Nhân viên';
                    break;
                case 'ROLE_ADMIN':
                    name = 'Quản lý';
                    break;
                }
                return { ...rl, name };
            });
        }
    },
    data() {
        return {
            items: ref([
                { label: 'Quản lý người dùng' }, 
                { label: 'Người dùng' }, 
            ]),
            roles: [],
            role: {id:'',name:''},
            home: ref({
                icon: 'pi pi-home'
            }),
            state: 'default',
            users: [],
            userDetail: {
                id:'',
                name: '',
                username: '',
                password: '',
                address: '',
                email: '',
                roleIds: [],
                phone: ''
            },
            userNew: {
                name: '',
                username: '',
                password: '',
                address: '',
                email: '',
                roleIds: [],
                phone: ''
            } as UserNew,
            userDetailId: 0
        };
    },
    mounted() {
        this.fetchUsers();
        this.fetchRoles();
    },
    methods: {
        areRequiredFieldsEmpty(): boolean{
            const requiredFields: (keyof UserNew)[] = ['name', 'username', 'password', 'address', 'email', 'phone'];
            return requiredFields.some((field) => !this.userNew[field]);
        },
        createUser() {
            if (this.areRequiredFieldsEmpty()) {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Vui lòng điền đầy đủ thông tin!', life: 3000 });
                return;
            }
            console.log(this.userNew);
            const access_token = localStorage.getItem('access_token');
            const url = `http://localhost:8080/api/auth/user/create`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify(this.userNew)
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
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Tạo người dùng thành công!', life: 3000 });
                    setTimeout(() => {
                        this.userNew = {
                            name: '',
                            username: '',
                            password: '',
                            address: '',
                            email: '',
                            roleIds: [],
                            phone: ''
                        };
                        this.changeState('default');
                        this.fetchUsers();
                    }, 1500);
                }
            })
            .catch(error => {
                console.log(this.userDetail)
                // router.replace("/");
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi tạo người dùng!', life: 3000 });
                console.log("Error creating user!", error);
            });
        },
        updateUser(userId: any) {
            const access_token = localStorage.getItem('access_token');
            // const toast = useToast();
            const url = `http://localhost:8080/api/auth/user/update/${userId}`;
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
                        this.changeState('default');
                        this.fetchUsers();
                    }, 1500);
                }
            })
            .catch(error => {
                console.log(this.userDetail)
                // router.replace("/");
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi sửa thông tin!', life: 3000 });
                console.log("Error updating user!", error);
            });
        },
        fetchUserDetail(userId: number) {
            // const toast = useToast();
            this.changeState('update');
            this.userDetailId = userId;
            const access_token = localStorage.getItem('access_token');
            const url = `http://localhost:8080/api/user/detail/${userId}`;
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
                this.userDetail = data;  
                this.role = data.roleIds[0];
                console.log("role: ",this.role)
                console.log("User detail:",this.userDetail);
            })
            .catch(error => {
                // router.replace("/");
                console.log("Error fetching role list!", error);
            });
        },
        fetchRoles() {
            const toast = useToast();
            const access_token = localStorage.getItem('access_token');
            const url = `http://localhost:8080/api/roles`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}` // Use the token here
                }
            })
            .then(res => {
                // If the token has expired
               if (res.status === 403) {
                this.$toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                 useAuthStore().logout();
               }
                return res;
            })
            .then(res => res.json())
            .then(data => {
                this.roles = data;
                console.log(this.roles);
            })
            .catch(error => {
                // router.replace("/");
                console.log("Error fetching role list!", error);
            });

        },
        confirm2(event: any, userId: number) {
            this.confirm.require({
                target: event.currentTarget,
                message: 'Bạn có chắc muốn xóa không?',
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
                acceptClass: 'p-button-danger p-button-sm',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                accept: () => {
                    this.removeUser(userId);
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Đã hủy xóa!', life: 3000 });
                }
            });
        },
        changeState(newState: string) {
            this.state = newState;
        },
        removeUser(userId: number) {
            const access_token = localStorage.getItem('access_token');
            const url = `http://localhost:8080/api/auth/user/${userId}`;
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
                    this.$toast.add({ severity: 'info', summary: 'Thao tác', detail: 'Xóa thành công!', life: 3000 });
                    setTimeout(() => {
                        this.fetchUsers();
                    }, 1500);
                }
            })
        },
        fetchUsers() {
            // const toast = useToast();
            const access_token = localStorage.getItem('access_token');
            const url = `http://localhost:8080/api/users`;
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
                this.users = data;
            })
            .catch(error => {
                // router.replace("/");
                console.log("Error fetching class list!", error);
            });

        },
        deleteUser(userId: number) {
            // Logic to delete user
            console.log('Deleting user', userId);
        }
    },
};
</script>