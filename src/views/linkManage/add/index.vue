<template>
  <div>
    <base-form ref="hssBaseForm" :fromData="columnForm" :init="init" @onSubmit="onSubmit">
    </base-form>
    <!-- <i-button @click="confirm">修改</i-button> -->
    <!-- <markdown ref="md" v-if="this.form.content != null" /> -->
  </div>
</template>

<script>
// import markdown from "../../../components/markdown/index";
import hssUpload from "../../../components/upload/index";
import baseForm from "../../../components/hssComponents/form/base-form/index";
import { addLink } from "@/api/link";
// import { editarticle } from '../../../../../vueblog-client/src/api/article';
export default {
  components: { baseForm, hssUpload },
  data() {
    return {
      tagList: [],
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
      // columnForm: {},
      columnForm: {
        submitBtn: true,
        list: [
          {
            // name: "id",
            // type: "Input",
            prop: "id",
            // placeholder: "",
            // display:'none'
          },
          {
            type: "Input",
            name: "名称",
            prop: "name",
            placeholder: "请输入友链名称",
            required: true,
          },
          {
            name: "头像",
            type: "Input",
            prop: "avatar",
            placeholder: "请输入友链头像",
            required: true,
          },
          {
            name: "描述",
            type: "Input",
            prop: "description",
            placeholder: "请输入友链描述",
            required: true,
          },
          {
            name: "链接",
            type: "Input",
            prop: "url",
            placeholder: "请输入友链链接",
            required: true,
          },
          // {
          //   name: "创建时间",
          //   type: "Date",
          //   prop: "createdAt",
          //   isDate: true,
          //   placeholder: "请选择创建时间",
          //   required: true,
          // },
        ],
      },
      initData: {},
      init: false,
      // init: true,
      headerImg: [],
      oldImgList: [],
      newimg: null,
    };
  },
  computed: {},
  methods: {
    onSubmit() {
      this.$refs.hssBaseForm.submit((v) => {
        if (v) {
          console.log(v);
          addLink(v)
            .then((res) => {
              console.log(res);
              this.$Message.success({
                content: res.message,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
        }
      });
    },
    confirm() {},
  },
  created() {},
  mounted() {},
};
</script>

<style scoped></style>
