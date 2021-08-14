<template>
  <div>
    <!-- <el-upload
      :http-request="handleUpload"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="handleBefore"
      class="upload-demo"
      list-type="picture-card"
      action
      :limit="1"
      :file-list="imgList"
    >
      <i class="el-icon-plus"></i>
    </el-upload> -->
    <Upload
      :before-upload="handleUpload"
      :on-remove="handleRemove"
      :on-exceeded-size="handleExceed"
      :format="uploaOption.format"
      :max-size="uploaOption.maxSize"
      :multiple="uploaOption.multiple"
      :type="uploaOption.type"
      action
    >
      <div>
        <div>
          <Button icon="ios-cloud-upload-outline">选择文件</Button>
        </div>
        <div v-if="uploadFile && uploadFile.url != ''">
          已选文件: {{ uploadFile.name || file }}
        </div>
      </div>
    </Upload>
    <!-- <Progress v-if="uploadFile && uploadFile.url" :percent="percent" status="active" /> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getQiniuToken, deleteQiniu } from "@/api/qiniu";
// 引入七牛云
import * as qiniu from "qiniu-js";

export default {
  components: {},
  props: {
    file: "",
  },
  model: {
    prop: "file",
    event: "changeFile",
  },
  data() {
    return {
      uploadFile: {},
      uploaOption: {
        multiple: false,
        type: "select",
        format: ["jpg", "jpeg", "png"],
        maxSize: 2048, //单位kb
      },
      percent: 0, //进度
      img: null,
    };
  },
  computed: {},
  methods: {
    changeFile(v) {
      console.log("changeFilechangeFilechangeFile");
      console.log(v);
    },
    // 获取七牛云上传凭证
    async getQiniuToken() {
      const res = await getQiniuToken();
      console.log(res);
      this.qiniuToken = res.uploadToken;
    },
    // 上传七牛云图片
    async qiniuUpload(filename, file) {
      const datetime = new Date();
      const key = datetime.getTime() + file.name;
      const uploadToken = await getQiniuToken();
      const uptoken = uploadToken;
      const putExtra = {};
      const config = { useCdnDomain: true };
      const observable = qiniu.upload(file, key, uptoken, putExtra, config);
      const that = this;
      return new Promise(function (resolve, reject) {
        const subscription = observable.subscribe({
          // next: 接收上传进度信息的回调函数
          next(res) {
            const percent = res.total.percent; // 当前上传进度
            console.log(percent);
            that.percent = parseInt(percent.toFixed());
          },
          // error: 上传错误后触发
          error(err) {
            console.log("上传七牛云图片错误");
            reject(err);
          },
          // complete: 接收上传完成后的后端返回信息
          complete(ress) {
            console.log(ress)
            console.log("上传七牛云图片成功");
            resolve("https://img.cdn.zhengbeining.com/" + ress.key);
          },
        });
      });
    },
    handleBefore(file) {
      if (file.name.length > 15) {
        return false;
      }
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    handleUpload(file) {
      console.log(file);
      if (file.name.length > 20) {
        this.$Message.error({
          content: "文件名不能超过二十个字符!",
        });
        return false;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const _base64 = reader.result;
        let temp = {};
        temp.url = _base64; //将_base64赋值给图片的src，实现图片预览
        temp.name = file.name;
        this.uploadFile = temp;
      };
      this.$emit("changeFile", file);
      // this.qiniuUpload(file.name, file)
      //   .then((res) => {
      //     console.log(res);
      //     this.$Message.success({
      //       content: "上传成功！",
      //     });
      //     // this.imgList.push({ name: "", url: res });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      return false;
    },
    // 删除七牛云图片
    async deleteQiniu(filename) {
      return new Promise(function (resolve, reject) {
        deleteQiniu(filename.slice(33))
          .then((res) => {
            resolve("删除七牛云图片成功");
          })
          .catch((err) => {
            reject("删除七牛云图片错误");
          });
      });
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      if (file.name.length <= 15) {
        this.deleteQiniu(this.imgList[0].url)
          .then((res) => {
            this.imgList.shift();
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$message({
          message: "文件名不能大于十五个字符!",
          type: "error",
        });
      }
    },
    // 文件超出大小限制时的钩子
    handleExceed(file) {
      this.$message({
        message: "只能上传一张封面图",
        type: "error",
      });
    },
  },
};
</script>

<style scoped></style>
