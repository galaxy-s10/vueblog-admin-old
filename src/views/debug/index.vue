<template>
  <div>
    debug
  </div>
</template>

<script>
import { getAuth } from "@/api/auth";
import cache from "../../libs/cache";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      form: {
        username: "hss",
        password: "19990507a",
      },
      redirect: "",
    };
  },
  created() {
    // console.log(this.remember);
  },
  mounted() {},
  computed: {
    ...mapState("user", ["remember"]),
    getRemember: {
      get: function () {
        return this.remember;
      },
      set: function (newValue) {
        // console.log(newValue);
        this.editRemember(newValue);
      },
    },
  },
  watch: {
    $route: {
      handler: function (route) {
        // console.log(route);
        this.redirect = route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    aaa() {
      let res = cache.getStorageExt("token");
      // console.log(res);
    },
    ...mapMutations("user", ["editRemember"]),
    ...mapActions("user", ["login", "getUserInfo", "getAuth"]),
    edit(e) {
      // console.log("remember计算属性的set方法已经修改了数据");
    },
    async handleSubmit() {
      // console.log(this.form)
      try {
        let res = await this.login(this.form);
        if (this.remember) {
          // let exp = 5000;
          let exp = 1 * 24 * 60 * 60 * 1000;
          cache.setStorageExt("token", res.token, exp);
        }
        await this.getUserInfo();
        await this.getAuth();
        this.$router.push({ path: this.redirect || "/" });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.wrap {
  display: flex;
  /* width: 100%; */
  height: 100vh;
  background: #f5f7f9;
}
.login {
  width: 320px;
  margin: auto;
}
</style>