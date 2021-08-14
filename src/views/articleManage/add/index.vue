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
    <component
      v-bind:is="comments"
      :isShow="circleData.isShow"
      :percent="circleData.percent"
      :title="circleData.title"
      :desc="circleData.desc"
      :content="circleData.content"
    ></component>
  </div>
</template>

<script>
// import markdown from "../../../components/markdown/index";
import hssUpload from "../../../components/upload/index";
import baseForm from "../../../components/hssComponents/form/base-form/index";
import hssCircle from "../../../components/hssCircle";

import { findArticle, editArticle, addArticle } from "@/api/article";
import { getTagList, updateTag, deleteTag, addTag } from "@/api/tag";
import { getTypeList } from "../../../api/type";
import { getQiniuToken, deleteQiniu } from "../../../api/qiniu";
import * as qiniu from "qiniu-js";
import { mapState } from "vuex";

// import { editarticle } from '../../../../../vueblog-client/src/api/article';
export default {
  components: { baseForm, hssUpload, hssCircle },
  data() {
    return {
      comments: "",
      circleData: {
        isShow: false,
        percent: 0,
        title: "",
        desc: "",
        content: "",
      },
      tagList: [],
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
            name: "标题",
            type: "Input",
            prop: "title",
            placeholder: "请输入标题",
            required: true,
          },
          {
            name: "类型",
            type: "Select",
            prop: "type_id",
            placeholder: "请选择文章类型",
            required: true,
            data: [],
          },
          {
            name: "浏览量",
            type: "Input",
            prop: "click",
            placeholder: "请输入浏览量",
            isNumber: true,
            // required: true,
          },
          {
            name: "标签",
            type: "Check",
            data: [],
            prop: "tags",
            isArray: true,
            // required: true,
          },
          {
            name: "发布状态",
            type: "Radio",
            data: [
              { label: "已发布", value: 1 },
              { label: "待审核", value: 0 },
            ],
            prop: "status",
            // required: true,
          },

          {
            name: "评论状态",
            type: "Radio",
            // type: "Select",
            data: [
              { label: "开启", value: 1 },
              { label: "关闭", value: 0 },
            ],
            prop: "is_comment",
            // isString:true,
            // required: true,
          },
          {
            name: "内容",
            type: "Editor",
            prop: "content",
            content: "",
            placeholder: "请输入内容",
            required: true,
          },
          {
            name: "封面图",
            type: "Upload",
            prop: "img",
            placeholder: "请上传封面图",
            uploaOption: {
              fileNameLength: 15, //文件名长度
              multiple: false, //是否多选
              type: "select", //select（点击选择），drag（支持拖拽）
              format: ["jpg", "jpeg", "png"],
              maxSize: 1024 * 2, //单位kb
            },
            // required: true,
          },
          // {
          //   name: "发布时间",
          //   type: "Date",
          //   mode: "datetime",
          //   prop: "createdAt",
          //   placeholder: "请选择发布时间",
          //   isDate: true,
          //   // required: true,
          // },
        ],
      },
      initData: {
        status: 1,
        is_comment: 1,
        tags: [],
      },
      // init: false,
      init: true,
      headerImg: [],
      oldImgList: [],
      newimg: null,
      articleTypeList: [],
    };
  },
  computed: {
    ...mapState({
      user_id: (state) => state.user.id,
    }),
  },
  methods: {
    async getArticleTypeList(v) {
      let typeList = [];
      let res = await getTypeList(v);
      res.rows.forEach((item) => {
        let temp = {};
        temp.label = item.name;
        temp.value = item.id;
        typeList.push(temp);
      });
      this.columnForm.list[2].data = typeList;
    },
    // 上传七牛云图片
    async qiniuUpload(file) {
      const datetime = new Date();
      const key = datetime.getTime() + file.name;
      const { uploadToken } = await getQiniuToken();
      const uptoken = uploadToken;
      const putExtra = {
        customVars: { "x:user_id": `${this.user_id}` },
      };
      const config = { useCdnDomain: true };
      const observable = qiniu.upload(file, key, uptoken, putExtra, config);
      const that = this;
      return new Promise(function (resolve, reject) {
        const subscription = observable.subscribe({
          // next: 接收上传进度信息的回调函数
          next(res) {
            const percent = res.total.percent; // 当前上传进度
            that.circleData.percent = parseInt(percent.toFixed());
          },
          // error: 上传错误后触发
          error(err) {
            console.log("上传七牛云图片错误");
            reject(err);
          },
          // complete: 接收上传完成后的后端返回信息
          complete(ress) {
            resolve(ress);
          },
        });
      });
    },
    initCircle() {
      this.comments = "";
      this.circleData.percent = 0;
      this.circleData.isShow = false;
      this.circleData.title = "";
      this.circleData.desc = "";
      this.circleData.content = "";
    },
    onSubmit() {
      this.$refs.hssBaseForm.submit(async (v) => {
        if (v) {
          if (typeof v.img == "object") {
            this.comments = "hssCircle";
            this.circleData.isShow = true;
            this.circleData.title = "正在上传";
            this.circleData.desc = "正在上传封面图";
            this.circleData.content = "0/1";
            let res = await this.qiniuUpload(v.img);
            this.circleData.content = "1/1";
            setTimeout(() => {
              this.initCircle();
            }, 500);
            v.img = "https://img.cdn.zhengbeining.com/" + res.key;
          }
          addArticle(v)
            .then((res) => {
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
  async created() {
    await this.getArticleTypeList({ nowPage: 1, pageSize: 10 });
    await getTagList({ nowPage: 1, pageSize: 100 }).then((res) => {
      let temp1 = [];
      res.rows.forEach((item) => {
        let temp = {};
        temp.label = item.name;
        temp.value = item.id;
        temp1.push(temp);
      });
      this.tagList = temp1;
    });
    this.columnForm.list.forEach((item, index) => {
      if (item.prop == "tags") {
        this.columnForm.list[index].data = this.tagList;
      }
    });
  },
  mounted() {},
};
</script>

<style scoped></style>
