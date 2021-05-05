<template>
  <div>
    <header>我是header</header>
    <nav>我是nav</nav>
    <div class="content">
      <article>
        我是article
        <router-view></router-view>
      </article>
      <aside>我是aside</aside>
    </div>
    <footer>我是footer</footer>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
};
</script>

<style lang="less" scoped>
header {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: rebeccapurple;
  border-radius: 10px;
  margin-block: 10px;
}
nav {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: purple;
  border-radius: 10px;
  margin-block: 10px;
}
.content {
  display: flex;
  height: 500px;
  justify-content: space-between;
  margin-bottom: 10px;
  article {
    width: 66%;
    background: yellow;
    border-radius: 10px;
  }
  aside {
    width: 33%;
    background: gray;
    border-radius: 10px;
  }
}
footer {
  width: 100%;
  height: 20px;
  text-align: center;
  background: chartreuse;
}
</style>