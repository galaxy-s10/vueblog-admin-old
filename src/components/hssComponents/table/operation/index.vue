<template>
  <div>
    <template v-for="(item, i) in operationList">
      <!-- <template>
        <a @click="onClick(item)" :style="item.style">{{ item.name[0] }}</a>
      </template> -->
      <template v-if="item.type == 'CUSTOM'">
        <a @click="onClick(item)" :style="item.style">{{ item.name }}</a>
      </template>
      <template v-if="item.type == 'TIP'">
        <Poptip
          transfer
          confirm
          title="您确认删除这条内容吗？"
          @on-ok="() => ok(item)"
          @on-cancel="() => cancel(item)"
        >
          <a :style="item.style">{{ item.name }}</a>
        </Poptip>
      </template>
      <Divider type="vertical" v-if="operationList.length != i + 1" />
    </template>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    operation: {
      type: Array,
      default: () => [],
    },
    row: {
      type: Object,
      default: () => {},
      // required: true,
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    operationList() {
      let list = [];
      this.operation.forEach((item) => {
        // 自定义样式
        if (item.customStyle) {
          item.style = item.customStyle(this.row);
        }
        // 执行isShow()不为false就显示（isShow变量未定义或执行isShow返回true都显示，只有执行isShow()返回false不显示）
        if (!item.isShow || item.isShow(this.row)) {
          list.push(item);
        }
      });
      return list;
    },
  },
  methods: {
    ok(v) {
      this.onClick(v);
    },
    cancel(v) {
      this.$Message.info({
        content: `你取消了${v.name}操作`,
      });
    },
    onClick(item) {
      let that = this;
      switch (item.type) {
        case "CUSTOM":
          item.custom(this.row);
          break;
        case "TIP":
          item.custom(this.row);
          break;
        case "ROUTER":
          item.custom(this.row);
          break;
      }
    },
  },

  watch: {},
};
</script>

<style scoped></style>
