<template>
    <Toast/>
    <div>
        <div class="pb-4">
            <span class="flex font-semibold text-3xl pb-3">Danh sách luật lệ</span>
            <Breadcrumb :home="home" :model="items" />
        </div>
        
        <div class="card">
            <div class="flex justify-content-between w-full">
                <div class="flex gap-2">
                    <Button label="Thêm mới" severity="info" icon="pi pi-plus" @click="openNewRuleDialog"/>
                    <Button label="Refresh" severity="info" icon="pi pi-refresh" @click="resetData()"/>
                </div>
            </div>
            <hr>
            <DataTable showGridlines :value="rules" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
                <Column field="id" header="ID" style="width: 10%"></Column>
                <Column field="content" header="Nội dung" style="width: 65%"></Column>
                <Column header="Thao tác" style="width: 25%">
                <template #body="slotProps">
                    <div class="flex gap-2">
                    <ConfirmPopup></ConfirmPopup>
                    <Button icon="pi pi-search" severity="success" aria-label="Search" @click="openRuleDetails(slotProps.data.id)"/>
                    <Button icon="pi pi-times" severity="danger" aria-label="Cancel" @click="confirm2($event, slotProps.data.id)" />
                    </div>
                </template>
                </Column>
            </DataTable>
        </div>
    </div>

    <Dialog v-model:visible="showRuleDialog" :modal="true" :header="dialogHeader" :style="{ width: '50vw' }">
        <div class="p-fluid">
            <div class="field">
                <label for="content">Nội dung</label>
                <Textarea id="content" v-model="currentRule.content" required autofocus rows="5" />
            </div>
        </div>
        <template #footer>
            <Button label="Hủy" icon="pi pi-times" @click="closeRuleDialog" class="p-button-text"/>
            <Button :label="dialogMode === 'new' ? 'Lưu' : 'Cập nhật'" icon="pi pi-check" @click="saveRule" autofocus />
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from '@/stores/counter';
import { API_URL } from '@/stores/config';

interface Rule {
    id: number;
    content: string;
}

export default defineComponent({
    setup() {
        const confirm = useConfirm();
        const toast = useToast();
        return { confirm, toast };
    },
    data() {
        return {
            rules: [] as Rule[],
            items: ref([
                { label: 'Quản lý du thuyền' }, 
                { label: 'Luật lệ' }, 
            ]),
            home: ref({
                icon: 'pi pi-home'
            }),
            searchContent: '',
            showRuleDialog: false,
            currentRule: { id: 0, content: '' } as Rule,
            dialogMode: 'new',
            dialogHeader: '',
        };
    },
    mounted() {
        this.fetchRules();
    },
    methods: {
        openNewRuleDialog() {
            this.dialogMode = 'new';
            this.dialogHeader = 'Thêm mới luật lệ';
            this.currentRule = { id: 0, content: '' };
            this.showRuleDialog = true;
        },
        openRuleDetails(ruleId: number) {
            this.dialogMode = 'edit';
            this.dialogHeader = 'Chi tiết luật lệ';
            this.fetchDetailRule(ruleId);
        },
        closeRuleDialog() {
            this.showRuleDialog = false;
            this.currentRule = { id: 0, content: '' };
        },
        saveRule() {
            if (this.dialogMode === 'new') {
                this.createNewRule();
            } else {
                this.updateRule();
            }
        },
        fetchRules() {
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/rules/auth`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            })
            .then(res => res.json())
            .then(data => {
                this.rules = data;
            })
            .catch(error => {
                console.error("Error fetching rules!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách luật lệ', life: 3000 });
            });
        },
        fetchDetailRule(ruleId: number) {
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/rules/${ruleId}`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            })
            .then(res => res.json())
            .then(data => {
                this.currentRule = data;
                this.showRuleDialog = true;
            })
            .catch(error => {
                console.error("Error fetching rule detail!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải chi tiết luật lệ', life: 3000 });
            });
        },
        createNewRule() {
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/rules/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({ content: this.currentRule.content })
            })
            .then(res => {
                if (res.status === 403) {
                    this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res;
            })
            .then(res => {
                if(res.status === 201) {
                    this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm mới luật lệ thành công', life: 3000 });
                    this.closeRuleDialog();
                    this.fetchRules();
                }
            })
            .catch(error => {
                console.error("Error creating rule!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tạo luật lệ mới', life: 3000 });
            });
        },
        updateRule() {
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/rules/${this.currentRule.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({ content: this.currentRule.content })
            })
            .then(res => {
                if (res.status === 403) {
                    this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res;
            })
            .then(res => {
                console.log(res);
                if(res.status === 201) {
                    this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật luật lệ thành công', life: 3000 });
                    this.closeRuleDialog();
                    this.fetchRules();
                }
            })
            .catch(error => {
                console.error("Error updating rule!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật luật lệ', life: 3000 });
            });
        },
        confirm2(event: Event, ruleId: number) {
            this.confirm.require({
                target: event.currentTarget as HTMLElement,
                message: 'Bạn có chắc muốn xóa không?',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.removeRule(ruleId);
                },
                reject: () => {
                    this.toast.add({ severity: 'info', summary: 'Đã hủy', detail: 'Bạn đã hủy xóa', life: 3000 });
                }
            });
        },
        removeRule(ruleId: number) {
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/rules/${ruleId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${access_token}` }
            })
            .then(res => {
                if (res.status === 403) {
                    this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res;
            })
            .then(res => {
                if(res.status === 200) {
                    this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa luật lệ thành công', life: 3000 });
                    this.fetchRules();
                }
            })
            .catch(error => {
                console.error("Error removing rule!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa luật lệ', life: 3000 });
            });
        },
        searchByContent() {
            if(this.searchContent === '') {
                this.toast.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập nội dung tìm kiếm!', life: 3000 });
                return;
            }
            const access_token = localStorage.getItem('access_token');
            fetch(`${API_URL}/rules/search?content=${this.searchContent}`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            })
            .then(res => {
                if (res.status === 403) {
                    this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Phiên đăng nhập hết hạn!', life: 3000 });
                    useAuthStore().logout();
                }
                return res.json();
            })
            .then(data => {
                this.rules = data;
            })
            .catch(error => {
                console.error("Error searching rules!", error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tìm kiếm luật lệ', life: 3000 });
            });
        },
        resetData() {
            this.fetchRules();
            this.searchContent = '';
        }
    }
});
</script>