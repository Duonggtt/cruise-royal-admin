<template>
    <button type="button"
        class="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 ml-auto inline-flex justify-center items-center"
        @click="toggleModal()">
        <span class="text-lg"><i class="fa-solid fa-xmark"></i></span>
        <span class="sr-only">Close modal</span>
    </button>
</template>

<script>
export default {
    name: "XButtonComp",
    props: {
        modalId: "",
    },
    methods: {
      toggleModal() {
        this.$emit('close-modal')
      }
    }
}
</script>
