<template>
  <div>
    <div style="height: 100vh; overflow-y: scroll">
      <div class="logo">{{ title }}</div>
      <side-bar-item :menuList="menuList"></side-bar-item>
      <Row
        type="flex"
        justify="center"
        align="middle"
        class="code-row-bg"
        style="z-index: 999;color: white;"
      >
        <p style="height: 75px"></p>
        <Icon
          @click.native="collapsedSider"
          :class="rotateIcon"
          :style="{
                margin: '0 20px',
                transform: !isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              }"
          type="ios-arrow-back"
          size="20"
        ></Icon>
      </Row>
    </div>
  </div>
</template>

<script>
import sideBarItem from "./sideBarItem";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    sideBarItem
  },
  data() {
    return {
      isCollapsed: false,
      menuList: []
    };
  },
  computed: {
    ...mapState({
      title(state) {
        return state.app.title;
      }
    }),
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    }
  },
  methods: {
    // ...mapMutations(["addTagOpenPage", "changeActiveTagOpenPage"]),
    collapsedSider() {
      this.$emit('collapsedSider')
      // this.isCollapsed = !this.isCollapsed;
    }
  },
  created() {},
  mounted() {
    // this.$store.dispatch("user/generateRoutes");
    console.log(this.$store.state.user.addRoutes);
    // this.menuList = this.$router.options.routes;
    // this.$router.addRoutes(this.$store.state.user.addRoutes);
    this.menuList = this.$router.options.routes.concat(
      this.$store.state.user.addRoutes
    );
    console.log(this.$router);
    console.log(this.menuList);
  }
};
</script>

<style scoped>
.logo {
  color: white;
  width: 100%;
  height: 64px;
  line-height: 64px;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
}
</style>