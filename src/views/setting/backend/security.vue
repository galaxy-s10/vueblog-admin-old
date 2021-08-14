<template>
  <div>
    <base-form
      ref="hssBaseForm"
      :fromData="columnForm"
      :initData="initData"
      :init="init"
      @onSubmit="onSubmit"
    >
    </base-form>
  </div>
</template>

<script>
import { findOne } from "@/api/user";
import { mapState } from "vuex";
import baseForm from "@/components/hssComponents/form/base-form/index";

export default {
  components: { baseForm },
  data() {
    return {
      detail: {},
      init: false,
      initData: {},
      columnForm: {
        submitBtn: true,
        list: [
          {
            type: "Input",
            name: "原密码",
            // mode: "password",
            prop: "password",
            placeholder: "请输入原密码",
            // required: true,
            rules: {
              min: 6,
              max: 10,
              message: `请输入6-10位数字`,
              trigger: "change",
              pattern: /^[a-z0-9]+$/,
              required: true,
            },
          },
          {
            type: "Input",
            // mode: "password",
            name: "新密码",
            prop: "password1",
            placeholder: "请输入新密码",
            required: true,
          },
          {
            type: "Input",
            // mode: "password",
            name: "确认新密码",
            prop: "password2",
            placeholder: "请再次输入新密码",
            required: true,
          },
        ],
      },
    };
  },
  computed: {
    ...mapState("user", ["id", "role", "auth"]),
  },
  methods: {
    onSubmit() {
      this.$refs.hssBaseForm.submit(async (v) => {
        if (v) {
          console.log(v);
        } else {
        }
      });
    },
  },
  created() {},
  mounted() {
    // findOne(this.id).then((res) => {
    //   console.log(res);
    //   this.detail = res.detail;
    // });
  },
};
</script>

<style scoped></style>
