<template>
  <div>
    dashboard
    <span v-for="(item, index) in auth" :key="index">{{ item }},</span>

    <Select
      v-model="form.province_id"
      style="width: 200px"
      @on-change="change1"
    >
      <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{
        item.name
      }}</Option>
    </Select>
    <Select v-model="form.city_id" style="width: 200px" @on-change="change2">
      <Option v-for="item in cityList" :value="item.id" :key="item.id">{{
        item.name
      }}</Option>
    </Select>
    <Select v-model="form.area_id" style="width: 200px" @on-change="change3">
      <Option v-for="item in areaList" :value="item.id" :key="item.id">{{
        item.name
      }}</Option>
    </Select>

    <!-- <Dropdown trigger="hover" placement="right-start">
      <a href="javascript:void(0)">
        菜单(左)
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem>驴打滚</DropdownItem>
        <DropdownItem>炸酱面</DropdownItem>
        <DropdownItem>豆汁儿</DropdownItem>
        <DropdownItem>冰糖葫芦</DropdownItem>
        <DropdownItem>北京烤鸭</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <div>
      当前权限：
      <span v-for="(item, index) in auth" :key="index">{{ item }},</span>
    </div>
    <div>
      文章权限：
      <div>
        ARTICLE_LIST
        <i-switch
          :value="checkRole('ARTICLE_LIST')"
          @on-change="(e) => change(e, 'ARTICLE_LIST')"
        ></i-switch>
      </div>
      <div>
        ADD_ARTICLE
        <i-switch
          :value="checkRole('ADD_ARTICLE')"
          @on-change="(e) => change(e, 'ADD_ARTICLE')"
        ></i-switch>
      </div>
      <div>
        DELETE_ARTICLE
        <i-switch
          :value="checkRole('DELETE_ARTICLE')"
          @on-change="(e) => change(e, 'DELETE_ARTICLE')"
        ></i-switch>
      </div>
      <div>
        UPDATE_ARTICLE
        <i-switch
          :value="checkRole('UPDATE_ARTICLE')"
          @on-change="change($event, 'UPDATE_ARTICLE')"
        ></i-switch>
      </div>
      <div>
        SELECT_ARTICLE
        <i-switch
          :value="checkRole('SELECT_ARTICLE')"
          @on-change="change($event, 'SELECT_ARTICLE')"
        ></i-switch>
      </div>
    </div>
    <hr />
    <div>
      标签权限：
      <div>
        TAG_LIST
        <i-switch
          :value="checkRole('TAG_LIST')"
          @on-change="(e) => change(e, 'TAG_LIST')"
        ></i-switch>
      </div>
      <div>
        ADD_TAG
        <i-switch
          :value="checkRole('ADD_TAG')"
          @on-change="(e) => change(e, 'ADD_TAG')"
        ></i-switch>
      </div>
      <div>
        DELETE_TAG
        <i-switch
          :value="checkRole('DELETE_TAG')"
          @on-change="(e) => change(e, 'DELETE_TAG')"
        ></i-switch>
      </div>
      <div>
        UPDATE_TAG
        <i-switch
          :value="checkRole('UPDATE_TAG')"
          @on-change="change($event, 'UPDATE_TAG')"
        ></i-switch>
      </div>
      <div>
        SELECT_TAG
        <i-switch
          :value="checkRole('SELECT_TAG')"
          @on-change="change($event, 'SELECT_TAG')"
        ></i-switch>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  data() {
    return {
      form: {
        province_id: new Date().getTime(),
        city_id: new Date().getTime(),
        area_id: new Date().getTime(),
      },
      provinceList: [
        // { name: "北京市", id: 1 },
        // { name: "辽宁省", id: 2 },
        // { name: "内蒙古自治区", id: 3 },
      ],
      cityList: [
        // { name: "广州市", id: 4 },
        // { name: "深圳市", id: 5 },
        // { name: "佛山市", id: 6 },
      ],
      areaList: [
        // { name: "天河区", id: 7 },
        // { name: "海珠区", id: 8 },
        // { name: "黄埔区", id: 9 },
        // { name: "越秀区", id: 10 },
      ],
      // roles: [
      //   "ARTICLE_LIST",
      //   "ADD_ARTICLE",
      //   "UPDATE_ARTICLE",
      //   "SELECT_ARTICLE",
      //   "DELETE_ARTICLE",
      // ],
      path: "",
    };
  },
  computed: {
    ...mapState({
      auth(state) {
        console.log("state.auth.auth");
        console.log(state);
        console.log(state.app.title);
        console.log(state.title);
        console.log(this.menuList);
        // console.log(state.auth.auth == this.menuList);
        // return state.auth.auth;
      },
    }),
    checkRole() {
      return (v) => {
        console.log(this.auth.includes(v));
        return this.auth.includes(v);
      };
    },
  },
  methods: {
    change1(e) {
      console.log(e);
      console.log("改变省级");
      this.$http({
        url: `/juhe/xzqh/query?key=8b10defc9f7fc715ce11cbd34bbdd65f&fid=${e}`,
      })
        .then((res) => {
          console.log(res.result);
          this.cityList = res.result;
          this.areaList = [];
          this.form.city_id = new Date().getTime();
          this.form.area_id = new Date().getTime();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    change2(e) {
      console.log("改变市级");
      this.$http({
        url: `/juhe/xzqh/query?key=8b10defc9f7fc715ce11cbd34bbdd65f&fid=${e}`,
      })
        .then((res) => {
          console.log(res.result);
          this.areaList = res.result;
          this.form.area_id = new Date().getTime();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    change3() {
      console.log("改变县级");
    },
    changePath(path) {
      this.$router.push({ name: path });
    },
    change(e, role) {
      if (e) {
        if (!this.roles.includes(role)) {
          this.roles.push(role);
        }
      } else {
        const index = this.roles.findIndex((item) => item === role);
        this.roles.splice(index, 1);
      }
    },
  },
  created() {},
  mounted() {
    console.log(this.$router.options.routes);
    this.$http({
      url: `/juhe/xzqh/query?key=8b10defc9f7fc715ce11cbd34bbdd65f&fid=0'`,
    })
      .then((res) => {
        console.log(res.result);
        this.provinceList = res.result;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>


<style scoped>
</style>