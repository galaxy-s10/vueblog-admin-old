<template>
  <div>
    <hss-table
      :searchData="searchData"
      :tableData="{ list: articleList.rows, count: articleList.count }"
      :columns="columns"
      :params="params"
      @onSelect="onSelect"
      @onSearch="onSearch"
      @changeSearchResult="changeSearchResult"
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
import { deleteQiniu } from "@/api/qiniu";
import { mapState } from "vuex";
import hssCircle from "../../../components/hssCircle";
import hssTable from "../../../components/hssComponents/table";
import hssOperation from "../../../components/hssComponents/table/operation";
import {
  getArticleList,
  updateArticle,
  deleteArticle,
} from "../../../api/article";
import { getTypeList } from "../../../api/type";
export default {
  components: { hssTable, hssOperation, hssCircle },
  data() {
    return {
      comments: "",
      circleData: {
        isShow: false,
        percent: 0,
        title: "",
        desc: "",
        content: "",
      },
      params: {
        // is_admin: 1, //是否后台，是的话显示所有文章，包括未审核
        pageSize: 10,
        nowPage: 1,
      },
      searchRes: {},
      // 搜索列
      searchData: [
        {
          type: "Select",
          key: "type_id",
          name: "分类",
          placeholder: "请选择分类",
          data: this.articleTypeList,
          width: 150,
          // val:2,
        },
        {
          type: "Select",
          key: "status",
          name: "状态",
          placeholder: "请选择文章状态",
          data: [
            {
              label: "已发布",
              value: 1,
            },
            {
              label: "待审核",
              value: 0,
            },
          ],
          width: 150,
        },
        {
          type: "Select",
          key: "is_comment",
          name: "评论",
          placeholder: "请选择评论状态",
          data: [
            {
              label: "开启",
              value: 1,
            },
            {
              label: "关闭",
              value: 0,
            },
          ],
          width: 150,
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
      // 表格操作列
      operationData: [
        {
          name: "编辑",
          type: "CUSTOM", //CUSTOM（自定义）、ROUTER（路由方式）、DELETE（删除按钮）、STATUS（双状态切换）
          custom: async (row) => {
            console.log(row);
            if (!this.auth.includes("UPDATE_ARTICLE")) {
              this.$Message.error({
                content: "你没有权限修改文章!",
              });
              return;
            }
            this.$router.push({
              name: "updateArticle",
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
            if (!this.auth.includes("DELETE_ARTICLE")) {
              this.$Message.error({
                content: "你没有权限删除文章!",
              });
              return;
            }
            // return
            let reg = /https:\/\/img.cdn.zhengbeining.com\/.+?(jpg|png|jpeg|gif)/g;
            const qiniuImgs = row.content.match(reg);
            let allImgs = [];
            if (row.img) {
              allImgs.push(row.img);
            }
            if (qiniuImgs) {
              allImgs.push(qiniuImgs);
            }
            if (allImgs) {
              console.log(allImgs);
              let num = 0;
              this.comments = "hssCircle";
              this.circleData.isShow = true;
              this.circleData.title = "正在删除";
              this.circleData.desc = "正在删除文章图片";
              this.circleData.percent = (num / allImgs.length).toFixed(2) * 100;
              this.circleData.content = num + "/" + allImgs.length;
              for (let i = 0; i < allImgs.length; i++) {
                await this.delQiniuImg(allImgs[i]).then((res) => {
                  console.log(res);
                  this.circleData.content = ++num + "/" + allImgs.length;
                  this.circleData.percent =
                    (num / allImgs.length).toFixed(2) * 100;
                });
              }
            }
            deleteArticle(row.id).then((res) => {
              this.$Message.success({
                content: res.message,
              });
              this.getArticleList(this.params);
              this.initCircle();
            });
          },
          isShow() {
            return 1;
          },
        },
      ],
      loading: true,
      showRole: false,
      articleList: [],
      articleTypeList: [],
      columns: [
        {
          title: "id",
          key: "id",
          // width: 100,
          align: "center",
        },
        {
          title: "标题",
          // width: 150,
          align: "center",
          render: (h, params) => {
            // console.log(params);
            return h("span", params.row.title);
          },
        },
        {
          title: "分类",
          // width: 150,
          align: "center",
          render: (h, params) => {
            // console.log(params);
            return h("span", params.row.types[0].name);
          },
        },
        {
          title: "封面图",
          // width: 100,
          align: "center",
          render: (h, params) => {
            if (params.row.img) {
              return h("img", {
                attrs: {
                  src: params.row.img,
                  style: "width:50px;height:50px",
                },
              });
            } else {
              return h("span", "无");
            }
          },
        },
        {
          title: "作者",
          // key: "click",
          // width: 100,
          align: "center",
          render: (h, params) => {
            // console.log(params.row);
            return h("span", params.row.users[0].username);
          },
        },
        {
          title: "浏览数",
          // width: 100,
          align: "center",
          render: (h, params) => {
            return h("span", params.row.click);
          },
        },
        {
          title: "点赞数",
          // width: 100,
          align: "center",
          render: (h, params) => {
            return h("span", params.row.stars.length);
          },
        },
        {
          title: "状态",
          // width: 100,
          align: "center",
          render: (h, params) => {
            // console.log(params.row.status);
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
                // "on-change": (status) => {
                //   console.log(params.row);
                //   console.log(status);
                // },
              },
              scopedSlots: {
                open: () => {
                  return h("span", "发布");
                },
                close: () => {
                  return h("span", "审核");
                },
              },
            });
          },
        },
        {
          title: "评论",
          // width: 100,
          align: "center",
          render: (h, params) => {
            let that = this;
            // console.log(params.row.is_comment);
            // this.is_comment = params.row.is_comment == 1 ? true : false;
            // if (params.row.is_comment == 1) {
            let aaa = { ...params.row };
            return h("i-switch", {
              props: {
                value: aaa.is_comment == 1,
                size: "large",
                "before-change": () => this.beforeChangeStatus(params.row),
              },
              on: {
                "on-change": (is_comment) => {
                  /* 
                    一定要修改原本的params.row.is_comment，否则不会更新！
                    一开始给iSwitch默认值params.row.is_comment，
                    后面执行事件后，视图层切换了状态，
                    但是如果没有改变params.row.is_comment，还是原来的值的话，就会出问题
                    比如原本是true，点击切换事件，但是并没有给params.row.is_comment重新赋值，
                    那么表面上看iSwitch是切换了状态，但实际上还是true,如果这时候刷新表格数据，
                    这个新的数据的params.row.is_comment是true，按道理应该是打开状态，但是由于
                    这个iSwitch原本就是true，切换事件后没有修改值，它还是true,只不过它显示的关闭
                    状态而已，这个组件应该不是重新创建销毁的，而是复用了，因此刷新数据后的值是true，
                    它就不会更新！因为它本身就是true。
                    类似父子组件传值，不要违反单向数据流直接修改子组件值，子组件的值要改变要通过父组件
                    进行修改
                   */
                  params.row.is_comment = is_comment ? 1 : 0;
                  // console.log("on-changeon-change");
                  setTimeout(() => {
                    that.changeIsComment(is_comment, aaa);
                  }, 1000);
                },
                // "on-change": (is_comment) => {
                //   console.log(params.row);
                //   console.log(is_comment);
                // },
              },
              scopedSlots: {
                open: () => {
                  return h("span", "开启");
                },
                close: () => {
                  return h("span", "关闭");
                },
              },
            });
          },
        },
        {
          title: "创建时间",
          align: "center",
          // width: 150,
          render: (h, params) => {
            return h("span", this.formateDate(params.row.createdAt));
          },
        },
        {
          title: "更新时间",
          align: "center",
          // width: 150,
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
  methods: {
    initCircle() {
      this.isShow = false;
      this.comments = "";
      this.circleData.percent = 0;
      this.circleData.title = "";
      this.circleData.desc = "";
      this.circleData.content = "";
    },
    async delQiniuImg(filename) {
      await deleteQiniu(filename.slice(33));
    },
    changeStatus(v, row) {
      console.log(v);
      console.log(row);
      console.log("changeStatus");
      let tagTemp = [];
      row.tags.forEach((item) => {
        tagTemp.push(item.id);
      });
      let type_id = row.types[0].id;
      updateArticle({ ...row, status: v ? 1 : 0, tags: tagTemp, type_id })
        .then((res) => {
          this.$Message.success({
            content: res.message,
          });
          this.getArticleList({ ...this.params, ...this.searchRes });
        })
        .catch((err) => {
          this.$Message.error({
            content: err,
          });
        });
    },
    changeIsComment(v, row) {
      console.log(v);
      console.log(row);
      console.log("changeStatus");
      let tagTemp = [];
      row.tags.forEach((item) => {
        tagTemp.push(item.id);
      });
      let type_id = row.types[0].id;
      updateArticle({
        ...row,
        is_comment: v ? 1 : 0,
        tags: tagTemp,
        type_id,
      }).then((res) => {
        this.$Message.success({
          content: res.message,
        });
        this.getArticleList({ ...this.params, ...this.searchRes });
      });
    },
    beforeChangeStatus(row) {
      return new Promise((resolve, reject) => {
        if (!this.auth.includes("UPDATE_ARTICLE")) {
          this.$Message.error({
            content: "你没有权限修改文章!",
          });
          reject();
        } else {
          resolve();
        }
      });
      //  console.log(row);
      // console.log("beforeChangeStatus");
      // let temp =[]
      // row.tags.forEach(item=>{
      //   temp.push(item)
      // })
    },
    onSelect(v) {
      console.log(v);
    },
    changeSearchResult(v) {
      console.log(v);
      // this.params = { ...this.params, ...v };
    },
    onSearch(v) {
      this.params.nowPage = 1;
      this.searchRes = v;
      // this.changePage({ ...this.params, ...v });
      this.getArticleList({ ...this.params, ...v });
    },
    changePage(v) {
      this.getArticleList(v);
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
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
          },
        },
        [
          h("span", [
            h("span", data.role_name),
            // h("span", data.role_name + "（" + data.role_description + "）"),
          ]),
          h("span", {
            style: {
              display: "inline-block",
              float: "right",
              marginRight: "32px",
            },
          }),
        ]
      );
    },
    async getArticleList(v) {
      console.log("9999999999");
      console.log(v);
      console.log({ ...v });
      let res = await getArticleList(v);
      console.log(res);
      this.articleList = res;
      this.params.count = res.count;
    },
    async getArticleTypeList(v) {
      let typeList = [];
      let res = await getTypeList(v);
      res.rows.forEach((item) => {
        let temp = {};
        temp.label = item.name;
        temp.value = item.id;
        typeList.push(temp);
      });
      this.articleTypeList = typeList;
      this.searchData[0].data = this.articleTypeList;
    },
  },
  created() {},
  async mounted() {
    this.getArticleList(this.params);
    this.getArticleTypeList(this.params);
  },
};
</script>

<style scoped>
/* /deep/ .ivu-spin {
  text-align: initial;
} */
/* .aaa /deep/ .ivu-tree ul li{
    margin: 0;
}
.aaa /deep/ .ivu-checkbox-disabled .ivu-checkbox-inner{
  background: #eee;
} */
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
