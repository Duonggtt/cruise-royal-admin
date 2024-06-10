<template>
    <div class="flex items-start items-center justify-between pt-6 px-6 rounded-xl"
        :class="{ 'bg-gray-900': isDark, 'bg-white': !isDark }">
        <div class="text-base font-semibold text-white" v-if="isDark">
            {{ head }}
        </div>
        <div class="text-base font-semibold text-gray-700" v-else>
            {{ head }}
        </div>
        <XButton :modalId="modalId" @close-modal="closeModal"></XButton>
    </div>
</template>

<script>
export default {
    name: "ModalHeaderComponent",
    props: {
        head: "",
        modalId: "",
        isDark: false,
    },
    methods: {
        closeModal() {
            this.$emit('modal-header-close');
            var modal = document.getElementById(`${this.modalId}`);
            if (!modal.classList.contains('hidden')) {
                modal.classList.add("hidden");
            }
        },
    }
}
</script>

<style scoped></style>
