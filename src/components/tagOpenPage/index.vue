<template>
  <div>
    <div class="tagOpen">
      <div class="tagListWrap">
        <Icon
          class="arrow arrow-left"
          type="ios-arrow-back"
          size="24"
          @click.native="left"
        />
        <Icon
          class="arrow arrow-right"
          type="ios-arrow-forward"
          size="24"
          @click.native="right"
        />
        <div style="overflow: hidden" ref="tagListWrap">
          <div
            class="tagList"
            ref="tagList"
            :style="{
              transition: alltime,
              transform: `translateX(${offset}px)`,
            }"
          >
            <Tag
              v-for="(item, index) in tagOpenPageList"
              :key="index"
              type="dot"
              :closable="isClosable(item.name)"
              :color="activeTagOpenPage == item.name ? '#41b883' : '#e8eaec'"
              @click.native="onChangeTag(item)"
              @on-close="closeTag(item)"
            >
              {{ item.meta.title }}
            </Tag>
          </div>
        </div>
      </div>
      <Dropdown placement="bottom-end">
        <Button size="small">
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem @click.native="close(1)">关闭左侧</DropdownItem>
          <DropdownItem @click.native="close(2)">关闭右侧</DropdownItem>
          <DropdownItem @click.native="close(3)">关闭其他</DropdownItem>
          <DropdownItem @click.native="close(4)">全部关闭</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import utils from "../../libs/utils";
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      active: true,
      currentPage: null,
      menuList: [],
      offset: 0,
      alltime: "all .3s",
    };
  },
  computed: {
    ...mapState({
      tagOpenPageList(state) {
        console.log(state.app.tagOpenPageList);
        return state.app.tagOpenPageList;
      },
    }),
    ...mapState({
      activeTagOpenPage: (state) => {
        return state.app.activeTagOpenPage;
      },
    }),
    activeColor() {
      return (v) => {
        console.log("---");
        console.log(this.currentPage);
        console.log(this.activeTagOpenPage);
        if (v == this.activeTagOpenPage) {
          return "#41b883";
        } else {
          return "#e8eaec";
        }
      };
    },
    isClosable() {
      return (v) => {
        // console.log(v);
        return v !== "dashboard" ? true : false;
      };
    },
  },
  watch: {
    $route() {
      this.currentPage = this.$route.path;
      // console.log("999999999", this.$route.name);
    },
    tagOpenPageList() {
      this.$nextTick(() => {
        // console.log("sss");
        this.right();
      });
    },
  },
  methods: {
    ...mapMutations(["addTagOpenPage", "changeActiveTagOpenPage"]),
    // ...mapMutations({

    // }),
    close(v) {
      console.log(this.activeTagOpenPage);
      console.log(this.tagOpenPageList);
      let temp = [];
      switch (v) {
        case 1:
          try {
            this.tagOpenPageList.forEach((item, index) => {
              // temp.push(item.name);
              if (item.name != this.activeTagOpenPage) {
                temp.push(item.name);
              } else {
                throw Error();
              }
            });
          } catch (err) {}
          temp.splice(0, 1);
          temp.forEach((item) => {
            this.$store.commit("delTagOpenPage", item);
          });
          console.log(v);
          break;
        case 2:
          try {
            for (var i = this.tagOpenPageList.length - 1; i >= 0; i--) {
              temp.push(this.tagOpenPageList[i].name);
              if (this.tagOpenPageList[i].name == this.activeTagOpenPage) {
                console.log(i); // 7,3,2
                // break;
                throw Error();
              }
            }
          } catch (err) {}
          temp.splice(temp.length - 1, 1);
          temp.forEach((item) => {
            this.$store.commit("delTagOpenPage", item);
          });
          console.log(temp);
          break;
        case 3:
          this.tagOpenPageList.forEach((item, index) => {
            if (item.name != this.activeTagOpenPage) {
              temp.push(item.name);
            }
          });
          temp.splice(0, 1);
          temp.forEach((item) => {
            this.$store.commit("delTagOpenPage", item);
          });
          break;
        case 4:
          this.tagOpenPageList.forEach((item, index) => {
            temp.push(item.name);
          });
          temp.splice(0, 1);
          temp.forEach((item) => {
            this.$store.commit("delTagOpenPage", item);
          });
          this.changeActiveTagOpenPage(this.tagOpenPageList[0].name);
          this.$router.push({ name: this.tagOpenPageList[0].name });
          break;
      }
    },
    left() {
      // console.log(this.$refs.tagList);
      // console.log(this.$refs.tagListWrap);
      let tagListWrapWidth = this.$refs.tagListWrap.clientWidth;
      let tagListWidth = this.$refs.tagList.clientWidth;
      let num = tagListWidth - tagListWrapWidth;
      console.log(tagListWidth, tagListWrapWidth, num);
      if (num > 0) {
        // 如果滚动距离不超过了容器的宽度，直接归零。
        if (num < tagListWrapWidth) {
          this.offset = 0;
        } else {
          // 如果滚动距离超过了容器的宽度，只能滚动一个容器的宽度
          let newnum = this.offset + tagListWrapWidth;
          // console.log(newnum)
          // 当滚到第一个时，不能再滚了
          this.offset = newnum > 0 ? 0 : newnum;
        }
        // console.log(num);
        // // this.alltime = "all 0s"
        // console.log(this.offset);
        // let newnum = num - this.offset;
        // this.offset = newnum;
        // console.log(this.offset);
      }
    },
    right() {
      // console.log(this.$refs.tagList);
      // console.log(this.$refs.tagListWrap);
      let tagListWrapWidth = this.$refs.tagListWrap.clientWidth;
      let tagListWidth = this.$refs.tagList.clientWidth;
      let num = tagListWidth - tagListWrapWidth;
      console.log(tagListWidth, tagListWrapWidth, num);
      if (num > 0) {
        console.log(num);
        this.offset = -num;
        // console.log(this.offset);
      }
    },
    closeTag(v) {
      console.log("关闭");
      console.log(v);
      console.log(this.$route);
      console.log(this.currentPage);
      console.log(this.tagOpenPageList);

      if (v.name == this.$route.name) {
        console.log("删了当前页面");
        this.tagOpenPageList.forEach((item, index) => {
          if (item.name == this.$route.name) {
            let newIndex =
              index + 1 == this.tagOpenPageList.length ? index - 1 : index + 1;
            console.log(newIndex);
            console.log(this.tagOpenPageList[newIndex].name);
            this.changeActiveTagOpenPage(this.tagOpenPageList[newIndex].name);

            console.log(this.tagOpenPageList[newIndex]);
            this.$router.push({ name: this.tagOpenPageList[newIndex].name });
            this.$store.commit("delTagOpenPage", v.name);
          }
        });
      } else {
        console.log("删了其他页面");
        this.$store.commit("delTagOpenPage", v.name);
      }
    },
    onChangeTag(v) {
      console.log("改变");
      console.log(v);
      if (this.$route.name != v.name) {
        this.$router.push({ name: v.name, params: v.params });
        this.changeActiveTagOpenPage(v);
      }
    },
    findItem(source, target) {
      var res = false;
      function digui(source, target) {
        let ress = "";
        try {
          source.forEach((item) => {
            // console.log(target);
            if (item.path == target) {
              ress = item;
              // console.log(res);
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
      // console.log("]]]]]]]]]]]]");
      return res;
    },
  },

  created() {
    // this.menuList = this.$router.options.routes;
    // this.currentPage = this.$route.path;
    // console.log(this.$route);
    // console.log(this.currentPage);
    // console.log(this.tagOpenPageList);
    // let target = this.findItem(this.menuList, this.currentPage);
    // console.log(target);
    // let bool = utils.exist(this.tagOpenPageList, target.name);
    // console.log(this.tagOpenPageList);
    // console.log(bool);
    // if (!bool) {
    //   // this["addTagOpenPage"](target);
    //   this.addTagOpenPage(target);
    //   this.changeActiveTagOpenPage(target.name);
    // }
  },
  mounted() {
    // if (this.isCollapsed) {
    // width = width - 200;
    // }
    // console.log(width);
    // console.log(this.$refs.tagListWrap )
    // console.log(this.$refs.tagListWrap.clientWidth )
    // console.log(utils.getStyle(this.$refs.tagListWrap,'width'))
    // console.log(utils.getStyle(this.$refs.tagListWrap,'clientWidth'))
    // console.log(utils.getStyle(this.$refs.tagList,'width'))
  },
};
</script>

<style scoped>
.tagOpen {
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
  background: #f5f7f9;
}
/* .drop {
  position: absolute;
  right: 0;
} */
.tagListWrap {
  position: relative;
  flex: 1;
  /* background: #f0f0f0; */
  /* white-space: nowrap; */
  padding: 0 30px;
  overflow: hidden;
}
.tagList {
  position: relative;
  /* width: 100%; */
  /* background: red; */
  white-space: nowrap;
  float: left;
}
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
}
.arrow:hover {
  cursor: pointer;
}
.arrow-left {
  left: 0;
}
.arrow-right {
  right: 0;
}
</style>
