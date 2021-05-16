<template>
  <div>
    <Table
      border
      :loading="log.rows && log.rows.length == 0"
      :columns="columns"
      :data="log.rows"
    ></Table>
    <Page :total="log.count" show-total show-elevator @on-change="changePage" />
  </div>
</template>

<script>
import { getLogList } from "../../../api/log";

export default {
  components: {},
  data() {
    return {
      page: {
        pageSize: 10,
        nowPage: 1,
      },
      log: [],
      // logList: [],
      columns: [
        {
          title: "id",
          key: "id",
          width: "60",
          align: "center",
        },
        {
          title: "用户名",
          width: "80",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.user.username);
          },
        },
        {
          title: "请求ip",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.api_ip);
          },
        },
        {
          title: "请求主机名",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.api_hostname);
          },
        },
        {
          title: "请求方式",
          align: "center",
          width: "100",
          render: (h, params) => {
            return h("span", params.row.api_method);
          },
        },
        {
          title: "请求接口",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.api_path);
          },
        },
        {
          title: "请求参数",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("div", "query: " + params.row.api_query),
              h("div", "body: " + params.row.api_body),
            ]);
          },
        },
        {
          title: "请求时间",
          align: "center",
          render: (h, params) => {
            return h("span", this.formateDate(params.row.createdAt));
          },
        },
        // {
        //   title: "更新时间",
        //   align: "center",
        //   render: (h, params) => {
        //     return h("span", this.formateDate(params.row.updatedAt));
        //   },
        // },
      ],
    };
  },
  created() {
    this.getLogList();
  },
  mounted() {},
  computed: {},
  methods: {
    changePage(v) {
      console.log(v);
      this.page.nowPage = v;
      this.getLogList();
    },
    getLogList() {
      getLogList({ ...this.page })
        .then((res) => {
          this.log = res;
        })
        .catch((err) => {
          console.log(err);
        });
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
  },
};
</script>

<style scoped>
</style>