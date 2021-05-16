<template>
  <div>
    <i-button @click="addNewRole()">新增角色</i-button>
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
  findBrotherRole,
} from "../../../api/role";
import { getAuth, getUserRoleAuth, addAuthForRole } from "../../../api/roleauth";
export default {
  components: { hssPopup, hssForm, hssPopupa, hssPopupForm },
  data() {
    return {
      brotherRole: [],
      myAuths: "",
      isInit: false,
      comments: "", //动态模块
      request: {},
      columnForm: {},
      action: "edit",
      parentRole: [],
      roleInfo: {
        id: "",
        role_name: "",
        role_description: "",
        p_id: "",
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
                      console.log("click");
                      this.action = "edit";
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
                      // let newParams = { ...params.row };
                      // delete newParams.children;
                      // this.hssShow = true;
                      // this.hssTitle = "新增权限";
                      // console.log(newParams);
                      // this.show(newParams);
                      this.action = "add";
                      this.addNewRole({ ...params.row });
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
    // 查询某个角色的平行父级
    async findBrotherRole(id) {
      let res = await findBrotherRole(id);
      // res.list.rows.unshift({
      //   id: 0,
      //   role_name: "无",
      //   role_description: "无",
      //   p_id: 0,
      // });
      this.brotherRole = res.list.rows;
      let newTemp = [];
      res.list.rows.forEach((item) => {
        let temp = {};
        temp.label = item.role_name;
        temp.value = item.id;
        newTemp.push(temp);
      });
      this.brotherRole = newTemp;
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
            // name: "id",
            // type: "Input",
            prop: "id",
            // placeholder: "",
            // display:'none'
          },
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
            // required: true,
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
    async addNewRole(v) {
      this.action = "add";
      await this.getAuthList();
      this.columnForm = {
        list: [
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
      let temp;
      if (v) {
        await this.findBrotherRole(v.id);
        this.roleInfo.p_id = v.id;
        this.isInit = true;
        temp = {
          type: "Select",
          name: "父级",
          prop: "p_id",
          data: this.brotherRole,
          required: true,
          // disabled: true,
        };
      } else {
        temp = {
          // type: "Select",
          name: "父级",
          prop: "p_id",
          render: (h, params) => {
            return h("span", "无");
          },
        };
        this.roleInfo.p_id = 0;
        this.isInit = true;
      }
      this.columnForm.list.unshift(temp);
      this.request = {
        title: "新增角色",
        size: "centre",
      };

      this.comments = "hssPopupForm";
    },

    deleteRole(v) {
      console.log(v);
      this.$Modal.confirm({
        title: "提示",
        content: `删除${v.role_name}角色后，所有拥有此角色的用户也会失去该角色，确定删除吗?`,
        onOk: () => {
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
        onCancel: () => {
          this.$Message.info({
            content: "你取消了删除操作",
          });
        },
      });
    },
    // 获取所有权限，且整理成树型
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
    // 获取当前角色的权限
    async getUserRoleAuth(id) {
      await getUserRoleAuth(id).then((res) => {
        console.log("获取当前角色的权限");
        this.myAuths = res.rows;
        console.log(res);
        if (res.count > 0) {
          res.rows.forEach((item) => {
            this.currentAuth.push(item);
            // this.currentAuth.push(item.auth_id);
          });
        }
      });
    },
    async getTreeAuth(v) {
      await this.getAuthList();
      await this.getUserRoleAuth(v.id);
      // 递归将当前角色的权限在所有权限里添加checked为true
      // this.allAuth = depData;
      const deepData = JSON.parse(JSON.stringify(this.allAuth));
      // const deepData = res.data.data
      // console.log(deepData)
      // return
      const all = deepData;
      const val = this.currentAuth;
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
          if (item.id == value.auth_id) {
            item.checked = true;
          }
          if (item.children && item.children.length > 0) {
            digui1(value, item.children);
          }
        });
      }
      val.forEach((item) => {
        // console.log(item);
        digui1(item, all);
      });

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
      this.allAuth = deepData;
    },

    onCancel() {
      // this.showRole = false
      console.log("onCancel");
      this.roleInfo = {};
      this.comments = "";
      this.allAuth = [];
      this.currentAuth = [];
    },
    async onSubmit(v) {
      console.log(v);
      let temp = [];
      v.auths.forEach((item) => {
        temp.push(item.id);
      });
      console.log({ ...v, auths: temp });
      if (this.action == "edit") {
        try {
          await editRoleAuth({ ...v, auths: temp }).then((res) => {
            console.log(res);
            this.$Message.success({
              content: res.message,
            });
            this.getRoleList();
          });
        } catch (err) {
          // this.$Message.error({
          //   content: err.message,
          // });
        }
      } else {
        addRole({ ...v, auths: temp }).then((res) => {
          this.$Message.success({
            content: res.message,
          });
          this.getRoleList();
        });
      }
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
