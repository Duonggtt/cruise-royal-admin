<template>
  <div>
    <!-- edit button, click to show modal -->
    <template v-if="type == 'icon' && !isModalIdNullOrEmpty">
      <button class="w-fit bg-white border rounded p-2" @click="toggleModal()">
        <i :class="iconClass"></i>
        <span :style="titleStyle">{{ title }}</span>
      </button>
    </template>
    <!-- custome nút show modal -->
    <template v-else-if="type == 'custom' && !isModalIdNullOrEmpty">
      <button :class="customClass" @click="toggleModal()">
        <span :style="titleStyle">{{ title }}</span>
      </button>
    </template>
    <!-- custome nút show modal và icon -->
    <template v-else-if="type == 'custom-with-icon' && !isModalIdNullOrEmpty">
      <button :class="customClass" @click="toggleModal(idParam)">
        <i :class="iconClass"></i>
        <span :style="titleStyle">{{ title }}</span>
      </button>
    </template>
    <!-- Để nhúng title dưới dạng html-->
    <template v-else-if="type == 'html' && !isModalIdNullOrEmpty">
      <button :class="customClass" @click="toggleModal()">
        <div v-html="title"></div>
      </button>
    </template>
    <!-- Dạng nít mặc định-->
    <template v-else-if="!isModalIdNullOrEmpty">
      <div class="w-full flex justify-end mb-3.5">
        <button type="button" @click="toggleModal()"
          class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center mr-2">
          {{ title }}
        </button>
      </div>
    </template>
    <!-- Nếu modal Id null sẽ báo lỗi-->
    <template v-else>
      <p class="text-red-500">
        <i class="fa-solid fa-bomb"></i>
        ShowModal
      </p>
    </template>

    <!-- Edit modal -->
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: "ShowModal",
  data() {
    return {
      isModalIdNullOrEmpty: false,
      isShowing: false,
    }
  },
  mounted() {
    this.isModalIdNullOrEmpty = (this.modalId == "" || this.modalId == null)
  },
  props: {
    modalId: "",
    type: {
      type: String,
      default: "icon"
    },
    iconClass: {
      type: String,
      default: ""
    },
    customClass: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    titleStyle: {
      type: String,
      default: ""
    },
    setData: {
      type: Function,
      default: () => { }
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    idParam: {
      type: [String, Number],
      default: ""
    },
    indexParam: {
      type: [String, Number],
      default: ""
    }
  },
  methods: {
    toggleModal() {
      var modal = document.getElementById(`${this.modalId}`);
      const data = {
        isShowing: this.isShowing,
        modalId: this.modalId,
        idParam: this.idParam,
        indexParam: this.indexParam,
      };
      if (modal.classList.contains('hidden')) {
        modal.classList.remove("hidden");
        this.isShowing = true;
        this.$emit("modal-toggle", data);
      } else {
        modal.classList.add("hidden");
        this.isShowing = false;
        this.$emit("modal-toggle", data);
      }
    }
  }
}
</script>
