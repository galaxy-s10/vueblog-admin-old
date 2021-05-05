<template>
  <div>
    <h1>我是app组件，router-view就在我这</h1>
    <div class="index-content">
      {{ ajaxmsg }}
      <div class="index-bg"></div>
      <i class="iconfont icon-ashbin"></i>
      <span class="inline-font">inline-font</span>
      <span class="indexcss-font">indexcss-font</span>
      <span class="maincss-font">maincss-font</span>
      <span class="mainless-font">mainless-font</span>
    </div>

    <router-link to="/foo" tag="button">foo</router-link>
    <router-link to="/bar" tag="button">bar</router-link>
    <router-link to="/baz" tag="button">baz</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return { ajaxmsg: "" };
  },
  created() {
    let that = this;
    fetch("/api/type/pageList?nowPage=1&pageSize=5")
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        that.ajaxmsg = myJson.message;
      });
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>

// 注意：@import并不是引入代码到style里面，而是发起新的请求获得样式资源，并且没有加scoped
<style scoped>
/* @import "./css/index.css"; */
/* @import "./css/main.css"; */
.inline-font {
  color: green;
  font-size: 30px;
}
</style>

<style src="./css/index.css" scoped></style>
<style src="./css/main.css" scoped></style>


// 奇怪的是，less就可以使用@import引入，且scoped会生效
<style lang="less" scoped>
@import "./css/main.less";
</style>