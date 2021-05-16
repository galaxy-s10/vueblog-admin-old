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
        <i-button type="text" @click="cancel">取消</i-button>
        <i-button type="primary" @click="ok">确定</i-button>
      </template>
      <base-form
        ref="baseFrom"
        :fromData="fromData"
        :initData="initData"
        :init="isInit"
      ></base-form>
    </Modal>
  </div>
</template>

<script>
import baseForm from "../base-form/index";
export default {
  components: { baseForm },
  props: {
    request: {
      type: Object,
    },
    fromData: {
      type: Object,
      default: () => {},
    },
    initData: {
      type: Object,
      default: () => {},
    },
    isInit: {
      type: Boolean,
      default: () => {},
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
      // 初始化弹窗
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
      console.log("hss-ok");
      
      this.$refs.baseFrom.submit((v) => {
        if (v) {
          // console.log(v);
          this.$emit("onSubmit", v);
          this.popup.is_show = false;
        } else {
          // console.log("表单验证失败");
        }
      });
      // this.$emit("on-ok",this.baseFrom);
    },
    cancel() {
      // console.log("hss-cancel");
      this.popup.is_show = false;
      this.$emit("on-cancel");
    },
    onVisibleChange() {
      // this.popup.is_show = false;
      // console.log("hss-onVisibleChange");
      this.$emit("on-cancel");
    },
  },
  watch: {
    data() {
      console.log("data-watch");
      this.init();
    },
  },
};
</script>

<style scoped></style>
