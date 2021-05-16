<template>
  <div>
    <Modal
      v-model="popup.is_show"
      :title="popup.title"
      :width="popup.width"
      :mask-closable="false"
      @on-visible-change="onVisibleChange"
    >
      <template slot="footer">
        <i-button type="text" @click.native="cancel">取消</i-button>
        <i-button type="primary" @click.native="ok">确定</i-button> </template
      >66666
      <hss-form></hss-form>
    </Modal>
  </div>
</template>

<script>
import hssForm from "../form/index";
export default {
  components: { hssForm },
  props: {
    request: {
      type: Object,
    },
  },
  data() {
    return {
      popup: {},
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  computed: {},
  methods: {
    init() {
      /*初始化弹窗*/
      this.popup = {
        is_show: true,
        title: this.request.title ? this.request.title : "",
        width:
          this.request.size == "small"
            ? 300
            : this.request.size == "centre"
            ? 520
            : 900,
      };
    },
    ok() {
      console.log("ok");
      this.popup.is_show = false;
      this.$emit("on-ok");
    },
    cancel() {
      console.log("cancel");
      this.popup.is_show = false;
      this.$emit("on-cancel");
    },
    onVisibleChange() {
      console.log("onVisibleChange");
    },
  },
  watch: {
    data() {
      this.init();
    },
  },
};
</script>

<style scoped>
</style>