<template>
  <div>
    <div style="position: relative; display: flex; align-items: center">
      <Icon
        @click.native="collapsedSider"
        :class="rotateIcon"
        :style="{
                margin: '0 20px',
                transform: !isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
              }"
        type="md-menu"
        size="24"
      ></Icon>
      <Breadcrumb>
        <BreadcrumbItem v-for="(item, index) in breadList" :key="index">
          {{
          item.meta.title
          }}
        </BreadcrumbItem>
      </Breadcrumb>
      <div style="position: absolute; right: 10px">
        <Dropdown style="margin-left: 20px" trigger="click">
          <a href="javascript:void(0)">
            {{ username }}
            <Icon type="md-arrow-dropdown" />
          </a>
          <DropdownMenu slot="list">
            <DropdownItem>
              <a href="https://www.zhengbeining.com/" target="_bank">网站前台</a>
            </DropdownItem>
            <DropdownItem divided @click.native="goProfile">个人信息</DropdownItem>
            <DropdownItem divided @click.native="logout">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Avatar size="large" shape="square" :src="avatar" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import cache from "@/libs/cache";
export default {
  components: {},
  data() {
    return {
      isCollapsed: false,
      breadList: []
    };
  },
  computed: {
    ...mapState("user", ["username", "avatar"]),
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  methods: {
    collapsedSider() {
      this.$emit("collapsedSider");
    },
    goProfile() {
      this.$router.push({ name: "profile" });
    },
    logout() {
      cache.clearStorage("token");
      this.$router.push({ path: `/login?redirect=${this.$route.path}` });
    },
    getBreadcrumb() {
      const matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      );
      console.log(matched);
      this.breadList = matched;
    }
  },
  created() {
    this.getBreadcrumb();
  },
  mounted() {}
};
</script>

<style scoped>
</style>