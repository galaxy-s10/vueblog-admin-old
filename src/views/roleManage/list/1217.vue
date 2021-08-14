<template>
  <div>
    <i-button @click="addParentRole">新增角色</i-button>
    <Table
      border
      :loading="roleList.length == 0"
      :columns="columns"
      :data="roleList"
    ></Table>
    <component
      v-bind:is="comments"
      :request="request"
      :fromData="columnForm"
      :initData="roleInfo"
      :isInit="isInit"
      @on-cancel="onCancel"
      @on-ok="onOk"
      @onSubmit="onSubmit"
    ></component>
    <!-- <i-button @click="addRole">添加角色</i-button> -->
  </div>
</template>

<script>
import hssPopupForm from "../../../components/hssComponents/form/popup-form/index";
import hssForm from "./component/form";
import hssPopup from "./component/popup";
import hssPopupa from "./component/hss-popup";
import hssTable from "./component/table";
import hssTree from "./component/tree";
import { getAuthList } from "../../../api/auth";
import {
  addRole,
  getRoleList,
  editRoleAuth,
  deleteRole,
  findParentRole,
} from "../../../api/role";
import { getAuth, getOneRoleAuth, addAuthForRole } from "../../../api/roleauth";
export default {
  components: { hssPopup, hssForm, hssPopupa, hssPopupForm },
  data() {
    return {
      isInit: false,
      comments: "", //动态模块
      request: {},
      columnForm: {},
      action: "edit",
      parentRole: [],
      roleInfo: {
        id: 1,
        role_name: "2",
        role_description: "3",
        p_id: 0,
      },
      hssShow: false,
      hssTitle: "新增角色",
      // roleInfo: {},
      allAuth: [],
      auths: [],
      currentAuth: [],
      showRole: false,
      roleList: [],
      columns: [
        {
          type: "expand",
          width: 50,
          align: "center",
          render: (h, params) => {
            console.log("params.row.children");
            console.log(params.row.children);
            if (params.row.children) {
              // return h("span", params.row.children[1].role_name);
              return h(hssTree, {
                props: {
                  treeData1: params.row.children,
                },
                on: {
                  refresh: () => {
                    this.getRoleList();
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
          title: "角色名",
          width: "150",
          align: "center",
          render: (h, params) => {
            // if (!params.row.children) {
            return h("span", params.row.role_name);
          },
        },
        {
          title: "角色描述",
          align: "center",
          width: "150",
          render: (h, params) => {
            console.log(params);
            return h("span", params.row.role_description);
          },
        },

        {
          title: "创建时间",
          width: "150",
          align: "center",
          render: (h, params) => {
            return h("span", this.formateDate(params.row.createdAt));
          },
        },
        {
          title: "更新时间",
          width: "150",
          align: "center",
          render: (h, params) => {
            return h("span", this.formateDate(params.row.updatedAt));
          },
        },
        {
          title: "操作",
          align: "center",
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
                      // this.action = "edit";
                      // let newParams = { ...params.row };
                      // delete newParams.children;
                      // console.log(newParams);
                      // this.show(newParams);
                      this.editRole({ ...params.row });
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
                      // this.deleteRole(params.row);
                      // this.action = "add";
                      let newParams = { ...params.row };
                      delete newParams.children;
                      this.hssShow = true;
                      this.hssTitle = "新增权限";
                      // console.log(newParams);
                      // this.show(newParams);
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
                      this.deleteRole({ ...params.row });
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
    // async addRole() {
    //   await this.getAuthList();
    //   // this.columnForm.list = {};
    //   this.columnForm.list[4].data = this.allAuth;
    //   this.request = {
    //     title: "新增角色",
    //     size: "centre",
    //   };
    //   this.comments = "hssPopupForm";
    // },

    // 动态组件处理完回调
    onOk() {
      this.comments = "";
      console.log("object");
    },
    // 获取某角色的父级
    async findParentRole(id) {
      let res = await findParentRole(id);
      res.list.rows.unshift({
        id: 0,
        role_name: "无",
        role_description: "无",
        p_id: 0,
      });
      this.parentRole = res.list.rows;
      let newTemp = [];
      res.list.rows.forEach((item) => {
        let temp = {};
        temp.label = item.role_name;
        temp.value = item.id;
        newTemp.push(temp);
      });
      this.parentRole = newTemp;
    },
    // 修改某角色
    async editRole(v) {
      console.log(v);
      this.roleInfo = v;

      await this.getTreeAuth(v);
      await this.findParentRole(v.id);
      this.roleInfo.auths = this.currentAuth;
      this.columnForm = {
        list: [
          {
            type: "Select",
            name: "父级",
            prop: "p_id",
            data: this.parentRole,
            required: true,
          },
          {
            name: "角色名",
            type: "Input",
            prop: "role_name",
            placeholder: "请输入角色名",
            required: true,
          },
          {
            name: "角色描述",
            type: "Input",
            prop: "role_description",
            placeholder: "请输入角色描述",
            required: true,
          },
          {
            name: "权限",
            type: "Tree",
            prop: "auths",
            required: true,
            isArray: true,
            data: this.allAuth,
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
                    h("span", data.auth_name + "(" + data.auth_description + ")"),
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
    // 新增角色
    async addParentRole() {
      await this.getAuthList();
      this.columnForm = {
        list: [
          {
            name: "父级",
            prop: "p_id",
            render: (h, params) => {
              return h("span", "无");
            },
            // required:true
          },
          {
            type: "Input",
            name: "角色名",
            prop: "role_name",
            placeholder: "请输入角色名",
            required: true,
          },
          {
            name: "角色描述",
            type: "Input",
            prop: "role_description",
            placeholder: "请输入角色描述",
            required: true,
          },

          {
            name: "权限",
            type: "Tree",
            prop: "auths",
            required: true,
            isArray: true,
            data: [],
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
                    h("span", data.auth_name + "(" + data.auth_description + ")"),
                  ]),
                ]
              );
            },
          },
        ],
      };
      let newTemp = [];
      this.parentRole.forEach((item) => {
        let temp = {};
        temp.label = item.role_name;
        temp.value = item.id;
        newTemp.push(temp);
      });
      this.columnForm.list[2].data = newTemp;
      this.columnForm.list[3].data = this.allAuth;
      this.request = {
        title: "新增角色",
        size: "centre",
      };
      this.comments = "hssPopupForm";
      // this.roleInfo = {
      //   id: "",
      //   role_name: "",
      //   role_description: "",
      //   p_id: 0,
      //   p: "无",
      // };
      // this.action = "add";
      // this.showRole = true;
      // await this.getAuthList();
    },

    deleteRole(v) {
      console.log(v);
      deleteRole(v.id)
        .then((res) => {
          console.log(res);
          this.$Message.success({
            content: res.message,
          });
          this.getRoleList();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getAuthList() {
      await getAuthList().then((res) => {
        console.log("获取所有权限");
        function handleAuth(data) {
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
        this.allAuth = handleAuth(res.rows);
      });
    },
    async getTreeAuth(v) {
      await getAuthList().then((res) => {
        console.log("获取所有权限");
        console.log(res);
        function handleAuth(data) {
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
        this.allAuth = handleAuth(res.rows);
      });

      await getOneRoleAuth(v.id).then((res) => {
        console.log("获取当前角色的权限");
        console.log(res);
        if (res.count > 0) {
          res.rows.forEach((item) => {
            this.currentAuth.push(item);
            // this.currentAuth.push(item.auth_id);
          });
        }
      });
      function digui(data, vall) {
        let val = [];
        vall.forEach((item) => {
          val.push(item.auth_id);
        });
        data.forEach((item1, index1) => {
          if (val.includes(item1.id)) {
            item1.checked = true;
          }
          if (item1.children) {
            digui(item1.children, vall);
          }
        });
      }
      // 递归将当前角色的权限在所有权限里添加checked为true
      let depData = JSON.parse(JSON.stringify(this.allAuth));
      digui(depData, this.currentAuth);
      this.allAuth = depData;
    },
    
    ok() {
      // this.showRole = false
      console.log("ok");
      this.allAuth = [];
      this.currentAuth = [];
      editRoleAuth({
        ...this.roleInfo,
        auths: this.auths,
      })
        .then((res) => {
          this.$Message.success({
            content: res.message,
          });
          this.getRoleList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onCancel() {
      // this.showRole = false
      this.comments = "";
      this.allAuth = [];
      this.currentAuth = [];
    },
    onSubmit(v) {
      console.log(v);
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
        [h("span", [h("span", data.auth_name + "-" + data.auth_description)])]
      );
    },
    getRoleList() {
      getRoleList().then((res) => {
        let { rows } = res;
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
                // if (children.length > 0) {
                //   digui(dataItem[1]);
                // }
              });
              console.log(tempItem);
              if (children.length > 0) {
                tempItem.children = children;
                digui(data, children);
              }
            });
          }
          digui(data, temp);
          return temp;
        }
        let temp = handleRole(rows);
        temp.forEach((item) => {
          console.log(temp);
          if (!item.children) {
            item._disableExpand = true;
          }
        });
        console.log(temp);
        this.roleList = temp;
      });
    },
  },
  created() {
    this.getRoleList();
    // this.getAuthList();
  },
  mounted() {},
};
</script>

<style scoped></style>
