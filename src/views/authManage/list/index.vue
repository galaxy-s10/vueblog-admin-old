<template>
  <div>
    <i-button @click="addParentAuth">新增权限</i-button>
    <Table
      border
      :loading="roleList.length == 0"
      :columns="columns"
      :data="roleList"
    ></Table>
    <hss-popup
      :show="hssShow"
      :title="hssTitle"
      @okk="popOk"
      @cancell="popCancel"
    >
      <Form :model="authInfo" :label-width="80">
        <FormItem label="id">
          <Input v-model="authInfo.id" placeholder="id" disabled></Input>
        </FormItem>
        <FormItem label="父级">
          <Select
            v-if="action == 'edit'"
            v-model="authInfo.p_id"
            style="width: 200px"
          >
            <Option
              v-for="item in parentAuth"
              :value="item.id"
              :key="item.id"
              >{{ item.auth_name + "-" + item.auth_description }}</Option
            >
          </Select>
          <span v-else-if="action == 'add'">{{ authInfo.p }}</span>
        </FormItem>
        <FormItem label="权限名">
          <Input
            v-model="authInfo.auth_name"
            placeholder="请输入权限名"
          ></Input>
        </FormItem>
        <FormItem label="权限描述">
          <Input
            v-model="authInfo.auth_description"
            placeholder="请输入权限描述"
          ></Input>
        </FormItem>
      </Form>
    </hss-popup>
  </div>
</template>

<script>
import hssPopup from "./component/popup";
import hssTable from "./component/table";
import hssTree from "./component/tree";
import {
  getAuthList,
  getUserAuth,
  findParentAuth,
  addAuth,
  editAuth,
  deleteAuth,
} from "../../../api/auth";
export default {
  components: { hssTable, hssTree, hssPopup },
  data() {
    return {
      action: "", //编辑/新增
      parentAuth: [],
      authInfo: {
        id: "",
        input: "",
        auth_name: "",
        auth_description: "",
        p_id: "",
      },
      hssShow: false,
      hssTitle: "",
      roleList: [],
      columns: [
        {
          type: "expand",
          width: 50,
          align: "center",
          render: (h, params) => {
            if (params.row.children) {
              // return h("span", params.row.children[1].role_name);
              return h(hssTree, {
                props: {
                  treeData1: params.row.children,
                },
                on: {
                  refresh: () => {
                    this.getAuthList();
                  },
                  delAuth: (v) => {
                    this.deleteAuth(v);
                  },
                  addAuth: (v) => {
                    this.addAuth(v);
                  },
                  editAuth: (v) => {
                    this.editAuth(v);
                  },
                },
              });
            }
          },
        },
        {
          title: "id",
          key: "id",
          width: "100",
          align: "center",
        },
        {
          title: "权限名",
          width: "150",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.auth_name);
          },
        },
        {
          title: "权限描述",
          width: "150",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.auth_description);
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
          width: "250",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      let {
                        id,
                        auth_name,
                        auth_description,
                        p_id,
                      } = params.row;
                      findParentAuth(id).then((res) => {
                        this.parentAuth = res.list.rows;
                        this.parentAuth.unshift({
                          id: 0,
                          auth_name: "无",
                          auth_description: "无",
                          p_id: 0,
                        });
                        this.authInfo = {
                          id,
                          auth_name,
                          auth_description,
                          p_id: p_id,
                        };
                      });
                      this.action = "edit";
                      this.hssTitle = "编辑权限";
                      this.hssShow = true;
                    },
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      // this.deleteAuth(params.row);
                      let {
                        id,
                        auth_name,
                        auth_description,
                        p_id,
                      } = params.row;
                      this.authInfo = {
                        id,
                        auth_name: "",
                        auth_description: "",
                        p_id: id,
                      };
                      this.$set(
                        this.authInfo,
                        "p",
                        auth_name + "-" + auth_description
                      );
                      this.action = "add";
                      this.hssTitle = "新增权限";
                      this.hssShow = true;
                    },
                  },
                },
                "新增"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.deleteAuth(params.row);
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
    };
  },
  computed: {},
  methods: {
    addParentAuth() {
      this.action = "add";
      this.authInfo = {
        id: null,
        p_id: 0,
        p: "无",
        auth_name: "",
        auth_description: "",
      };
      this.hssTitle = "新增权限";
      this.hssShow = true;
    },
    addAuth(v) {
      addAuth({
        p_id: v.p_id,
        auth_name: v.auth_name,
        auth_description: v.auth_description,
      })
        .then((res) => {
          this.$Message.success({
            content: res.message,
          });
          this.getAuthList();
        })
        .catch((err) => {
          this.$Message.error({
            content: err.message,
          });
        });
    },
    deleteAuth(v) {
      if (v.children) {
        this.$Message.warning({
          content: "该权限下有子权限，不能删除!",
        });
      } else {
        deleteAuth(v.id)
          .then((res) => {
            console.log("oo");
            this.$Message.success({
              content: res.message,
            });
            this.getAuthList();
          })
          .catch((err) => {
            console.log(err);
            this.$Message.error({
              content: err.message,
            });
          });
      }
    },
    editAuth(v) {
      console.log("修改权限");
      editAuth(v)
        .then((res) => {
          console.log(res);
          console.log("???");
          this.$Message.success({
            content: res.message,
          });
          this.getAuthList();
        })
        .catch((err) => {
          console.log(err);
          console.log("pppp");
          // this.$Message.error({
          //   content: err.message,
          // });
        });
    },
    popOk(v) {
      if (this.action == "add") {
        this.addAuth(this.authInfo);
      } else if (this.action == "edit") {
        this.editAuth(this.authInfo);
      }
      this.hssShow = false;
    },
    popCancel() {
      this.hssShow = false;
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
            h("span", data.auth_name + "（" + data.auth_description + "）"),
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
    // 获取所有权限列表
    getAuthList() {
      getAuthList().then((res) => {
        let { rows } = res;
        let temp = [];
        function wrap() {
          rows.forEach((item) => {
            if (item.p_id == 0) {
              temp.push(item);
            }
          });
        }
        wrap();
        function digui(data, temp) {
          temp.forEach((tempItem, tempIndex) => {
            let children = [];
            data.forEach((dataItem, dataIndex) => {
              if (tempItem.id == dataItem.p_id) {
                // let children = tempItem.children ? tempItem.children : [];
                children.push(dataItem);
              }
            });
            if (children.length > 0) {
              tempItem.children = children;
              digui(data, children);
            }
          });
        }
        digui(rows, temp);
        temp.forEach((item) => {
          if (!item.children) {
            item._disableExpand = true;
          }
        });
        this.roleList = temp;
      });
    },
    // 获取某个用户的所有权限
    getUserAuth(id) {
      let temp = [];
      getUserAuth(id)
        .then((res) => {
          let { count, rows } = res;
          rows.forEach((item) => {
            item.role.auths.forEach((val) => {
              temp.push(val.id);
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getAuthList();
    // this.getUserAuth(1);
  },
  mounted() {},
};
</script>

<style scoped>
</style>