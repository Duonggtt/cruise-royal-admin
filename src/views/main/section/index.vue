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
                            <Button label="Thêm mới" severity="info" icon="pi pi-plus" @click="openNewSectionDialog"/>
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
                    <Column field="text" header="Nội dung" style="width: 50%"></Column>
                    <Column header="Thao tác" style="width: 25%">
                    <template #body="slotProps">
                        <div class="flex gap-2">
                        <ConfirmPopup></ConfirmPopup>
                        <Button icon="pi pi-search" severity="success" aria-label="Search" @click="openSectionDetails(slotProps.data.id)"/>
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

    <Dialog v-model:visible="showSectionDialog" :modal="true" :header="dialogHeader" :style="{ width: '50vw' }">
        <div class="p-fluid">
            <div class="field">
                <label for="text">Nội dung</label>
                <Textarea id="text" v-model="currentSection.text" required autofocus rows="5" />
            </div>
        </div>
        <template #footer>
            <Button label="Hủy" icon="pi pi-times" @click="closeSectionDialog" class="p-button-text"/>
            <Button :label="dialogMode === 'new' ? 'Lưu' : 'Cập nhật'" icon="pi pi-check" @click="saveSection" autofocus />
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from '@/stores/counter';
import { API_URL } from '@/stores/config';
const api_url = API_URL;
interface Section {
    id: string;
    text: string;
    cruiseDto: { id: number, name: string };
    cruiseDtSectionImageId: number;
}

export default defineComponent({
    setup() {
        const confirm = useConfirm();
        const toast = useToast();
        return { confirm, toast };
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
            selectedCruise: null as number | null,
            cruises: [] as any[],
            sections: [] as Section[],
            showSectionDialog: false,
            currentSection: { id: '', text: '', cruiseDto: {id: 0, name: ''} , cruiseDtSectionImageId: 0} as Section,
            dialogMode: 'new',
            dialogHeader: '',
        };
    },
    mounted() {
        this.fetchSections();
        this.fetchCruises();
    },
    methods: {
        fetchCruises() {
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/cruises/auth`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            })
            .then(res => {
                if (res.status === 403) {
                    this.toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res.json();
            })
            .then(data => {
                this.cruises = data;
            })
            .catch(error => {
                console.error("Error fetching cruise list!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách du thuyền', life: 3000 });
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
            fetch(`${API_URL}/sections/`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            })
            .then(res => {
                if (res.status === 403) {
                    this.toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res.json();
            })
            .then(data => {
                this.sections = data;
            })
            .catch(error => {
                console.error("Error fetching sections!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách bài viết', life: 3000 });
            });
        },
        fetchSectionByCruiseId(cruiseId: number) {
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/sections/by-cruise?cruiseId=${cruiseId}`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            })
            .then(res => {
                if(res.status === 404) {
                    this.toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Không có bài viết nào ', life: 3000 });
                    this.sections = [];
                    setTimeout(() => {
                        this.fetchSections();
                    }, 1500);
                }
                if (res.status === 403) {
                    this.toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                this.sections = data;
            })
            .catch(error => {
                console.error("Error fetching sections by cruise!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách bài viết theo du thuyền', life: 3000 });
            });
        },
        confirm2(event: Event, sectionId: string) {
            this.confirm.require({
                target: event.currentTarget as HTMLElement,
                message: 'Bạn có chắc muốn xóa không?',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.removeSection(sectionId);
                },
                reject: () => {
                    this.toast.add({ severity: 'info', summary: 'Đã hủy', detail: 'Bạn đã hủy xóa', life: 3000 });
                }
            });
        },
        removeSection(sectionId: string) {
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/sections/${sectionId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${access_token}` }
            })
            .then(res => {
                if (res.status === 403) {
                    this.toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res;
            })
            .then(res => {
                if(res.status === 200) {
                    this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa bài viết thành công!', life: 3000 });
                    this.fetchSections();
                }
            })
            .catch(error => {
                console.error("Error removing section!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa bài viết', life: 3000 });
            });
        },
        openNewSectionDialog() {
            if (!this.selectedCruise) {
                this.toast.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn du thuyền trước', life: 3000 });
                return;
            }
            this.dialogMode = 'new';
            this.dialogHeader = 'Thêm mới bài viết';
            this.currentSection = { id: '', text: '', cruiseId: this.selectedCruise };
            this.showSectionDialog = true;
        },
        openSectionDetails(sectionId: string) {
            this.dialogMode = 'edit';
            this.dialogHeader = 'Chi tiết bài viết';
            this.fetchSectionDetails(sectionId);
        },
        fetchSectionDetails(sectionId: string) {
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/sections/${sectionId}`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            })
            .then(res => {
                if (res.status === 403) {
                    this.toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res.json();
            })
            .then(data => {
                this.currentSection = data;
                this.showSectionDialog = true;
            })
            .catch(error => {
                console.error("Error fetching section details!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải chi tiết bài viết', life: 3000 });
            });
        },
        closeSectionDialog() {
            this.showSectionDialog = false;
            this.currentSection = { id: '', text: '', cruiseId: 0 };
        },
        saveSection() {
            if (this.dialogMode === 'new') {
                this.createNewSection();
            } else {
                this.updateSection();
            }
        },
        createNewSection() {
            const access_token = localStorage.getItem('access_token');
            const url = `${api_url}/sections/create`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    text: this.currentSection.text,
                    cruiseId: this.selectedCruise,
                    cruiseDtSectionImageId: 5
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
                if(res.status === 200) {
                    this.$toast.add({ severity: 'success', summary: 'Thao tác', detail: 'Thêm mới bài viết thành công', life: 3000 });
                    setTimeout(() => {
                        this.closeSectionDialog();
                        this.fetchSections();
                    }, 1500);
                }
            })
            .catch(error => {
                this.$toast.add({ severity: 'error', summary: 'Thao tác', detail: 'Lỗi khi thêm mới du thuyền!', life: 3000 });
                console.log("Error creating cruise!", error);
            });
        },
        updateSection() {
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/sections/update/${this.currentSection.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    text: this.currentSection.text,
                    cruiseId: this.currentSection.cruiseDto.id,
                    cruiseDtSectionImageId: this.currentSection.cruiseDtSectionImageId
                })
            })
            .then(res => {
                if (res.status === 403) {
                    this.toast.add({ severity: 'error', summary: 'Authorization', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res;
            })
            .then(res => {
                if(res.status === 200) {
                    this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật bài viết thành công', life: 3000 });
                    this.closeSectionDialog();
                    this.fetchSections();
                }
            })
            .catch(error => {
                console.error("Error updating section!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật bài viết', life: 3000 });
            });
        },
    }
});
</script>