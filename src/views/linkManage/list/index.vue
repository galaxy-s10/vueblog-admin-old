<template>
  <div>
    <!-- <div v-if="tableData.list"> -->
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
    <!-- </div> -->
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
    <!-- <hss-table v-if="tableData.list.length>0" :tableData="tableData" :columns="columns" :params="params"></hss-table> -->
  </div>
</template>

<script>
// import { format } from "../../../../../webchat/src/utils/format";
import { getLinkList, updateLink, deleteLink } from "../../../api/link";
import hssPopupForm from "../../../components/hssComponents/form/popup-form/index";
import hssTable from "../../../components/hssComponents/table";
import hssOperation from "../../../components/hssComponents/table/operation";
import { mapState } from "vuex";
export default {
  components: { hssTable, hssOperation, hssPopupForm },
  data() {
    return {
      action: "", //1:编辑，2:新增
      columnForm: {},
      tagInfo: {},
      searchRes: {},
      comments: "",
      isInit: false,
      request: {},
      linkList: [],
      //表格操作列
      operationData: [
        {
          name: "编辑",
          type: "CUSTOM", //CUSTOM（自定义）、ROUTER（路由方式）、DELETE（删除按钮）、STATUS（双状态切换）
          customStyle: (row) => {},
          custom: async (row) => {
            console.log(row);
            if (!this.auth.includes("UPDATE_LINK")) {
              this.$Message.error({
                content: "你没有权限修改标签!",
              });
              return;
            }
            this.action = 1;
            this.tagInfo = {
              ...row,
              createdAt: this.formateDate(row.createdAt),
            };
            this.columnForm = {
              list: [
                {
                  prop: "id",
                },
                {
                  type: "Input",
                  name: "名称",
                  prop: "name",
                  placeholder: "请输入友链名称",
                  required: true,
                },
                {
                  name: "头像",
                  type: "Input",
                  prop: "avatar",
                  placeholder: "请输入友链头像",
                  required: true,
                },
                {
                  name: "描述",
                  type: "Input",
                  prop: "description",
                  placeholder: "请输入友链描述",
                  required: true,
                },
                {
                  name: "链接",
                  type: "Input",
                  prop: "url",
                  placeholder: "请输入友链链接",
                  required: true,
                },
                {
                  name: "状态",
                  type: "Radio",
                  data: [
                    { label: "已通过", value: 1 },
                    { label: "待审核", value: 0 },
                  ],
                  prop: "status",
                  required: true,
                },
                // {
                //   name: "创建时间",
                //   type: "Date",
                //   prop: "createdAt",
                //   isDate: true,
                //   placeholder: "请选择创建时间",
                //   required: true,
                // },
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
            // if (row.articles.length > 0) {
            delLink(row.id).then((res) => {
              this.$Message.success({
                content: res.message,
              });
              this.getLinkList(this.params);
            });
            // }
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
          name: "状态",
          type: "Select",
          width: 200,
          data: [
            { label: "已通过", value: 1 },
            { label: "待审核", value: 0 },
          ],
          key: "status",
          required: true,
        },
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
        // count: 0,
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
          title: "申请者ip",
          align: "center",
          key: "ip",
        },
        {
          title: "申请者email",
          align: "center",
          key: "email",
        },
        {
          title: "名称",
          align: "center",
          key: "name",
        },
        {
          title: "头像",
          align: "center",
          // key: "name",
          render: (h, params) => {
            if (params.row.avatar) {
              return h("img", {
                attrs: {
                  src: params.row.avatar,
                  style: "width:50px;height:50px",
                },
              });
            } else {
              return h("span", "无");
            }
          },
        },
        {
          title: "描述",
          align: "center",
          key: "description",
        },
        {
          title: "链接",
          align: "center",
          key: "url",
        },
        {
          title: "状态",
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
                "on-change": (status) => {
                  params.row.status = status ? 1 : 0;
                  this.changeStatus(status, params.row);
                },
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
  created() {
    // this.getTagList();
  },
  mounted() {
    this.getLinkList(this.params);
  },
  methods: {
    beforeChangeStatus(v, row) {
      return new Promise((resolve, reject) => {
        if (!this.auth.includes("UPDATE_LINK")) {
          this.$Message.error({
            content: "你没有权限修改标签!",
          });
          reject();
        } else {
          resolve();
        }
      });
    },
    changeStatus(v, row) {
      let tagTemp = [];
      updateLink({ ...row, status: v ? 1 : 0, isSendEmail: v }).then((res) => {
        this.$Message.success({
          content: res.message,
        });
        this.getLinkList({ ...this.params, ...this.searchRes });
      });
    },
    addTag() {
      this.action = 2;
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
            placeholder: "请输入友链名称",
            required: true,
          },
          {
            name: "头像",
            type: "Input",
            prop: "avatar",
            placeholder: "请输入友链头像",
            required: true,
          },
          {
            name: "描述",
            type: "Input",
            prop: "description",
            placeholder: "请输入友链描述",
            required: true,
          },
          {
            name: "链接",
            type: "Input",
            prop: "url",
            placeholder: "请输入友链链接",
            required: true,
          },

          // {
          //   name: "创建时间",
          //   type: "Date",
          //   prop: "createdAt",
          //   isDate: true,
          //   placeholder: "请选择创建时间",
          //   required: true,
          // },
        ],
      };
      this.request = {
        title: "新增标签",
        size: "centre",
      };
      // this.isInit = true;
      this.comments = "hssPopupForm";
    },
    onCancel() {
      // this.showRole = false
      console.log("onCancel");
      this.roleInfo = {};
      this.comments = "";
    },
    onOk() {
      this.comments = "";
      console.log('xo');
    },
    async onSubmit(v) {
      console.log(v);
      let temp = [];
      await updateLink(v).then((res) => {
        console.log(res);
        this.$Message.success({
          content: res.message,
        });
        this.getLinkList({ ...this.params });
      });
    },
    onSearch(v) {
      console.log(v);
      this.searchRes = v;
      this.params.nowPage = 1;
      this.getLinkList({ ...this.params, ...v });
    },
    changePage(v) {
      console.log(v);
      this.getLinkList(v);
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
    async getLinkList(v) {
      await getLinkList(v).then((res) => {
        console.log(res);
        this.linkList = res;
        // this.linkList = res.rows
        // this.tableData.list = res.rows;
        // this.tableData.count = res.count;
      });
    },
  },
};
</script>

<style scoped></style>
