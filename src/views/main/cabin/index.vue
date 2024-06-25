<template>
    <Toast/>
    <div v-if="state === 'default'">
        <div class="pb-4">
            <span class="flex font-semibold text-3xl pb-3">Danh sách phòng ngủ</span>
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
                    <InputIcon class="pi pi-search cursor-pointer" ></InputIcon>
                    <InputText placeholder="Tìm kiếm..."  />
                </IconField>
            </div>
            <hr>
            <DataTable showGridlines :value="cabins" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                <Column field="id" header="ID" style="width: 10%"></Column>
                <Column field="name" header="Tên phòng" style="width: 20%"></Column>
                <Column field="roomSize" header="Kích cỡ" style="width: 15%"></Column>
                <Column field="roomQuantity" header="Số lượng phòng" style="width: 15%"></Column>
                <Column field="maxGuests" header="Số người ở" style="width: 15%"></Column>
                <Column field="price" header="Giá phòng" style="width: 15%"></Column>
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
            items: ref([
                { label: 'Quản lý du thuyền' }, 
                { label: 'Phòng ngủ' }, 
            ]),
            home: ref({
                icon: 'pi pi-home'
            }),
            cabins: [

            ],
        };
    },
    mounted() {
        this.fetchCabins();
    },
    methods: {
        fetchCabins() {

        },
        resetData() {
            this.fetchCabins();
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
        fetchCabinDetail(cabinId: number) {
            this.$router.push({ name: 'cabin-detail', params: { id: cabinId } });
        },
    }
};

</script>