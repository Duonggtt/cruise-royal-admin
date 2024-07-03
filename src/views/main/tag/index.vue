<template>
    <Toast/>
    <div v-if="state === 'default'">
        <div class="pb-4">
            <span class="flex font-semibold text-3xl pb-3">Danh sách danh mục</span>
            <Breadcrumb :home="home" :model="items" />
        </div>
        
        <div class="card">
            <div class="flex justify-content-between w-full">
                <div class="flex gap-2">
                    <span>
                        <Button label="Thêm mới" severity="info" icon="pi pi-plus" @click="openNewTagDialog"/>
                        <Dialog v-model:visible="showNewTagDialog" modal header="Thêm mới danh mục" :style="{ width: '50vw' }">
                            <div class="p-fluid">
                                <div class="field">
                                    <label for="name">Tên danh mục</label>
                                    <InputText id="name" v-model="newTag.name" required autofocus />
                                </div>
                                <div class="field">
                                    <label for="icon">Biểu tượng</label>
                                    <InputText id="icon" v-model="newTag.icon" required />
                                </div>
                            </div>
                            <template #footer>
                                <Button label="Hủy" icon="pi pi-times" @click="closeNewTagDialog" class="p-button-text"/>
                                <Button label="Lưu" icon="pi pi-check" @click="createNewTag" autofocus />
                            </template>
                        </Dialog>
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
            <DataTable showGridlines :value="tags" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                <Column field="id" header="ID" style="width: 10%"></Column>
                <Column field="name" header="tên danh mục" style="width: 20%"></Column>
                <Column field="icon" header="Biểu tượng" style="width: 15%"></Column>
                <Column header="Thao tác" style="width: 25%">
                <template #body="slotProps">
                    <div class="flex gap-2">
                    <ConfirmPopup></ConfirmPopup>
                    <Button icon="pi pi-search" severity="success" aria-label="Search" @click="openTagDetails(slotProps.data.id)"/>
                    <Button icon="pi pi-times" severity="danger" aria-label="Cancel" @click="confirm2($event, slotProps.data.id)" />
                    </div>
                </template>
                </Column>
            </DataTable>
            <Dialog v-model:visible="showTagDetailsDialog" modal header="Chi tiết danh mục" :style="{ width: '50vw' }">
                        <div v-if="selectedTag" class="p-fluid">
                            <div class="field">
                                <label>ID</label>
                                <InputText v-model="selectedTag.id" disabled />
                            </div>
                            <div class="field">
                                <label>Tên danh mục</label>
                                <InputText v-model="selectedTag.name" required />
                            </div>
                            <div class="field">
                                <label>Biểu tượng</label>
                                <InputText v-model="selectedTag.icon" required />
                            </div>
                        </div>
                        <template #footer>
                            <Button label="Đóng" icon="pi pi-times" @click="closeTagDetailsDialog" autofocus />
                            <Button label="Lưu" icon="pi pi-check" @click="updateTag" autofocus />
                        </template>
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
            tags: [{id: 0, icon:'', name: ''}],
            items: ref([
                { label: 'Quản lý du thuyền' }, 
                { label: 'Danh mục' }, 
            ]),
            home: ref({
                icon: 'pi pi-home'
            }),
            searchName: '',
            showNewTagDialog: false,
            showTagDetailsDialog: false,
            newTag: { name: '', icon: '' },
            selectedTag: { id: 0, name: '', icon: '' },
            selectedTagId: '',
        };
    },
    mounted() {
        this.fetchTags();
    },
    methods: {
        openNewTagDialog() {
            this.showNewTagDialog = true;
        },

        closeNewTagDialog() {
            this.showNewTagDialog = false;
            this.newTag = { name: '', icon: '' };
        },
        updateTag() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/tags/update/${this.selectedTagId}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    icon: this.selectedTag.icon,
                    name: this.selectedTag.name
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
                        console.log('Updating tag:', this.selectedTag);
                        this.closeTagDetailsDialog();
                        this.fetchTags();
                    }, 1500);
                }
            })
            .catch(error => {
                // router.replace("/");
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi sửa thông tin!', life: 3000 });
                console.log("Error updating tag!", error);
            });
        },
        createNewTag() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/tags/create`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    icon: this.newTag.icon,
                    name: this.newTag.name
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
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Thêm mới danh mục thành công', life: 3000 });
                    setTimeout(() => {
                        console.log('Creating new tag:', this.newTag);
                        this.closeNewTagDialog();
                        this.fetchTags();
                    }, 1500);
                }
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi thêm mới danh mục!', life: 3000 });
                console.log("Error creating tags!", error);
            });
        },
        openTagDetails(tagId: any) {
            this.fetchDetailTag(tagId);
            this.selectedTagId = tagId;
            this.showTagDetailsDialog = true;
        },
        fetchDetailTag(tagId: any) {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/tags/${tagId}`;
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                this.selectedTag = data;
                console.log("Selected tag: ", this.selectedTag);
            })
            .catch(error => {
                console.log("Error fetching tag detail!", error);
            });
        },
        closeTagDetailsDialog() {
            this.showTagDetailsDialog = false;
            this.selectedTag = { id: 0, name: '', icon: '' };
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
        resetData() {
            this.fetchTags();
            this.searchName = '';
        },
        confirm2(event: any, tagId: number) {
            this.confirm.require({
                target: event.currentTarget,
                message: 'Bạn có chắc muốn xóa không?',
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
                acceptClass: 'p-button-danger p-button-sm',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                accept: () => {
                    this.removeTag(tagId);
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Đã hủy xóa!', life: 3000 });
                }
            });
        },
        removeTag(tagId: number) {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/tags/${tagId}`;
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
                if(res.status === 200) {
                    this.$toast.add({ severity: 'info', summary: 'Thao tác', detail: 'Xóa thành công!', life: 3000 });
                    setTimeout(() => {
                        this.fetchTags();
                    }, 1500);
                }
            })
        },
        searchByName() {
            if(this.searchName === '') {
                this.$toast.add({ severity: 'warn', summary: 'Tìm kiếm', detail: 'Vui lòng nhập tên danh mục !', life: 3000 });
                return;
            }
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/tags/search?name=${this.searchName}`;
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
                this.tags = [];
                this.tags = [...(data as any[])];
                console.log("Tags list: ", this.tags);
                return this.tags;
            })
            .catch(error => {
                // router.replace("/");
                this.$toast.add({ severity: 'error', summary: 'Tìm kiếm', detail: 'Không tìm thấy thông tin danh mục!', life: 3000 });
                console.log("Error searching tags!", error);
            });
        }
    }
};

</script>