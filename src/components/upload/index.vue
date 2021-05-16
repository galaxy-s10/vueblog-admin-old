<template>
  <div>
    <Upload
      :format="uploaOption.format"
      :max-size="uploaOption.maxSize"
      :multiple="uploaOption.multiple"
      :type="uploaOption.type"
      :before-upload="handleUpload"
      :on-exceeded-size="handleMaxSize"
      :on-format-error="handleFormatError"
      :on-remove="handleRemove"
      action
    >
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>单击或拖动此处上传文件</p>
      </div>
    </Upload>
    <div v-if="tempFile && tempFile.name">
      <img :src="tempFile.url" style="max-width: 200px" :alt="tempFile.name" />
      <div>
        <Button icon="ios-cloud-upload-outline" @click="submitUpload"
          >上传</Button
        >
      </div>
    </div>
    <!-- <Modal
      :value="percent != 0"
      title="正在上传"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true"
      width="300"
      style="text-align: center"
    >
      <i-circle :percent="percent">
        <span class="demo-Circle-inner" style="font-size: 24px"
          >{{ percent }}%</span
        >
      </i-circle>
    </Modal> -->
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
import { mapState } from "vuex";
import { getQiniuToken } from "@/api/qiniu";
import hssCircle from "@/components/hssCircle";

// 引入七牛云
import * as qiniu from "qiniu-js";

export default {
  components: { hssCircle },
  props: {
    imgList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
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
      uploadLoading: true,
      uploadFile: "",
      uploaOption: {
        multiple: false,
        type: "drag",
        format: ["jpg", "jpeg", "png", "mpeg", "mp4", "gif"],
        // format: [],
        maxSize: 1024 * 10, //单位kb
      },
      percent: 0, //进度
      tempFile: "",
    };
  },
  computed: {
    ...mapState({
      user_id: (state) => state.user.id,
    }),
  },
  mounted() {
    // this.comments = "hssCircle";
    // this.percent = "100";
    // this.isShow = true;
    // this.circleData.percent = 10;
    // this.circleData.title = "22";
    // this.circleData.desc = "sfsdf";
    // this.circleData.content = "1/3";
  },
  methods: {
    submitUpload() {
      this.qiniuUpload(this.uploadFile);
    },
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
      // 获取七牛云上传凭证
      const { uploadToken } = await getQiniuToken();
      const uptoken = uploadToken;
      const putExtra = {
        customVars: { "x:user_id": `${this.user_id}` },
      };
      const config = { useCdnDomain: true };
      const observable = qiniu.upload(file, key, uptoken, putExtra, config);
      let that = this;
      this.comments = "hssCircle";
      this.circleData.isShow = true;
      this.circleData.title = "正在上传";
      this.circleData.desc = "正在上传文件";
      this.circleData.content = "0/1";
      return new Promise(function (resolve, reject) {
        const subscription = observable.subscribe({
          // next: 接收上传进度信息的回调函数
          next(res) {
            const percent = res.total.percent; // 当前上传进度
            // that.$nextTick(() => {
            that.circleData.percent = parseInt(percent.toFixed());
            // });
          },
          // error: 上传错误后触发
          error(err) {
            console.log("上传七牛云图片错误");
          },
          // complete: 接收上传完成后的后端返回信息
          complete(ress) {
            that.circleData.content = "1/1";
            that.$Message.success({
              content: ress.message,
              duration: 2,
            });
            // that.$nextTick(() => {
            setTimeout(() => {
              that.initCircle();
              that.tempFile = "";
            }, 500);
            // });
          },
        });
      });
    },
    /* 
      上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传
      文件上传首先执行这个函数，因此后面的判断类型，大小的钩子不会执行
    */
    handleUpload(file) {
      // console.log(file);
      if (file.name.length > 20) {
        this.$Message.error({
          content: "文件名不能超过20个字符!",
        });
        return false;
      }
      if (parseInt((file.size / 1024).toFixed()) > this.uploaOption.maxSize) {
        this.handleMaxSize(file);
        return false;
      }
      let fileType = file.type.split("/")[1];
      if (!this.uploaOption.format.includes(fileType)) {
        this.handleFormatError(file);
        return false;
      }
      this.uploadFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const _base64 = reader.result;
        let temp = {};
        temp.url = _base64; //将_base64赋值给图片的src，实现图片预览
        temp.name = file.name;
        this.tempFile = temp;
      };
      return false;
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      // console.log("文件列表移除文件时的钩子");
    },
    // 格式化文件大小
    formatFsize(val) {
      let res = val;
      if (res > 1024) {
        res = (res / 1024).toFixed(2);
        return res + "MB";
      }
      return res + "KB";
    },
    // 文件超出指定大小限制时的钩子
    handleMaxSize(file) {
      let temp = this.formatFsize(this.uploaOption.maxSize);
      this.$Message.error({
        content: `文件大小不能超过${temp}`,
        duration: 2,
      });
    },
    // 文件格式验证失败时的钩子
    handleFormatError(file) {
      this.$Message.error({
        content: `只能上传${this.uploaOption.format}格式文件`,
        duration: 2,
      });
    },
  },
};
</script>

<style scoped></style>
