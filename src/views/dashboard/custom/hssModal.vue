<template>
  <div>
    <Modal
      v-model="val1"
      title="Common Modal dialog box title"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    val: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      val2: this.val,
    };
  },
  watch: {
    val() {
      this.val2 = this.val;
    },
  },
  computed: {
    // val1() {
    //   console.log('halo')
    //   return this.val;
    // },
    val1: {
      get() {
        return this.val;
      },
      set() {
        console.log(this.val1);
        console.log('set');
      },
    },
  },
  methods: {
    ok() {
      console.log("子组件modal,ok");
      this.$emit("hssModalOk");
    },
    cancel() {
      console.log("子组件modal,cancel");
      this.$emit("hssModalCancel");
    },
  },
};
</script>
