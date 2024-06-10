<template>
    <div class="flex justify-end items-center p-6 space-x-2 border-gray-200 rounded-b dark:border-gray-600">
        <button :data-modal-hide="modalId"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-700 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            Hủy bỏ</button>
        <template v-if="type == 'blue'">
            <button :data-modal-hide="modalId" type="button" @click="onSaveData()"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Lưu</button>
        </template>
        <template v-if="type == 'red'">
            <button :data-modal-hide="modalId" type="button" @click="onSaveData()"
                class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Xóa</button>
        </template>
    </div>
</template>

<script>
export default {
    name: "CloseOrSaveComponent",
    props: {
        modalId: "",
        onSave: {
            type: Function,
            default: () => { }
        },
        type: {
            type: String,
            default: 'blue'
        }
    },
    methods: {
        onSaveData() {
            this.onSave();
        }
    }
}
</script>