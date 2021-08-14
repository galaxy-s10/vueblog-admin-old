<template>
  <div>
    <router-view></router-view>
    <!-- <i-button @click="changePath('login')">login</i-button> -->
  </div>
</template>

<script>
import utils from "./libs/utils";
import { mapState, mapMutations } from "vuex";
export default {
  name: "App",
  components: {},
  data() {
    return {
      menuList: [],
      roles: ["add", "del"],
      path: "",
    };
  },
  computed: {
    ...mapState({
      tagList(state) {
        return state.app.tagOpenPageList;
      },
      addRoutes(state) {
        return state.user.addRoutes;
      },
    }),
    checkRole() {
      return (v) => {
        return this.roles.includes(v);
      };
    },
  },
  watch: {
    $route(newVal, oldVal) {
      this.changeMenu(newVal.name);
    },
  },
  methods: {
    ...mapMutations([
      "addTagOpenPage",
      "editTagOpenPage",
      "changeActiveTagOpenPage",
    ]),
    findItem(source, target) {
      var res = false;
      function digui(source, target) {
        let ress = "";
        try {
          source.forEach((item) => {
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
    changeMenu(name) {
      console.log(name);
      // 判断当前跳转页面有没有在tagOpenPageList里面
      // 查询点击跳转的路由信息
      console.log(this.menuList);
      // console.log(this.addRoutes);
      // console.log(this.menuList.concat(this.addRoutes));
      let target = this.findItem(this.menuList.concat(this.addRoutes), name);
      console.log(target);
      let tag;
      let bool = utils.exist(this.tagList, name);
      if (!bool) {
        if (!target.hidden) {
          if (this.$route.params) {
          }
          this.addTagOpenPage({ ...target, params: this.$route.params });
          this.changeActiveTagOpenPage(target.name);
        }
      } else {
        if (this.$route.params) {
          this.editTagOpenPage({ ...target, params: this.$route.params });
        }
        this.changeActiveTagOpenPage(target.name);
      }
    },
  },
  created() {},
  mounted() {
    console.log('Appmounted');
    this.menuList = this.$router.options.routes;
  },
};
</script>

<style>
/*滚动条*/
::-webkit-scrollbar {
  /* 这个width决定纵向滚动条宽度 */
  /* width: 10px; */
  /* 这个width决定横向滚动条宽度 */
  /* height: 10px; */
  width: 2px;
  height: 2px;
  /* background: rgba(255, 255, 255, 0.5); */
  /* border-radius: 10px; */
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: rgba(245, 247, 248, 0.5);
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  /* border-radius: 10px; */
  /* background: skyblue; */
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  border-radius: 2px;
  /* border-radius: 10px; */
  background: #6b7385;
  /* background: rgba(255, 255, 255, 0.5); */
}
</style>
