<template>
  <div>
    是否开放登录
    <i-switch v-model="frontend_login" @on-change="change" />
  </div>
</template>

<script>
import { getFrontend, updateFrontend } from "@/api/frontend";
export default {
  components: {},
  data() {
    return {
      frontend_login: true,
    };
  },
  computed: {},
  methods: {
    getFrontend() {
      getFrontend().then((res) => {
        console.log(res);
        this.frontend_login = res.detail.frontend_login ? true : false;
      });
    },

    change(status) {
      updateFrontend({ id: 1, frontend_login: status ? 1 : 0 }).then((res) => {
        console.log(res);
        this.$Message.success(res.message);
        this.getFrontend();
      });
    },
  },
  created() {},
  mounted() {
    this.getFrontend();
  },
};
</script>

<style scoped></style>
