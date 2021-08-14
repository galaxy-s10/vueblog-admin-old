<template>
  <div>
    你没有权限进入：{{ msg }} 页面
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      msg: "",
    };
  },
  computed: {},
  methods: {},
  created() {
    console.log(this.$route.params.msg);
    this.msg = this.$route.params.msg;
  },
  mounted() {},
};
</script>

<style scoped>
</style>