<template>
  <div>
    <hss-table
      :searchData="searchData"
      :tableData="{ list: userList.rows, count: userList.count }"
      :columns="columns"
      :params="params"
      @onSelect="onSelect"
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
      :initData="userInfo"
      :isInit="isInit"
      @on-cancel="onCancel"
      @on-ok="onOk"
      @onSubmit="onSubmit"
    ></component>
  </div>
</template>

<script>
import hssTable from "../../../components/hssComponents/table";
import hssOperation from "../../../components/hssComponents/table/operation";
import hssPopupForm from "../../../components/hssComponents/form/popup-form/index";

import utils from "../../../libs/utils";
import {
  getUserList,
  updateUserAndRole,
  updateUserStatus,
  deleteUser,
} from "../../../api/user";
import {
  addRole,
  getRoleList,
  editRoleAuth,
  editUserRole,
  findParentRole,
  findBrotherRole,
} from "../../../api/role";
import {
  getAuth,
  getUserRoleAuth,
  addAuthForRole,
  // getUserRoleList,
} from "../../../api/roleauth";

// import { getRoleList, editUserRole } from "../../../api/role";
// import { getAuth, getUserRoleList } from "../../../api/roleauth";
import { mapState } from "vuex";
export default {
  components: { hssTable, hssOperation, hssPopupForm },
  data() {
    return {
      comments: "",
      request: {},
      columnForm: {},
      searchRes: {},
      isInit: false,
      params: {
        pageSize: 10,
        nowPage: 1,
      },
      userInfo: {
        id: "",
        role_name: "",
        role_description: "",
        p_id: "",
        roles: [],
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
          type: "Select",
          key: "status",
          name: "状态",
          placeholder: "请选择用户状态",
          data: [
            {
              label: "正常",
              value: 1,
            },
            {
              label: "禁用",
              value: 0,
            },
          ],
          width: 150,
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
        // {
        // // DateTimeRange有bug，暂时不要用!
        //   type: "DateTimeRange",
        //   name: "时间范围",
        //   key: "timeRange",
        //   placeholder: "DateTimeRange",
        //   format: "yyyy-MM-dd HH:mm",
        //   width: 300,
        // },
      ],
      // 表格操作列
      operationData: [
        {
          name: "编辑",
          type: "CUSTOM", //CUSTOM（自定义）、ROUTER（路由方式）、DELETE（删除按钮）、STATUS（双状态切换）
          custom: async (row) => {
            if (!this.auth.includes("UPDATE_USER")) {
              this.$Message.error({
                content: "你没有权限修改用户!",
              });
              return;
            }
            this.editRole({ ...row });
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
            if (!this.auth.includes("DELETE_USER")) {
              this.$Message.error({
                content: "你没有权限删除用户!",
              });
              return;
            }
            deleteUser(row.id).then((res) => {
              this.$Message.success({
                content: res.message,
              });
              this.getUserList({ ...this.params, ...this.searchRes });
            });
          },
          isShow() {
            return 1;
          },
        },
      ],
      flatRole: [],
      loading: true,
      showEditStatus: false,
      currentUser: {},
      roles: [],
      currentRow: {},
      allRole: [],
      currentRole: [],
      showRole: false,
      userList: [],
      columns: [
        {
          title: "id",
          key: "id",
          // width: 80,
          align: "center",
        },
        {
          title: "用户名",
          // width: 100,
          align: "center",
          render: (h, params) => {
            return h("span", params.row.username);
          },
        },
        {
          title: "头像",
          width: 100,
          align: "center",
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
          title: "介绍",
          width: 150,
          // key: "title",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                attrs: {
                  style:
                    "overflow:hidden;text-overflow:ellipsis;white-space: nowrap;",
                },
              },
              params.row.title
            );
          },
        },
        {
          title: "角色",
          width: 220,
          align: "center",
          render: (h, params) => {
            // this.flatTree(params.row)
            let data = params.row.roles;
            let role = [];
            if (data.length) {
              this.flatRole.forEach((item) => {
                data.forEach((item1) => {
                  if (item.id == item1.id) {
                    role.push(item);
                  }
                });
              });
              let temp = [];
              role.forEach((item) => {
                temp.push(h("Tag", [item.parent + "-" + item.role_name]));
              });
              role = temp;
            } else {
              role = "无";
            }
            return h(
              "div",
              {
                attrs: {
                  style: "display:flex;justify-content:center",
                },
              },
              role
            );
          },
        },
        {
          title: "收到赞",
          align: "center",
          render: (h, params) => {
            // if (!params.row.children) {
            return h("span", params.row.stars.length);
          },
        },
        {
          title: "状态",
          width: 100,
          align: "center",
          render: (h, params) => {
            // this.status = params.row.status == 1 ? true : false;
            // if (params.row.status == 1) {
            return h("iSwitch", {
              props: {
                value: params.row.status == 1 ? true : false,
                size: "large",
                "before-change": () => this.beforeChangeStatus(params.row),
              },
              on: {
                "on-change": () => this.changeStatus(params.row),
                // "on-change": (status) => {
                //   console.log(params.row);
                //   console.log(status);
                // },
              },
              scopedSlots: {
                open: () => {
                  return h("span", "正常");
                },
                close: () => {
                  return h("span", "禁用");
                },
              },
            });
          },
        },
        {
          align: "center",
          title: "创建时间",
          render: (h, params) => {
            return h("span", utils.formateDate(params.row.createdAt));
          },
        },
        {
          align: "center",
          title: "更新时间",
          render: (h, params) => {
            return h("span", utils.formateDate(params.row.updatedAt));
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
    ...mapState("user", ["id", "role", "auth"]),
  },
  methods: {
    onCancel() {
      this.roleInfo = {};
      this.comments = "";
      this.allAuth = [];
      this.currentAuth = [];
    },
    async onSubmit(v) {
      let temp = [];
      v.roles.forEach((item) => {
        temp.push(item.id);
      });
      await updateUserAndRole({ ...v, roles: temp }).then((res) => {
        this.$Message.success({
          content: res.message,
        });
        this.getUserList({ ...this.params, ...this.searchRes });
      });
    },
    // 动态组件处理完回调
    onOk() {
      this.comments = "";
      console.log("object");
    },

    // 修改用户
    async editRole(v) {
      console.log(v);
      this.userInfo = v;
      // await this.getTreeRoleRole(v);
      this.getTreeRole({ ...v });

      this.columnForm = {
        list: [
          {
            prop: "id",
          },
          {
            type: "Input",
            name: "用户名",
            prop: "username",
            required: true,
          },
          {
            type: "Input",
            name: "密码",
            mode: "password",
            prop: "password",
            required: true,
          },
          {
            name: "头像",
            type: "Input",
            prop: "avatar",
            placeholder: "请输入头像",
            required: true,
          },
          {
            name: "介绍",
            type: "Input",
            prop: "title",
            placeholder: "请输入介绍",
            required: true,
          },
          {
            name: "状态",
            type: "Radio",
            data: [
              { label: "正常", value: 1 },
              { label: "禁用", value: 0 },
            ],
            prop: "status",
            required: true,
          },
          {
            name: "角色",
            type: "Tree",
            prop: "roles",
            required: true,
            isArray: true,
            data: this.allRole,
            renderContent: function renderContent(h, { root, node, data }) {
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
                    h(
                      "span",
                      data.role_name + "(" + data.role_description + ")"
                    ),
                  ]),
                ]
              );
            },
          },
        ],
      };
      this.request = {
        title: "编辑角色",
        size: "centre",
      };
      this.isInit = true;
      this.comments = "hssPopupForm";
    },
    onSelect(v) {
      console.log(v);
    },
    onSearch(v) {
      this.searchRes = v;
      console.log(v);
      this.params.nowPage = 1;
      this.getUserList({ ...this.params, ...v });
    },
    changePage(v) {
      console.log(v);
      this.getUserList(v);
    },
    async getTreeRole(v) {
      // await this.getAuthList();
      console.log(v);
      // await this.getCurrentRole(v);
      // 递归将当前角色的权限在所有权限里添加checked为true
      // this.allAuth = depData;
      const deepData = JSON.parse(JSON.stringify(this.currentRole));
      // const deepData = res.data.data
      console.log(deepData);
      // return
      const all = deepData;
      const val = JSON.parse(JSON.stringify(v.roles));
      console.log(all);
      console.log(val);
      function digui(list) {
        list.forEach((item) => {
          item.checked = false;
          if (item.children && item.children.length > 0) {
            digui(item.children);
          }
        });
      }
      digui(all);

      function digui1(value, list) {
        list.forEach((item) => {
          if (item.id == value.id) {
            item.checked = true;
          }
          if (item.children && item.children.length > 0) {
            digui1(value, item.children);
          }
        });
      }
      val.forEach((item) => {
        console.log(item);
        digui1(item, all);
      });

      console.log(deepData);
      console.log(all);
      console.log(val);
      // return

      const temp = [];
      function digui2(list) {
        list.forEach((item) => {
          if (item.checked == false) {
            temp.push(item.p_id);
            // temp.push({id:item.auth_id,pid:item.auth_pid})
          }
          if (item.children && item.children.length > 0) {
            digui2(item.children);
          }
        });
      }
      digui2(all);
      const newTemp = [...new Set(temp)];
      console.log(newTemp);
      function digui3(value, list) {
        list.forEach((item) => {
          console.log(item);
          console.log(value);
          if (value == item.id) {
            item.checked = false;
          }
          console.log(item.children);
          if (item.children && item.children.length > 0) {
            digui3(value, item.children);
          }
        });
      }

      newTemp.forEach((item) => {
        digui3(item, all);
      });
      console.log(deepData);
      console.log(temp);
      this.allRole = deepData;
    },
    flatTree(tree, role_name = "") {
      return tree.reduce((res, item) => {
        let val;
        if (item.children && item.children.length) {
          val = res.concat(
            this.flatTree(item.children, role_name + "-" + item.role_name)
          );
        } else {
          res.push({
            id: item.id,
            role_name: item.role_name,
            parent: role_name.slice(1),
          });
          val = res;
        }
        return val;
      }, []);
    },
    translateTree(data) {
      let temp = [];
      data.forEach((item) => {
        if (item.p_id == 0) {
          temp.push(item);
        }
      });
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
      digui(data, temp);
      return temp;
    },
    beforeChangeStatus(user) {
      this.showEditStatus = true;
      this.currentUser = user;
      console.log(user);
      return new Promise((resolve, reject) => {
        this.$Modal.confirm({
          title: "提示",
          content:
            user.status == 1
              ? `确认要禁用${user.username}吗`
              : `确认要启用${user.username}吗`,
          onOk: () => {
            if (!this.auth.includes("UPDATE_USER")) {
              this.$Message.error({
                content: "你没有权限修改用户!",
              });
              reject();
            } else {
              resolve();
            }
          },
          onCancel: () => {
            // reject();
          },
        });
      });
    },
    changeStatus(user) {
      console.log(user);
      let temp = [];
      user.roles.forEach((item) => {
        temp.push(item.id);
      });
      updateUserAndRole({
        ...user,
        status: user.status == 1 ? 0 : 1,
        roles: temp,
      })
        .then((res) => {
          this.$Message.success({
            content: res.message,
          });
          user.status = user.status == 1 ? 0 : 1;
          this.getUserList({ ...this.params, ...this.searchRes });
        })
        .catch((err) => {
          console.log(err);
          // this.$Message.error({
          //   content: err.message,
          // });
        });
    },
    // 获取所有角色
    getRoleList() {
      getRoleList().then((res) => {
        console.log("获取所有角色");
        // this.translateTree(data);
        function handleRole(data) {
          let temp = [];
          data.forEach((item) => {
            if (item.p_id == 0) {
              temp.push(item);
            }
          });
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
          digui(data, temp);
          return temp;
        }
        let tree = handleRole(res.rows);
        console.log(tree);
        this.allRole = tree;
        this.currentRole = tree;
        let flat1 = this.flatTree(tree);
        this.flatRole = flat1;
        console.log("flat1");
        // console.log(flat1);
        // console.log(this.flatRole);
      });
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
            // h("span", data.role_name),
            h("span", data.role_name + "（" + data.role_description + "）"),
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
    getUserList(v) {
      getUserList(v).then((res) => {
        this.userList = res;
      });
    },
  },
  created() {},
  mounted() {
    // this.show()
    this.getRoleList();
    this.getUserList(this.params);
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
/* .demo-spin-icon-load {
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
} */
</style>
