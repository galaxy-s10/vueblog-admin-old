<template>
  <div>
    <div class="wrap">
      <div class="login">
        <Card :bordered="false">
          <p slot="title">欢迎登录</p>
          <i-form ref="formInline" :model="form" :inline="false">
            <FormItem prop="user">
              <i-input
                type="text"
                v-model="form.username"
                placeholder="Username"
              >
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </i-input>
            </FormItem>
            <FormItem prop="password">
              <i-input
                type="password"
                v-model="form.password"
                placeholder="Password"
              >
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </i-input>
            </FormItem>
            <FormItem>
              <Checkbox v-model="getRemember" @on-change="edit"
                >七天内免登陆</Checkbox
              >
              <Button type="primary" long @click="handleSubmit">登录</Button>
              <!-- <Button type="primary" long @click="aaa">aaa</Button> -->
            </FormItem>
          </i-form>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from "@/api/auth";
import cache from "../../libs/cache";
import { mapState, mapMutations, mapActions } from "vuex";
const fs = require("fs");
console.log(fs, 222);
export default {
  components: {},
  data() {
    return {
      form: {
        username: "hss",
        password: "123456a",
      },
      redirect: "",
    };
  },
  created() {},
  mounted() {
    console.log(this.$route);
  },
  computed: {
    ...mapState("user", ["remember"]),
    getRemember: {
      get: function() {
        return this.remember;
      },
      set: function(newValue) {
        // console.log(newValue);
        this.editRemember(newValue);
      },
    },
  },
  watch: {
    $route: {
      handler: function(route) {
        // console.log(route);
        this.redirect = route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    // aaa() {
    //   let res = cache.getStorageExt("token");
    //   // console.log(res);
    // },
    ...mapMutations("user", ["editRemember", "setToken"]),
    ...mapActions("user", [
      "login",
      "getUserInfo",
      "getAuth",
      "generateRoutes",
    ]),
    edit(e) {
      // console.log("remember计算属性的set方法已经修改了数据");
    },
    async handleSubmit() {
      try {
        let { token, message } = await this.login({
          ...this.form,
          exp: this.remember ? 7 * 24 : 1 * 24,
        });
        // 默认24小时后过期
        let exp = (this.remember ? 7 * 24 : 1 * 24) * 60 * 60 * 1000;
        this.setToken({ token, exp });
        await this.getUserInfo();
        await this.getAuth();
        await this.generateRoutes();
        this.$router.push({ path: this.redirect || "/" });
        this.$Message.success({
          content: message,
        });
      } catch (err) {
        console.log(err);
        console.log(err.response);
      }
    },
  },
};
</script>

<style src="./test.css"></style>

<style scoped>
.wrap {
  display: flex;
  /* width: 100%; */
  height: 100vh;
  background: #f5f7f9;
}
/* :fullscreen {
  color: red;
} */
.login {
  width: 320px;
  margin: auto;
}
</style>
