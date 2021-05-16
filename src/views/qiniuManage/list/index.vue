<template>
  <div>
    <hss-table
      :tableData="{ list: qiniuList.rows, count: qiniuList.count }"
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
      :request="request"
      :fromData="columnForm"
      :initData="qiniuData"
      :isInit="isInit"
      @on-cancel="onCancel"
      @on-ok="onOk"
      @onSubmit="onSubmit"
    ></component>
    <!-- <i-button @click="insert">获取所有七牛云服务器文件</i-button> -->
    <Modal
      v-model="modal2"
      :mask-closable="false"
      @on-cancel="closeModal2"
      width="360"
    >
      <p slot="header">预览</p>
      <div>
        <img :src="previewSrc" alt="" width="100%" />
      </div>
      <div slot="footer">
        <Button @click="closeModal2">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getQiniuToken,
  getQiniuList,
  updateQiniu,
  deleteQiniu,
  insertQiniu,
  getAllQiniuData,
} from "@/api/qiniu";
import utils from "../../../libs/utils";
import hssPopupForm from "../../../components/hssComponents/form/popup-form/index";
import hssTable from "../../../components/hssComponents/table";
import hssOperation from "../../../components/hssComponents/table/operation";
import { mapState } from "vuex";
export default {
  components: { hssTable, hssOperation, hssPopupForm },
  data() {
    return {
      previewSrc: "",
      modal2: false,
      flag: true, //是否可加载下一页
      action: "", //1:编辑，2:新增
      columnForm: {},
      qiniuData: {},
      comments: "",
      isInit: false,
      request: {},
      qiniuList: {},
      // tableData: {
      //   list: "",
      //   count: "",
      // },
      // 搜索列
      searchData: [
        {
          type: "Input",
          key: "keyword",
          name: "关键字",
          placeholder: "文件名/类型",
          width: 200,
        },
        // {
        //   type: "Date",
        //   key: "createdAt",
        //   name: "创建时间",
        //   format: "yyyy-MM-dd",
        //   placeholder: "请选择创建时间",
        //   width: 200,
        // },
        {
          type: "Date",
          key: "updatedAt",
          name: "修改时间",
          format: "yyyy-MM-dd",
          placeholder: "请选择修改时间",
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
            if (!this.auth.includes("UPDATE_TAG")) {
              this.$Message.error({
                content: "权限不足！",
              });
              return;
            }
            this.action = 1;
            this.qiniuData = {
              ...row,
              srcKey: row.key,
            };
            this.columnForm = {
              list: [
                {
                  // type: "Input",
                  // name: "文件名",
                  prop: "srcKey",
                  // placeholder: "请输入文件名",
                  // required: true,
                },
                {
                  type: "Input",
                  name: "文件名",
                  prop: "key",
                  placeholder: "请输入文件名",
                  required: true,
                },
                {
                  name: "大小",
                  type: "Input",
                  isNumber: true,
                  prop: "fsize",
                  disabled: true,
                  required: true,
                },
                {
                  name: "类型",
                  type: "Input",
                  prop: "mimeType",
                  disabled: true,
                  required: true,
                },
              ],
            };
            this.request = {
              title: "编辑",
              size: "centre",
            };
            this.isInit = true;
            this.comments = "hssPopupForm";
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
          custom: (row) => {
            console.log(row);
            if (!this.auth.includes("DELETE_TAG")) {
              this.$Message.error({
                content: "权限不足！",
              });
              return;
            }
            deleteQiniu(row.key).then((res) => {
              this.$Message.success({
                content: res.message,
              });
              this.getQiniuList({ ...this.params, ...this.searchRes });
              // .then((res) => {
              //   this.qiniuList = res;
              // });
            });
          },
          isShow() {
            return 1;
          },
        },
      ],
      params: {
        pageSize: 10,
        nowPage: 1,
      },
      columns: [
        {
          title: "文件名",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h(
              "span",
              {
                attrs: {
                  style:
                    "overflow:hidden;text-overflow:ellipsis;white-space: nowrap;",
                },
              },
              params.row.key
            );
          },
        },
        {
          title: "预览",
          align: "center",
          render: (h, params) => {
            return h(
              "iButton",
              {
                attrs: {
                  icon: "md-eye",
                  type: "info",
                  size: "small",
                },
                on: {
                  click: () => {
                    console.log(params.row.key);
                    this.modal2 = true;
                    this.previewSrc =
                      "https://img.cdn.zhengbeining.com/" + params.row.key;
                  },
                  // "on-change": (status) => {
                  //   console.log(params.row);
                  //   console.log(status);
                  // },
                },
              },
              "预览"
            );
          },
        },
        {
          title: "大小",
          align: "center",
          render: (h, params) => {
            let temp = params.row.putTime + "";
            return h("span", this.formatFsize(params.row.fsize));
          },
        },
        {
          title: "类型",
          align: "center",
          key: "mimeType",
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
    this.getQiniuList(this.params);
  },
  async mounted() {
    // let res = await this.getQiniuList(this.params);
    // this.QiniuList = res;
  },
  methods: {
    closeModal2() {
      this.modal2 = false;
      this.previewSrc = "";
    },
    async insert() {
      let res = await getAllQiniuData();
      let rows = res.respInfo.data.items;
      let temp = [];
      for (let i = 0; i < rows.length; i++) {
        // await insertQiniu(rows[i]);
        let x = rows[i].putTime + "";
        let t = x.slice(0, x.length - 4);
        console.log(utils.formateDate1(parseInt(t)) + "");
        rows[i].putTime = utils.formateDate1(parseInt(t)) + "";
        temp.push(rows[i]);
      }
      console.dir(temp);
      // for (let i = 0; i < temp.length; i++) {
      //   await insertQiniu(temp[i]);
      // }
    },
    // 格式化文件大小
    formatFsize(val) {
      let res;
      res = (val / 1024).toFixed(2);
      if (res > 1024) {
        res = (res / 1024).toFixed(2);
        return res + "MB";
      }
      return res + "KB";
    },
    onCancel() {
      console.log("onCancel");
      this.roleInfo = {};
      this.comments = "";
    },
    onOk() {
      console.log("000");
      this.comments = "";
    },
    async onSubmit(v) {
      console.log(v);
      let temp = [];
      try {
        await updateQiniu({ srcKey: v.srcKey, destKey: v.key }).then((res) => {
          console.log(res);
          this.$Message.success({
            content: res.message,
          });
          this.getQiniuList({ ...this.params, ...this.searchRes });
        });
      } catch (err) {
        console.log(err);
      }
    },
    onSearch(v) {
      console.log(v);
      this.searchRes = v;
      this.params.nowPage = 1
      this.getQiniuList({ ...this.params, ...v });
    },
    changePage(v) {
      console.log(v);
      this.getQiniuList({ ...this.params, ...v });
    },
    //转换时间格式
    formateDate(datetime) {
      // console.log(datetime);
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
    async getQiniuList(v) {
      let res = await getQiniuList(v);
      this.qiniuList = res;
    },
  },
};
</script>

<style scoped></style>
