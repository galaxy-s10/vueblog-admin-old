<template>
  <div>
    是否开放留言板
    <i-switch v-model="frontend_comment" @on-change="change" />
  </div>
</template>

<script>
import { getFrontend, updateFrontend } from "@/api/frontend";
export default {
  components: {},
  data() {
    return {
      frontend_comment: true,
    };
  },
  computed: {},
  methods: {
    getFrontend() {
      getFrontend().then((res) => {
        console.log(res);
        this.frontend_comment = res.detail.frontend_comment ? true : false;
      });
    },

    change(status) {
      updateFrontend({ id: 1, frontend_comment: status ? 1 : 0 }).then((res) => {
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
