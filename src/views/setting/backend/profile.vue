<template>
  <div>
    <base-form
      v-if="columnForm && columnForm.list"
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
import { findOne } from "@/api/user";
import { mapState } from "vuex";
import baseForm from "@/components/hssComponents/form/base-form/index";
import hssCircle from "@/components/hssCircle";
import { updateUser, findDuplicate } from "@/api/user";

import { getQiniuToken, deleteQiniu } from "@/api/qiniu";
import * as qiniu from "qiniu-js";

export default {
  components: { baseForm, hssCircle },
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
      detail: {},
      init: true,
      initData: {},
      columnForm: {},
    };
  },
  computed: {
    ...mapState("user", ["id", "role", "auth"]),
  },
  methods: {
    initCircle() {
      this.comments = "";
      this.circleData.percent = 0;
      this.circleData.isShow = false;
      this.circleData.title = "";
      this.circleData.desc = "";
      this.circleData.content = "";
    },
    // 上传七牛云图片
    async qiniuUpload(file) {
      const datetime = new Date();
      const key = datetime.getTime() + file.name;
      const { uploadToken } = await getQiniuToken();
      const uptoken = uploadToken;
      const putExtra = {
        customVars: { "x:user_id": `${this.id}` },
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
    onSubmit() {
      this.$refs.hssBaseForm.submit(async (v) => {
        if (v) {
          console.log(v);
          // return;
          let isDup = await findDuplicate({ id: v.id, username: v.username });
          console.log(isDup);
          if (isDup.count == 0) {
            // return;
            if (v.avatar != null && typeof v.avatar == "object") {
              let num = 1;
              this.comments = "hssCircle";
              this.circleData.isShow = true;
              this.circleData.title = "正在上传";
              if (this.initData.avatar) {
                num++;
                this.circleData.content = "0/" + num;
                this.circleData.desc = "正在删除旧头像";
                let delAvatar = await deleteQiniu(
                  this.initData.avatar.slice(33)
                );
                this.circleData.content = "1/" + num;
                this.$Notice.success({
                  title: `${delAvatar.message}`,
                  desc: "",
                });
              }
              this.circleData.desc = "正在上传头像";
              let upAvatar = await this.qiniuUpload(v.avatar);
              this.circleData.content = (num == 1 ? "1/" : "2/") + num;
              console.log(upAvatar);
              v.avatar = "https://img.cdn.zhengbeining.com/" + upAvatar.key;
              setTimeout(() => {
                this.initCircle();
              }, 500);
            }
            updateUser(v).then((res) => {
              this.$Message.success({
                content: res.message,
              });
            });
          } else {
            this.$Message.error({
              content: isDup.message,
            });
          }
        }
      });
    },
  },
  created() {},
  mounted() {
    findOne(this.id).then((res) => {
      console.log(res);
      this.detail = res.detail;
      this.columnForm = {
        submitBtn: true,
        list: [
          {
            type: "Input",
            name: "id",
            prop: "id",
            // placeholder: "请输入id",
            // required: true,
            disabled: true,
            display: "none",
            resetAble: true,
          },
          {
            type: "Input",
            name: "昵称",
            prop: "username",
            placeholder: "请输入昵称",
            required: true,
          },
          {
            name: "标题",
            type: "Input",
            prop: "title",
            placeholder: "请输入标题",
            // required: true,
          },
          {
            name: "头像",
            type: "Upload",
            isObject: true,
            prop: "avatar",
            uploaOption: {
              maxSize: 1024 * 10,
              fileNameLength: 20,
            },
            // required: true,
          },
          {
            type: "Input",
            name: "发布文章数量",
            prop: "articles",
            // placeholder: "请输入发布文章数量",
            disabled: true,
            // required: true,
          },
          {
            type: "Input",
            name: "收到点赞数量",
            prop: "stars",
            // placeholder: "请输入收到点赞数量",
            disabled: true,
            // required: true,
          },
          {
            name: "状态",
            type: "Radio",
            data: [
              { label: "已通过", value: 1 },
              { label: "待审核", value: 0 },
            ],
            prop: "status",
            disabled: true,
            // required: true,
          },
        ],
      };
      res.detail.articles = res.detail.articles.length;
      res.detail.stars = res.detail.stars.length;
      this.initData = res.detail;
    });
  },
};
</script>

<style scoped></style>
