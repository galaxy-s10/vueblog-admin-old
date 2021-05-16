<template>
  <div>
    <Tree :data="treeData1" :render="renderContent"></Tree>
    <hss-popup :show="hssShow" :title="hssTitle" @okk="popOk" @cancell="popCancel">
      <Form :model="authInfo" :label-width="80">
        <FormItem label="id">
          <Input v-model="authInfo.id" :placeholder="authInfo.id + ''" disabled></Input>
        </FormItem>
        <FormItem label="父级">
          <Select v-if="action == 'edit'" v-model="authInfo.p_id" style="width: 200px">
            <Option v-for="item in parentAuth" :value="item.id" :key="item.id">{{
              item.auth_name + "-" + item.auth_description
            }}</Option>
          </Select>
          <span v-else-if="action == 'add'">{{ authInfo.p }}</span>
        </FormItem>
        <FormItem label="权限名">
          <Input v-model="authInfo.auth_name" placeholder="请输入权限名"></Input>
        </FormItem>
        <FormItem label="权限描述">
          <Input v-model="authInfo.auth_description" placeholder="请输入权限描述"></Input>
        </FormItem>
      </Form>
    </hss-popup>
  </div>
</template>

<script>
import hssPopup from "../popup";
import { getAuthList, addAuth, editAuth, findParentAuth } from "../../../../../api/auth";
import { getAuth, getOneRoleAuth, addAuthForRole } from "../../../../../api/roleauth";
export default {
  components: { hssPopup },
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
      action: "", //编辑/新增
      hssShow: false,
      hssTitle: "hssTitle",
      parentAuth: [],
      authInfo: {
        input: "",
        auth_name: "",
        auth_description: "",
        p_id: "",
      },
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    popOk() {
      if (this.action == "edit") {
        this.$emit("editAuth", this.authInfo);
      } else if (this.action == "add") {
        this.$emit("addAuth", this.authInfo);
      }
      this.hssShow = false;
    },
    popCancel() {
      this.hssShow = false;
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
            h(
              "span",
              "id:" + data.id + "-" + data.auth_name + "-" + data.auth_description
            ),
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
                      let { id, auth_name, auth_description, p_id } = data;
                      findParentAuth(id).then((res) => {
                        this.parentAuth = res.list.rows;
                        this.authInfo = {
                          id,
                          auth_name,
                          auth_description,
                          p_id: p_id ? p_id : id,
                        };
                        this.action = "edit";
                        this.hssTitle = "编辑权限";
                        this.hssShow = true;
                      });
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
                      let { id, auth_name, auth_description, p_id } = data;
                      this.authInfo = {
                        id,
                        auth_name: "",
                        auth_description: "",
                        p_id: id,
                      };
                      // this.authInfo.p =
                      //   data.auth_name + "-" + data.auth_description;
                      this.$set(
                        this.authInfo,
                        "p",
                        data.auth_name + "-" + data.auth_description
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
                  // props: Object.assign({}, this.buttonProps, {
                  //   icon: "ios-remove",
                  // }),
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.$emit("delAuth", data);
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
  },
};
</script>

<style scoped></style>
