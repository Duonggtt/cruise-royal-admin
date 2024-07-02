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
                        <Button label="Thêm mới" severity="info" icon="pi pi-plus"/>
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
                    <Button icon="pi pi-search" severity="success" aria-label="Search"/>
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
        };
    },
    mounted() {
        this.fetchTags();
    },
    methods: {
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
            this.state = 'default';
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
            console.log(tagId);
        },
        searchByName() {
            console.log("Search by name: ", this.searchName);
        }
    }
};

</script>