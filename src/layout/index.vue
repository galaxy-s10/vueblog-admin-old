<template>
  <div>
    <Layout :style="{ height: '100vh' }" class="slider-menu">
      <Sider width="200" :collapsed-width="70" collapsible v-model="isCollapsed" hide-trigger>
        <hss-sidebar @collapsedSider="collapsedSider"></hss-sidebar>
      </Sider>
      <Layout ref="scrollWrap">
        <Header style=" padding: 0;background: #fff;boxShadow: 0 2px 3px 2px rgba(0,0,0,.1);">
          <hss-header @collapsedSider="collapsedSider"></hss-header>
        </Header>
        <Content>
          <tag-open-page ref="tagOpen"></tag-open-page>
          <div class="main-content">
            <hss-content></hss-content>
          </div>
        </Content>
        <Footer style="background: #e74c3c;padding: 0;bottom: 0;textAlign: center">
          <hss-footer></hss-footer>
        </Footer>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import tagOpenPage from "../components/tagOpenPage";
import hssSidebar from "./sidebar/index";
import hssHeader from "./header/index";
import hssFooter from "./footer/index";
import hssContent from "./content/index";
import { mapState, mapMutations } from "vuex";
import utils from "../libs/utils";
import { roleRoutes } from "@/router/router";
import cache from "@/libs/cache";
export default {
  components: {
    tagOpenPage,
    hssSidebar,
    hssHeader,
    hssFooter,
    hssContent
  },
  data() {
    return {
      isCollapsed: false,
      menuList: [],
      // menuList: [
      //   "ARTICLE_LIST",
      //   "ADD_ARTICLE",
      //   "UPDATE_ARTICLE",
      //   "SELECT_ARTICLE",
      //   "DELETE_ARTICLE",
      // ],
      breadList: []
    };
  },
  computed: {
    ...mapState("user", ["username", "avatar"]),
    // ...mapState("app", {
    //   title: (state) => state.title,
    // }),
    ...mapState({
      title(state) {
        // console.log("titletitle");
        // console.log(state);
        return state.app.title;
      },
      auth(state) {
        // console.log("state.auth.auth");
        // console.log(state);
        // console.log(this.menuList);
        // console.log(state.auth.auth == this.menuList);
        // return state.auth;
      },
      tagList(state) {
        return state.app.tagOpenPageList;
      }
    }),
    activeName() {
      console.log(this.$route.name);
      return this.$route.name;
    },
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    }
  },
  methods: {
    ...mapMutations(["addTagOpenPage", "changeActiveTagOpenPage"]),
    collapsedSider() {
      this.isCollapsed = !this.isCollapsed;
    }
  },
  watch: {},
  created() {},
  mounted() {
    let that = this;
    this.$refs.scrollWrap.$el.addEventListener("scroll", function() {
      if (
        that.$refs.scrollWrap.$el.scrollHeight -
          (that.$refs.scrollWrap.$el.scrollTop +
            that.$refs.scrollWrap.$el.offsetHeight) <
        100
      ) {
      }
    });
  }
};
</script>

<style scoped>
.slider-menu
  /deep/
  .ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-opened
  .ivu-menu-submenu-has-parent-submenu
  .ivu-menu-submenu-title {
  background: #515a6e;
}

.main-content {
  background: white;
  padding: 20px;
}
</style>
