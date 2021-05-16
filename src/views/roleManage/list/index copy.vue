<template>
  <div>
    <!-- <Tree :data="roleList" :render="renderContent" show-checkbox></Tree> -->
    <Table
      border
      :loading="roleList.length == 0"
      :columns="columns"
      :data="roleList"
    ></Table>
    <Modal v-model="showRole" title="编辑角色" @on-ok="ok" @on-cancel="cancel">
      <div>
        {{ showRole && currentRow && currentRow.username }}
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
          :render="renderContent"
          show-checkbox
          @on-check-change="getChecked"
        ></Tree>
      </div>
    </Modal>
  </div>
</template>

<script>
import hssTable from "./component/table";
import { getAuthList } from "../../../api/auth";
import { getRoleList, editRoleAuth } from "../../../api/role";
import { getAuth, getOneRoleAuth } from "../../../api/roleauth";
export default {
  components: {},
  data() {
    return {
      currentRow: {},
      allAuth: [],
      auths: [],
      currentAuth: [],
      showRole: false,
      roleList: [],
      columns1: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            console.log("params.row.children");
            console.log(params.row.children);
            if (params.row.children) {
              // return h("span", params.row.children[1].role_name);
              return h(hssTable, {
                props: {
                  columns1: this.columns1,
                  data1: params.row.children,
                },
              });
            }
          },
        },
        {
          title: "id",
          key: "id",
          width: "60",
        },
        {
          title: "角色名",
          width: "150",
          render: (h, params) => {
            console.log(params);
            // if (!params.row.children) {
            return h("span", params.row.role_name);
          },
        },
        {
          title: "创建时间",
          render: (h, params) => {
            return h("span", this.formateDate(params.row.createdAt));
          },
        },
        {
          title: "更新时间",
          render: (h, params) => {
            return h("span", this.formateDate(params.row.updatedAt));
          },
        },
        {
          title: "操作",
          width: "130",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.show(params.row);
                    },
                  },
                },
                "编辑"
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
                      this.remove(params.row);
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      columns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            console.log("params.row.children");
            console.log(params.row.children);
            if (params.row.children) {
              // return h("span", params.row.children[1].role_name);
              return h(hssTable, {
                props: {
                  columns1: this.columns1,
                  data1: params.row.children,
                },
              });
            }
          },
        },
        {
          title: "id",
          key: "id",
          width: "60",
        },
        {
          title: "角色名",
          width: "150",
          render: (h, params) => {
            console.log(params);
            // if (!params.row.children) {
            return h("span", params.row.role_name);
          },
        },
        {
          title: "创建时间",
          render: (h, params) => {
            return h("span", this.formateDate(params.row.createdAt));
          },
        },
        {
          title: "更新时间",
          render: (h, params) => {
            return h("span", this.formateDate(params.row.updatedAt));
          },
        },
        {
          title: "操作",
          width: "130",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.show(params.row);
                    },
                  },
                },
                "编辑"
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
                      this.remove(params.row);
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
    getChecked(v) {
      console.log(v);
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
      console.log(this.auths);
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
      await getOneRoleAuth(v.id).then((res) => {
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
          if (val.includes(item1.id)) {
            item1.checked = true;
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
    ok() {
      // this.showRole = false
      console.log("ok");
      this.allAuth = [];
      this.currentAuth = [];
      editRoleAuth({
        id: this.currentRow.id,
        auths: this.auths,
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
      console.log("quxiao");
      this.allAuth = [];
      this.currentAuth = [];
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
          h("span", [h("span", data.auth_name + "-" + data.auth_description)]),
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
  },
  created() {
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
  mounted() {},
};
</script>

<style scoped>
</style>
