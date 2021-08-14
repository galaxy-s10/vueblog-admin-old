<template>
  <div>
    <Table border :columns="columns1" :data="data1"></Table>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    columns1: {
      type: Array,
      default: function () {
        return [];
      },
    },
    data1: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  created() {
    console.log(this.columns1);
    console.log(this.data1);
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>

<style scoped>
</style>