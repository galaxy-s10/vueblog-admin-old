<template>
  <div>
    <Modal v-model="isShow" :title="title" @on-ok="ok" @on-cancel="cancel">
      <slot></slot>
    </Modal>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "提示",
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    isShow: {
      get() {
        return this.show;
      },
      set() {},
    },
  },
  methods: {
    ok() {
      this.$emit("okk");
    },
    cancel() {
      this.$emit("cancell");
    },
  },
};
</script>

<style scoped>
</style>