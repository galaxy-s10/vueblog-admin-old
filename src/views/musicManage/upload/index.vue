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
import hssUpload from "../../../components/upload/index";
import baseForm from "../../../components/hssComponents/form/base-form/index";
import hssCircle from "@/components/hssCircle";
import { getTypeList } from "../../../api/type";
import { findMusic, addMusic, updateMusic } from "../../../api/music";
import { getQiniuToken, deleteQiniu } from "../../../api/qiniu";
import { mapState } from "vuex";
import * as qiniu from "qiniu-js";

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
      columnForm: {
        submitBtn: true,
        list: [
          {
            type: "Input",
            name: "音乐名",
            prop: "name",
            placeholder: "请输入音乐名",
            required: true,
          },
          {
            name: "作者",
            type: "Input",
            prop: "author",
            placeholder: "请输入作者",
            required: true,
          },
          {
            name: "音乐封面图",
            type: "Upload",
            isObject: true,
            prop: "img",
            uploaOption: {
              maxSize: 1024 * 10,
              fileNameLength: 20,
              format: ["jpg", "jpeg", "png", "mpeg", "mp4", "gif"],
            },
            required: true,
          },
          {
            name: "音乐文件",
            type: "Upload",
            prop: "url",
            isObject: true,
            required: true,
          },
          {
            name: "状态",
            type: "Radio",
            data: [
              { label: "已通过", value: 1 },
              { label: "待审核", value: 0 },
            ],
            prop: "status",
            required: true,
          },
        ],
      },
      initData: {},
      // init: false,
      init: true,
      headerImg: [],
      oldImgList: [],
      newimg: null,
      typeList: [],
    };
  },
  computed: {
    ...mapState({
      user_id: (state) => state.user.id,
    }),
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
    // 上传七牛云文件
    async qiniuUpload(file) {
      const datetime = new Date();
      const key = datetime.getTime() + file.name;
      const { uploadToken } = await getQiniuToken();
      console.log(uploadToken);
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
            console.log(percent);
            that.circleData.percent = parseInt(percent.toFixed());
          },
          // error: 上传错误后触发
          error(err) {
            console.log("上传七牛云图片错误");
            reject(err);
          },
          // complete: 接收上传完成后的后端返回信息
          complete(ress) {
            resolve("https://img.cdn.zhengbeining.com/" + ress.key);
          },
        });
      });
    },
    onSubmit() {
      this.$refs.hssBaseForm.submit(async (v) => {
        if (v) {
          console.log(v);
          // return;
          // if (typeof v.img == "object") {
          //   await deleteQiniu(this.initData.img.slice(33));
          this.comments = "hssCircle";
          this.circleData.isShow = true;
          this.circleData.title = "正在上传";
          this.circleData.desc = "正在上传封面图";
          this.circleData.content = "0/2";
          let upImg = await this.qiniuUpload(v.img);
          console.log(upImg);
          v.img = upImg;
          this.circleData.percent = 0;
          this.circleData.content = "1/2";
          this.circleData.desc = "正在上传音乐文件";
          this.circleTitle = "正在上传音乐文件";
          let upUrl = await this.qiniuUpload(v.url);
          this.circleData.content = "2/2";
          setTimeout(() => {
            this.initCircle();
          }, 500);
          v.url = upUrl;
          console.log(upUrl);
          addMusic(v)
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
  async created() {
    console.log(this.$route);
    if (!this.$route.params.id) {
      return;
    }
    await findMusic(this.$route.params.id)
      .then((res) => {
        this.columnForm = {
          submitBtn: true,
          list: [
            {
              prop: "id",
            },
            {
              type: "Input",
              name: "音乐名",
              prop: "name",
              placeholder: "请输入音乐名",
              required: true,
            },
            {
              name: "作者",
              type: "Input",
              prop: "author",
              required: true,
            },
            // {
            //   name: "图片",
            //   type: "Input",
            //   prop: "img",
            //   required: true,
            // },
            // {
            //   name: "链接",
            //   type: "Input",
            //   prop: "url",
            //   required: true,
            // },
            {
              name: "音乐封面图",
              type: "Upload",
              isObject: true,
              prop: "img",
              // required: true,
            },
            {
              name: "音乐文件",
              type: "Upload",
              prop: "url",
              isObject: true,
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
              // required: true,
            },
          ],
        };
        // let deepTags = JSON.parse(JSON.stringify(res.detail.tags));
        this.initData = res.detail;
        // console.log(this.initData);
        this.form.id = res.detail.id;
        this.form.name = res.detail.name;
        this.form.author = res.detail.author;
        this.form.status = res.detail.status;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  mounted() {},
};
</script>

<style scoped></style>
