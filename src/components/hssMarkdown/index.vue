<template>
  <div>
    <mavon-editor
      style="height: 600px; z-index: 100 !important"
      ref="md"
      v-model="content"
      :autofocus="false"
      @change="changeContent"
      @imgAdd="imgAdd"
      @imgDel="imgDel"
    ></mavon-editor>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mavonEditor } from "mavon-editor";
import { getQiniuToken, deleteQiniu } from "@/api/qiniu";
// 引入七牛云
import * as qiniu from "qiniu-js";

import "mavon-editor/dist/css/index.css";
export default {
  // inheritAttrs:false,
  components: { mavonEditor },
  props: {
    initContent: "",
  },
  model: {
    prop: "contentp",
    event: "changeHssMd",
  },
  data() {
    return {
      content: this.initContent,
    };
  },
  watch: {
    content(newVal, oldVal) {
      this.contentp = newVal;
      this.$emit("changeHssMd", newVal);
      this.content = newVal;
    },
    // contentp(newVal, oldVal) {
    //   this.content = newVal;
    // },
    initContent(newVal, oldVal) {
      this.content = newVal;
    },
  },
  computed: {
    ...mapState({
      user_id: (state) => state.user.id,
    }),
  },

  created() {},
  mounted() {},
  methods: {
    changeContent(v) {
      // console.log(v);
      this.content = v;
      // this.$emit("changeHssMd", v);
    },
    // 上传七牛云图片
    async qiniuUpload(filename, file) {
      const datetime = new Date();
      const key = datetime.getTime() + file.name;
      const { uploadToken, message } = await getQiniuToken();
      if (uploadToken) {
        const putExtra = {
          customVars: { "x:user_id": `${this.user_id}` },
        };
        console.log(uploadToken)
        const config = { useCdnDomain: true };
        const observable = qiniu.upload(file, key, uploadToken, putExtra, config);
        let that = this;
        return new Promise(function (resolve, reject) {
          const subscription = observable.subscribe({
            // next: 接收上传进度信息的回调函数
            next(res) {
              const percent = res.total.percent; // 当前上传进度
            },
            // error: 上传错误后触发
            error(err) {
              console.log("上传七牛云图片错误");
              reject(err);
            },
            // complete: 接收上传完成后的后端返回信息
            complete(ress) {
              that.$Message.success({
                content: ress.message,
                duration: 2,
              });
              resolve("https://img.cdn.zhengbeining.com/" + ress.key);
            },
          });
        });
      } else {
        this.$Message.error({
          content: message,
          duration: 2,
        });
        return Promise.reject(file.name);
      }
    },
    async imgAdd(filename, file) {
      try {
        let img = await this.qiniuUpload(filename, file);
        this.$refs.md.$img2Url(filename, img);
      } catch (err) {
        this.$refs.md.$refs.toolbar_left.$imgDelByFilename(err);
      }
    },
    imgDel(filename) {},
  },
};
</script>

<style scoped></style>
