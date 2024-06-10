<template>
    <div :id="modalId"
        class="modal-container no-scrollbar fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] justify-center items-center flex">
        <div v-if="hasBackDrop" modal-backdrop="" class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-0"
            @click="closeModal()"></div>

        <div class="relative w-full max-h-full z-10" :class="'max-w-' + size">
            <div class="relative rounded-xl shadow" :class="{ 'bg-white': !isDark, 'bg-gland': isDark }">
                <slot></slot>
            </div>
        </div>


    </div>
</template>

<script>
export default {
    name: "ModalContainerComponent",
    props: {
        modalId: "",
        // 2xl, xl, lg, sm
        size: {
            type: String,
            default: "2xl"
        },
        isDark: {
            type: Boolean,
            default: false
        },
        hasBackDrop: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        closeModal() {
            var modal = document.getElementById(`${this.modalId}`);
            if (!modal.classList.contains('hidden')) {
                modal.classList.add("hidden");
            }
        },
    }
}
</script>

<style scoped>
.modal-container {
    max-height: 95vh;
    overflow-y: auto;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.bg-gland {
    background-color: #030712;
    border: 1px solid #F3F4F6;
}
</style>
