<template>
  <div>
    <Tree :data="treeData1" :render="renderContent"></Tree>
    <Modal v-model="showRole" title="编辑角色" @on-ok="ok" @on-cancel="cancel">
      <div>
        {{ currentRow && currentRow.username }}
      </div>
      <div class="aaa">
        <div v-if="allAuth.length == 0" style="position: relative">
          <Spin size="large">
            <Icon type="ios-loading" class="demo-spin-icon-load"></Icon>
            <div>加载中...</div>
          </Spin>
        </div>
        <Tree
          v-else
          :data="allAuth"
          :render="renderContent1"
          show-checkbox
          @on-check-change="getChecked"
        ></Tree>
      </div>
    </Modal>

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
  </div>
</template>

<script>
import hssPopupForm from "../../../../../components/hssComponents/form/popup-form/index";
import { getAuthList } from "../../../../../api/auth";
import { getAuth, getUserRoleAuth, addAuthForRole } from "../../../../../api/roleauth";
// import {
//   addRole,
//   getRoleList,
//   editRoleAuth,
//   deleteRole,
//   findParentRole,
//   findBrotherRole,
// } from "../../../../../api/role";
import {
  editRoleAuth,
  getRoleList,
  findParentRole,
  findBrotherRole,
  addRole,
  deleteRole,
} from "../../../../../api/role";
export default {
  components: { hssPopupForm },
  props: {
    treeData1: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      action: "",
      parentRole: [],
      brotherRole: [],
      allAuth: [],
      isInit: false,
      comments: "", //动态模块
      request: {},
      columnForm: {},
      roleInfo: {
        id: "",
        role_name: "",
        role_description: "",
        p_id: "",
      },

      currentAuth: [],
      auths: [],
      roleList: [],
      showRole: false,
      currentRow: {},
      // allAuth: [],
      newRoleName: "",
      newRoleDescription: "",
    };
  },
  created() {
    console.log(this.columns1);
    console.log(this.data1);
    this.getRoleList();
  },
  mounted() {},
  computed: {},
  methods: {
    // 动态组件处理完回调
    onOk() {
      this.comments = "";
      console.log("object");
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
      if (this.action == "edit") {
        await editRoleAuth({ ...v, auths: temp }).then((res) => {
          console.log(res);
          this.$Message.success({
            content: res.message,
          });
          this.getRoleList();
        });
      } else {
        await addRole({ ...v, auths: temp }).then((res) => {
          console.log(res);
          this.$Message.success({
            content: res.message,
          });
          this.getRoleList();
        });
      }
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
    ok() {
      // this.showRole = false
      this.allAuth = [];
      this.currentAuth = [];
      console.log("sss");
      addAuthForRole({
        id: this.currentRow.id,
        authList: this.auths,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancel() {
      // this.showRole = false
      this.allAuth = [];
      this.currentAuth = [];
    },
    getChecked(v) {
      function getAllAuthId(data) {
        let temp = [];
        function digui(data) {
          data.forEach((item) => {
            temp.push(item.id);
            if (item.children) {
              digui(item.children);
            }
          });
        }
        digui(data);
        return [...new Set(temp)];
      }
      this.auths = getAllAuthId(v);
    },
    renderContent1(h, { root, node, data }) {
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
            h("span", data.id + "" + data.auth_name + "(" + data.auth_description + ")"),
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
            // h("Icon", {
            //   props: {
            //     type: "md-key",
            //   },
            //   style: {
            //     marginRight: "8px",
            //   },
            // }),
            h("span", data.id + "" + data.role_name + "(" + data.role_description + ")"),
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px",
              },
            },
            [
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                  },
                  // props: Object.assign({}, this.buttonProps, {
                  //   icon: "ios-add",
                  // }),
                  style: {
                    marginRight: "8px",
                  },
                  on: {
                    click: () => {
                      // this.show(data);
                      // console.log(data)
                      this.editRole(data);
                    },
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  // props: Object.assign({}, this.buttonProps, {
                  //   icon: "ios-add",
                  // }),
                  props: {
                    type: "info",
                    size: "small",
                  },
                  style: {
                    marginRight: "8px",
                  },
                  on: {
                    click: () => {
                      console.log(data);
                      this.addParentRole(data);
                    },
                  },
                },
                "新增"
              ),
              h(
                "Button",
                {
                  // props: Object.assign({}, this.buttonProps, {
                  //   icon: "ios-remove",
                  // }),
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.deleteRole(data);
                    },
                  },
                },
                "删除"
              ),
            ]
          ),
        ]
      );
    },
    // 新增角色
    async addParentRole(v) {
      this.action = "add";
      await this.getAuthList();
      await this.findBrotherRole(v.id);
      this.roleInfo.p_id = v.id;
      this.isInit = true;
      let newTemp = [];
      this.brotherRole.forEach((item) => {
        let temp = {};
        temp.label = item.role_name;
        temp.value = item.id;
        newTemp.push(temp);
      });
      this.columnForm = {
        list: [
          {
            name: "父级",
            prop: "p_id",
            type: "Select",
            data: this.brotherRole,
            // render: (h, params) => {
            //   return h("span", "无");
            // },
            required: true,
            disabled: true,
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
      console.log(newTemp);
      // this.columnForm.list[2].data = newTemp;
      // this.columnForm.list[3].data = this.allAuth;
      this.request = {
        title: "新增角色",
        size: "centre",
      };

      this.comments = "hssPopupForm";
    },
    // 获取某角色的父级
    async findParentRole(id) {
      let res = await findParentRole(id);
      // res.list.rows.unshift({
      //   id: 0,
      //   role_name: "无",
      //   role_description: "无",
      //   p_id: 0,
      // });
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
      this.action = "edit";
      console.log(v);
      this.roleInfo = v;

      await this.getTreeAuth(v);
      await this.findParentRole(v.id);
      this.roleInfo.auths = this.currentAuth;
      this.columnForm = {
        list: [
          {
            prop: "id",
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
    // 获取所有权限，且整理成树型
    async getAuthList() {
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
      function digui(allAuth, currentAuth) {
        let val = [];
        currentAuth.forEach((item) => {
          val.push(item.auth_id);
        });
        allAuth.forEach((item1, index1) => {
          if (val.includes(item1.id)) {
            item1.checked = true;
          }
          if (item1.children) {
            digui(item1.children, currentAuth);
          }
        });
      }
      let depData = JSON.parse(JSON.stringify(this.allAuth));
      digui(depData, this.currentAuth);
      this.allAuth = depData;
    },

    async show(v) {
      this.showRole = true;
      this.currentRow = v;
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
      await getUserRoleAuth(v.id).then((res) => {
        console.log("获取当前角色的权限");
        console.log(res);
        if (res.count > 0) {
          res.rows.forEach((item) => {
            this.currentAuth.push(item.auth_id);
          });
        }
      });
      function digui(data, val) {
        data.forEach((item1, index1) => {
          if (val) {
            if (val.includes(item1.id)) {
              item1.checked = true;
            }
          }

          if (item1.children) {
            digui(item1.children, val);
          }
        });
        // });
      }
      let depData = JSON.parse(JSON.stringify(this.allAuth));
      digui(depData, this.currentAuth);
      this.allAuth = depData;
      console.log(this.allAuth);
    },
    deleteRole(v) {
      deleteRole(v.id)
        .then((res) => {
          this.$Message.success({
            content: res.message,
          });
          this.$emit("refresh");
        })
        .catch((err) => {
          console.log(err);
          this.$Message.error({
            content: err.message,
          });
          this.$emit("refresh");
        });
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
};
</script>

<style scoped></style>
