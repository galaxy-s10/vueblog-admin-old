<template>
  <div class="wrap">
    <div class="img-wrap">
      <img
        class="qiniuImg"
        :src="'https://img.cdn.zhengbeining.com/' + item.key"
        v-for="(item, index) in list"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { getQiniuToken, getList } from "@/api/qiniu";
import axios from "axios";
export default {
  components: {},
  props: {},
  data() {
    return {
      list: [],
      params: {
        limit: 10,
        marker: "",
      },
    };
  },
  created() {},
  mounted() {
    getList({ ...this.params })
      .then((res) => {
        console.log(res);
        this.list = res.respInfo.data.items;
      })
      .catch((err) => {
        console.log(err);
      });
    // getQiniuToken().then((res) => {
    //   console.log(res);
    //   axios
    //     .get("https://img.cdn.zhengbeining.com/list?bucket=hssblog", {
    //       headers: { Authorization: `Qiniu ${res}` },
    //     })
    //     .then((ress) => {
    //       console.log(ress);
    //     });
    // });
  },
  computed: {},
  methods: {},
};
</script>

<style scoped>
@import './index.css';

</style>
