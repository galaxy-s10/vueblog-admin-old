<template>
  <div>
    <Tree
      :data="treeData.data"
      :render="renderContent"
      show-checkbox
      @on-check-change="handleChoice"
    >
    </Tree>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 默认树结构
    treeData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    //自定义树结构
    renderContent: {
      type: Function,
      default: (h, { root, node, data }) => {
        return h(
          "span",
          {
            style: {
              display: "inline-block",
              width: "100%",
            },
          },
          [h("span", data.title)]
        );
      },
    },
  },
  data() {
    return {
      data1: "",
    };
  },
  model: {
    prop: "treeData.data",
    event: "change",
  },
  // model: {
  //   prop: "val",
  //   event: "change",
  // },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    handleChoice(v) {
      console.log(v);
      // this.data1 = v;
      this.$emit("change", v);
    },
  },
};
</script>

<style scoped></style>
