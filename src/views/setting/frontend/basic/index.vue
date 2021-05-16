<template>
  <div>
    <div>
      <!-- <Spin fix v-if="loading"></Spin> -->
      <base-form
        ref="hssBaseForm"
        v-if="initData.id"
        :fromData="columnForm"
        :initData="initData"
        :init="init"
        @onSubmit="onSubmit"
      >
      </base-form>
    </div>
  </div>
</template>

<script>
import hssMd from "@/components/hssMarkdown";
import baseForm from "@/components/hssComponents/form/base-form/index";

import { getFrontend, updateFrontend } from "@/api/frontend";
import { mapState } from "vuex";
export default {
  components: { hssMd, baseForm },
  data() {
    return {
      form: {
        id: "",
        title: "",
        tags: "",
        type: "",
        content: "",
        img: "",
        createdAt: "",
        updatedAt: "",
      },
      initData: {},
      init: true,
      columnForm: {
        submitBtn: true,
        list: [
          {
            // name: "id",
            // type: "Input",
            prop: "id",
            isNumber: true,
            // placeholder: "",
            // display:'none'
          },
          {
            name: "注册",
            type: "Radio",
            data: [
              { label: "开启", value: 1 },
              { label: "关闭", value: 0 },
            ],
            prop: "frontend_register",
            // required: true,
          },

          {
            name: "登录",
            type: "Radio",
            // type: "Select",
            data: [
              { label: "开启", value: 1 },
              { label: "关闭", value: 0 },
            ],
            prop: "frontend_login",
            // isString:true,
            // required: true,
          },
          {
            name: "留言板",
            type: "Radio",
            // type: "Select",
            data: [
              { label: "开启", value: 1 },
              { label: "关闭", value: 0 },
            ],
            prop: "frontend_comment",
            // isString:true,
            // required: true,
          },

          {
            name: "关于",
            type: "Editor",
            prop: "frontend_about",
            content: "",
            placeholder: "请输入内容",
            required: true,
          },
        ],
      },
      params: {
        // frontend_register: true,
        // frontend_login: true,
        // frontend_comment: true,
      },
      // loading: false,
    };
  },
  computed: {
    ...mapState("user", ["auth"]),
  },
  methods: {
    getFrontend() {
      getFrontend().then((res) => {
        console.log(res);
        this.initData = res.detail;
        // this.params = res.detail;
      });
    },
    beforeChange() {
      return new Promise((resolve, reject) => {
        this.$Modal.confirm({
          title: "提示",
          content: "确认修改吗?",
          onOk: () => {
            if (!this.auth.includes("UPDATE_FRONTEND")) {
              this.$Message.error({
                content: "你没有权限修改前台!",
              });
              reject();
            } else {
              resolve();
            }
          },
          onCancel: () => {
            reject();
          },
        });
      });
    },
    change(status, params) {
      this.loading = true;
      let temp = {
        id: 1,
      };
      switch (params) {
        case "frontend_register":
          temp.frontend_register = status ? 1 : 0;
          break;
        case "frontend_login":
          temp.frontend_login = status ? 1 : 0;
          break;
        case "frontend_comment":
          temp.frontend_comment = status ? 1 : 0;
          break;
      }

      updateFrontend(temp).then((res) => {
        this.$Message.success(res.message);
        this.getFrontend();
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    onSubmit() {
      this.$refs.hssBaseForm.submit((v) => {
        if (v) {
          console.log(v);
          updateFrontend(v).then((res) => {
            this.$Message.success(res.message);
            this.getFrontend();
          });
          // updateArticle(v)
          //   .then((res) => {
          //     console.log(res);
          //     this.$Message.success({
          //       content: res.message,
          //     });
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        } else {
        }
      });
    },
  },
  created() {
    this.getFrontend();
  },
  mounted() {},
};
</script>

<style scoped></style>
