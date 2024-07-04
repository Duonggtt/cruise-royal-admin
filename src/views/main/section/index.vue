<template>
    <Toast/>
    <div v-if="isAdmin">
        <div>
            <div class="pb-4">
                <span class="flex font-semibold text-3xl pb-3">Danh sách bài viết</span>
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
                <DataTable showGridlines :value="sections" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                    <Column field="id" header="ID" style="width: 10%"></Column>
                    <Column header="Thao tác" style="width: 25%">
                    <template #body="slotProps">
                        <div class="flex gap-2">
                        <ConfirmPopup></ConfirmPopup>
                        <Button icon="pi pi-search" severity="success" aria-label="Search" />
                        <Button icon="pi pi-times" severity="danger" aria-label="Cancel" @click="confirm2($event, slotProps.data.id)" />
                        </div>
                    </template>
                    </Column>
                </DataTable>
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
            items: ref([
                { label: 'Quản lý du thuyền' }, 
                { label: 'Bài viết' }, 
            ]),
            home: ref({
                icon: 'pi pi-home'
            }),
            selectedCruise: ref(null),
            cruises: [] as any[],
            sections: [{id: '', text: '', }] as any[],
        };
    },
    mounted() {
        this.fetchSections();
        this.fetchCruises();
    },
    methods: {
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
        resetData() {
            this.selectedCruise = null;
            this.fetchSections();
        },
        onCruiseChange() {
            if (this.selectedCruise) {
                this.fetchSectionByCruiseId(this.selectedCruise);
            } else {
                this.fetchSections();
            }
        },
        fetchSections() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/sections/`;
            fetch(url, {
                method: 'GET',
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
                return res.json();
            })
            .then(data => {
                this.sections = data;
            })
        },
        fetchSectionByCruiseId(cruiseId: any) {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/sections/by-cruise?cruiseId=${cruiseId}`;
            fetch(url, {
                method: 'GET',
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
                return res.json();
            })
            .then(data => {
                this.sections = data;
            })
        },
        confirm2(event: any, sectionId: number) {
            this.confirm.require({
                target: event.currentTarget,
                message: 'Bạn có chắc muốn xóa không?',
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
                acceptClass: 'p-button-danger p-button-sm',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                accept: () => {
                    this.removeSection(sectionId);
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Đã hủy xóa!', life: 3000 });
                }
            });
        },
        removeSection(sectionId: any) {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}`;
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
                    this.$toast.add({ severity: 'info', summary: 'Thao tác', detail: 'Xóa bài viết thành công!', life: 3000 });
                    setTimeout(() => {
                        this.fetchSections();
                    }, 1500);
                }
            })
        },
    }
};

</script>