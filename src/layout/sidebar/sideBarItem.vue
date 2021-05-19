<template>
  <div>
    <Menu
      accordion
      mode="vertical"
      width="100"
      theme="dark"
      @on-select="changeMenu"
      :active-name="activeName"
    >
      <template v-for="(item, index) in menuList">
        <!-- <template v-if="!item.hidden && item.children && item.children.length > 1"> -->
        <template v-if="!item.hidden">
          <MenuItem v-if="item.children && item.children.length == 1" :name="item.children[0].path">
            <!-- <MenuItem v-if="!item.children && item.children.length == 1" :name="item.name"> -->
            <Icon v-if="item.children[0].meta.icon" :type="item.children[0].meta.icon" />
            <span v-if="!isCollapsed">{{ item.children[0].meta.title }}55</span>
          </MenuItem>
          <Submenu v-if="item.children && item.children.length > 1" :name="item.path" :key="index">
            <template slot="title">
              <Icon v-if="item.meta.icon" :type="item.meta.icon" />
              <span v-if="!isCollapsed">{{ item.meta.title }}33</span>
              <router-link :to="item.path">{{item.path}}</router-link>
            </template>
            <side-bar-item v-if="item.children" :menuList="item.children"></side-bar-item>
          </Submenu>

          <MenuItem v-if="!item.children" :name="item.path">
            2323
            <Icon v-if="item.meta.icon" :type="item.meta.icon" />
            <!-- <div v-if="!isCollapsed"> -->
            <!-- <router-link :to="item.path">685</router-link> -->
            <hss-link />
            <!-- <a :to="item.path">{{item.path}}</a> -->
            <!-- </div> -->
          </MenuItem>
          <hss-link />
        </template>
      </template>
    </Menu>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import hssLink from "./link";

export default {
  name: "sideBarItem",
  // functional: true,
  components: {
    hssLink
  },
  props: {
    menuList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    ...mapState("user", ["username", "avatar"]),
    ...mapState({
      tagList(state) {
        return state.app.tagOpenPageList;
      }
    }),
    activeName() {
      return this.$route.path;
    },
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    }
  },
  data() {
    return {
      isCollapsed: false,
      breadList: []
    };
  },
  methods: {
    logout() {
      cache.clearStorage("token");
      this.$router.push({ path: `/login?redirect=${this.$route.path}` });
    },
    ...mapMutations(["addTagOpenPage", "changeActiveTagOpenPage"]),
    // ...mapMutations("app", ["addTagOpenPage"]),
    collapsedSider() {
      this.isCollapsed = !this.isCollapsed;
    },
    findItem(source, target) {
      var res = false;
      function digui(source, target) {
        let ress = "";
        try {
          source.forEach(item => {
            if (item.name == target) {
              ress = item;
              throw new Error();
            } else {
              if (item.children) {
                digui(item.children, target);
              }
            }
          });
        } catch (e) {
          res = ress;
        }
      }
      digui(source, target);
      return res;
    },
    changeMenu(path) {
      // 判断当前跳转页面有没有在tagOpenPageList里面
      // 查询点击跳转的路由信息
      console.log(path);
      this.$router.push({ path: path });
    },
    change(e, role) {
      if (e) {
        if (!this.roles.includes(role)) {
          this.roles.push(role);
        }
      } else {
        const index = this.roles.findIndex(item => item === role);
        this.roles.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
