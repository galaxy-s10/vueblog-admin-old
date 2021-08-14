<template>
  <div>
    <Modal
      width="250"
      v-model="isShow"
      @on-ok="ok"
      @on-cancel="cancel"
      :mask-closable="false"
      :closable="false"
    >
      <p slot="header">{{ title }}</p>
      <div style="text-align: center">
        <i-circle
          :size="200"
          :trail-width="5"
          :stroke-width="5"
          :percent="percent"
          stroke-linecap="square"
          stroke-color="#43a3fb"
        >
          <div class="demo-Circle-custom">
            <h2>{{ desc }}</h2>
            <h3>{{ content }}</h3>
          </div>
        </i-circle>
      </div>

      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    percent: {
      type: Number,
      default: 0,
    },
    title: "",
    desc: "",
    content: "",
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    ok() {
      this.modal1 = false;
    },
    cancel() {
      this.modal1 = false;
    },
  },
};
</script>

<style  lang="less" scoped>
.demo-Circle-custom {
  & h1 {
    color: #3f414d;
    font-size: 28px;
    font-weight: normal;
  }
}
</style>