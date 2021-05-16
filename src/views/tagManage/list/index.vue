<template>
  <div>
    <hss-table
      :tableData="{ list: tagList.rows, count: tagList.count }"
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
      :initData="tagInfo"
      :isInit="isInit"
      @on-cancel="onCancel"
      @on-ok="onOk"
      @onSubmit="onSubmit"
    ></component>
  </div>
</template>

<script>
import hssPopupForm from "../../../components/hssComponents/form/popup-form/index";
import hssTable from "../../../components/hssComponents/table";
import hssOperation from "../../../components/hssComponents/table/operation";

import { getTagList, updateTag, deleteTag, addTag } from "../../../api/tag";
import { mapState } from "vuex";

export default {
  components: { hssTable, hssOperation, hssPopupForm },
  data() {
    return {
      action: "", //1:编辑，2:新增
      columnForm: {},
      tagInfo: {},
      comments: "",
      isInit: false,
      request: {},
      tagList: [],
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
                content: "你没有权限修改标签!",
              });
              return;
            }
            this.action = 1;
            this.tagInfo = { ...row, createdAt: this.formateDate(row.createdAt) };
            this.columnForm = {
              list: [
                {
                  // name: "id",
                  // type: "Input",
                  prop: "id",
                  // placeholder: "",
                  // display:'none'
                },
                {
                  type: "Input",
                  name: "名称",
                  prop: "name",
                  placeholder: "请输入标签名",
                  required: true,
                },
                {
                  name: "颜色",
                  type: "Input",
                  prop: "color",
                  placeholder: "请输入标签颜色",
                  required: true,
                },
                {
                  name: "创建时间",
                  type: "Date",
                  prop: "createdAt",
                  isDate: true,
                  placeholder: "请选择创建时间",
                  required: true,
                },
              ],
            };
            this.request = {
              title: "编辑标签",
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
                content: "你没有权限删除标签!",
              });
              return;
            }
            if (row.articles.length > 0) {
              this.$Modal.confirm({
                title: "提示",
                content: `${row.name}标签下有${row.articles.length}篇文章，确定删除吗?`,
                onOk: () => {
                  deleteTag(row.id).then((res) => {
                    this.$Message.success({
                      content: res.message,
                    });
                    this.getTagList(this.params);
                  });
                },
                onCancel: () => {
                  this.$Message.info({
                    content: "你取消了删除操作",
                  });
                },
              });
            } else {
              deleteTag(row.id).then((res) => {
                this.$Message.success({
                  content: res.message,
                });
                this.getTagList(this.params);
              });
            }
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
      params: {
        pageSize: 10,
        nowPage: 1,
      },
      columns: [
        {
          title: "id",
          key: "id",
          width: "100",
          align: "center",
        },
        {
          title: "名称",
          align: "center",
          key: "name",
        },
        {
          title: "颜色",
          align: "center",
          key: "color",
        },
        {
          title: "预览",
          align: "center",
          render: (h, params) => {
            console.log(params);
            return h(
              "div",
              {
                style: {
                  display: "inline-block",
                  background: params.row.color,
                  padding: "5px 10px",
                  borderRadius: "5px",
                  color: "white",
                },
              },
              params.row.name
            );
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
          title: "更新时间",
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
  created() {},
  mounted() {
    this.getTagList(this.params);
  },
  methods: {
    onCancel() {
      console.log("onCancel");
      this.roleInfo = {};
      this.comments = "";
    },
    onOk() {
      this.comments = "";
    },
    async onSubmit(v) {
      console.log(v);
      if (this.action == 1) {
        let temp = [];
        await updateTag(v).then((res) => {
          console.log(res);
          this.$Message.success({
            content: res.message,
          });
          this.getTagList(this.params);
        });
      } else {
        await addTag(v).then((res) => {
          console.log(res);
          this.$Message.success({
            content: res.message,
          });
          this.getTagList(this.params);
        });
      }
    },
    onSearch(v) {
      console.log(v);
      this.params.nowPage = 1;
      this.getTagList({ ...this.params, ...v });
    },
    changePage(v) {
      console.log(v);
      this.getTagList(v);
    },
    //转换时间格式
    formateDate(datetime) {
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
    async getTagList(v) {
      await getTagList(v).then((res) => {
        console.log(res);
        this.tagList = res;
        // this.tagList = res.rows
        // this.tableData.list = res.rows;
        // this.tableData.count = res.count;
      });
    },
  },
};
</script>

<style scoped></style>
