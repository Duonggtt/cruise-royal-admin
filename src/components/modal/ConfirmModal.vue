<template>
    <ModalContainer :modalId="modalId">
        <ModalHeader :head="title" :modalId="modalId"></ModalHeader>
        <!-- Modal body -->
        <div>
            <div class="relative z-0 w-full flex pl-5 font-semibold">
                <span :class="messageClass"><i class="fa-solid fa-circle-exclamation mr-2"></i>{{ message }}</span>
            </div>
        </div>
        <!-- Modal footer -->
        <CloseOrSave :modalId="modalId" :onSave="onSave" :type="type"></CloseOrSave>
    </ModalContainer>
</template>

<script>


export default {
    name: "ConfirmModalComponent",
    props: {
        modalId: "",
        title: "",
        type: "",
        messageClass: {
            type: String,
            default: ""
        },
        message: {
            type: String,
            default: ""
        },
        onSave: {
            type: Function,
            default: () => { }
        }
    },
}
</script>