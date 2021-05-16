<template>
  <div>
    <hss-table
      :tableData="{ list: linkList.rows, count: linkList.count }"
      :searchData="searchData"
      :columns="columns"
      :params="params"
      @onSearch="onSearch"
      @changePage="changePage"
    >
      <template slot-scope="{ row }" slot="operation">
        <hss-operation :row="row" :operation="operationData"></hss-operation>
      </template>
    </hss-table>

    <component
      v-bind:is="comments"
      :isShow="circleData.isShow"
      :percent="circleData.percent"
      :title="circleData.title"
      :desc="circleData.desc"
      :content="circleData.content"
    ></component>
  </div>
</template>

<script>
// import { format } from "../../../../../webchat/src/utils/format";
import {
  getMusicList,
  updateMusic,
  addMusic,
  deleteMusic,
} from "../../../api/music";
import { getQiniuToken, deleteQiniu } from "../../../api/qiniu";
import hssPopupForm from "../../../components/hssComponents/form/popup-form/index";
import hssTable from "../../../components/hssComponents/table";
import hssOperation from "../../../components/hssComponents/table/operation";
import hssCircle from "@/components/hssCircle";

import { mapState } from "vuex";
export default {
  components: { hssTable, hssOperation, hssPopupForm, hssCircle },
  data() {
    return {
      circleData: {
        isShow: false,
        percent: 0,
        title: "",
        desc: "",
        content: "",
      },
      searchRes: {},
      action: "", //1:编辑，2:新增
      comments: "",
      linkList: [],
      // 搜索列
      searchData: [
        {
          type: "Input",
          key: "keyword",
          name: "关键字",
          placeholder: "请输入关键字",
          width: 200,
        },
        {
          type: "Select",
          key: "status",
          data: [
            {
              label: "已通过",
              value: 1,
            },
            {
              label: "待审核",
              value: 0,
            },
          ],
          name: "状态",
          placeholder: "请选择状态",
          width: 200,
        },
        {
          type: "Date",
          key: "createdAt",
          name: "创建时间",
          format: "yyyy-MM-dd",
          placeholder: "请选择创建时间",
          width: 200,
        },
        {
          type: "Date",
          key: "updatedAt",
          name: "更新时间",
          format: "yyyy-MM-dd",
          placeholder: "请选择更新时间",
          width: 200,
        },
      ],
      //表格操作列
      operationData: [
        {
          name: "编辑",
          type: "CUSTOM", //CUSTOM（自定义）、ROUTER（路由方式）、DELETE（删除按钮）、STATUS（双状态切换）
          customStyle: (row) => {
            // let bool = false;
            // if (this.auth.includes("UPDATE_TAG")) {
            //   console.log("yes");
            //   bool = true;
            // }
            // console.log(this.auth);
            // return {
            //   "pointer-events": bool ? "none" : "",
            //   color: "rgb(170, 170, 170)",
            // };
          },
          custom: async (row) => {
            console.log(row);
            if (!this.auth.includes("UPDATE_MUSIC")) {
              this.$Message.error({
                content: "你没有权限修改音乐!",
              });
              return;
            }
            this.$router.push({
              name: "updateMusic",
              params: { id: row.id },
            });
          },
          // 是否显示
          isShow() {
            return 1;
          },
        },
        {
          name: "删除",
          type: "TIP",
          customStyle: (row) => {
            return {
              color: "red",
            };
          },
          custom: async (row) => {
            console.log(row);
            if (!this.auth.includes("DELETE_MUSIC")) {
              this.$Message.error({
                content: "你没有权限删除音乐!",
              });
              return;
            }
            this.comments = "hssCircle";
            this.circleData.isShow = true;
            this.circleData.title = "正在删除";
            this.circleData.desc = "正在删除封面图";
            this.circleData.content = "0/2";
            let delImg = await deleteQiniu(row.img.slice(33));
            this.$Notice.success({
              title: `${delImg.message}`,
              desc: "",
            });
            this.circleData.percent = 0;
            this.circleData.content = "1/2";
            this.circleData.percent = 50;
            this.circleData.desc = "正在删除音乐文件";
            let delUrl = await deleteQiniu(row.url.slice(33));
            this.circleData.percent = 100;
            this.circleData.content = "2/2";
            this.$Notice.success({
              title: `${delUrl.message}`,
              desc: "",
            });
            setTimeout(() => {
              this.initCircle();
            }, 500);
            deleteMusic(row.id).then((res) => {
              this.$Message.success({
                content: res.message,
              });
              this.getMusicList(this.params);
            });
          },
          isShow() {
            return 1;
          },
        },
      ],
      tableData: {
        list: "",
        count: "",
      },
      params: {
        pageSize: 10,
        nowPage: 1,
      },
      columns: [
        {
          title: "id",
          align: "center",
          key: "id",
        },
        {
          title: "音乐名",
          align: "center",
          //   width: 100,
          key: "name",
        },
        {
          title: "作者",
          align: "center",
          //   width: 100,
          key: "author",
        },
        {
          title: "封面图",
          align: "center",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.img,
                style: "width:50px;height:50px",
              },
            });
          },
        },
        {
          title: "链接",
          align: "center",
          //   width: 100,
          key: "url",
        },
        {
          title: "状态",
          // width: 100,
          align: "center",
          render: (h, params) => {
            console.log(params.row.status);
            // this.status = params.row.status == 1 ? true : false;
            // if (params.row.status == 1) {
            return h("iSwitch", {
              props: {
                value: params.row.status ? true : false,
                size: "large",
                "before-change": () => this.beforeChangeStatus(params.row),
              },
              on: {
                "on-change": (status) => this.changeStatus(params.row),
                // "on-change": (status) => {
                //   console.log(params.row);
                //   console.log(status);
                // },
              },
              scopedSlots: {
                open: () => {
                  return h("span", "通过");
                },
                close: () => {
                  return h("span", "待审");
                },
              },
            });
          },
        },
        {
          title: "创建时间",
          align: "center",
          render: (h, params) => {
            return h("span", this.formateDate(params.row.createdAt));
          },
        },
        {
          title: "修改时间",
          align: "center",
          render: (h, params) => {
            return h("span", this.formateDate(params.row.updatedAt));
          },
        },

        {
          title: "操作",
          align: "center",
          slot: "operation",
          // width: 400,
        },
      ],
    };
  },
  computed: {
    ...mapState("user", ["auth"]),
  },
  created() {
    // this.getTagList();
  },
  mounted() {
    this.getMusicList(this.params);
  },
  methods: {
    initCircle() {
      this.comments = "";
      this.circleData.percent = 0;
      this.circleData.isShow = false;
      this.circleData.title = "";
      this.circleData.desc = "";
      this.circleData.content = "";
    },
    onSelect() {
      this.params.marker = "";
      this.linkList = [];
      this.getMusicList(this.params);
    },
    changePrefix(e) {
      console.log(e);
      this.params.prefix = e;
    },
    loadMore() {
      if (this.flag) {
        this.getQiniuList(this.params);
      }
    },
    async beforeChangeStatus(row) {
      console.log(row);
      try {
        let res = await updateMusic({
          ...row,
          status: row.status == 1 ? 0 : 1,
        });
        this.$Message.success({
          content: res.message,
        });
      } catch (err) {
        return Promise.reject();
      }

      // row.status = 0;

      // });
    },
    changeStatus(row) {
      console.log(row.status);
      row.status = row.status == 1 ? 0 : 1;
      this.getMusicList({ ...this.params, ...this.searchRes });
      // updateMusic({ ...row, status: row.status == 1 ? 0 : 1 })
      //   .then((res) => {
      //     console.log('xxxxxx')
      //     row.status = row.status == 1 ? 0 : 1;
      //     this.$Message.success({
      //       content: res.message,
      //     });
      //     this.getMusicList({ ...this.params, ...this.searchRes });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     row.status = 0
      //      return Promise.reject()
      //   });
    },
    onSearch(v) {
      console.log(v);
      this.searchRes = v;
      this.params.nowPage = 1
      this.getMusicList({ ...this.params, ...v });
    },
    changePage(v) {
      console.log(v);
      this.getMusicList(v);
    },
    //转换时间格式
    formateDate(datetime) {
      console.log(datetime);
      function addDateZero(num) {
        return num < 10 ? "0" + num : num;
      }
      let d = new Date(datetime);
      let formatdatetime =
        d.getFullYear() +
        "-" +
        addDateZero(d.getMonth() + 1) +
        "-" +
        addDateZero(d.getDate()) +
        " " +
        addDateZero(d.getHours()) +
        ":" +
        addDateZero(d.getMinutes()) +
        ":" +
        addDateZero(d.getSeconds());
      return formatdatetime;
    },
    getMusicList(v) {
      getMusicList(v).then((res) => {
        console.log(res);
        this.linkList = res;
      });
    },
  },
};
</script>

<style scoped></style>
