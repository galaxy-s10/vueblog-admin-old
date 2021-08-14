<template>
  <div>
    <Upload
      :format="uploaOption && uploaOption.format"
      :max-size="uploaOption && uploaOption.maxSize"
      :multiple="uploaOption && uploaOption.multiple"
      :type="uploaOption && uploaOption.type"
      :before-upload="handleUpload"
      :on-exceeded-size="handleMaxSize"
      :on-format-error="handleFormatError"
      :on-remove="handleRemove"
      action
    >
      <div>
        <div>
          <Button icon="ios-cloud-upload-outline">选择文件</Button>
        </div>
      </div>
    </Upload>
    <!-- <div v-if="uploadFile && uploadFile.url != ''"> -->
    <div v-if="uploadFile || file">已选文件: {{ uploadFile.name || file }}</div>
    <div v-else>暂未选择文件</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    uploaOption: {
      type: Object,
      default: () => {},
    },
    file: "",
  },
  model: {
    prop: "uploadFile",
    event: "changeFile",
  },
  data() {
    return {
      uploadFile: "",
    };
  },
  computed: {},
  methods: {
    /* 
      上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传
      文件上传首先执行这个函数，因此后面的判断类型，大小的钩子不会执行
    */
    handleUpload(file) {
      console.log(this.uploaOption);
      if (
        this.uploaOption &&
        this.uploaOption.fileNameLength &&
        file.name.length > this.uploaOption.fileNameLength
      ) {
        this.$Message.error({
          content: `文件名不能超过${this.uploaOption.fileNameLength}个字符!`,
        });
        return false;
      }
      let fileType = file.type.split("/")[1];
      if (
        this.uploaOption &&
        this.uploaOption.format &&
        !this.uploaOption.format.includes(fileType)
      ) {
        this.handleFormatError(file);
        return false;
      }
      if (
        this.uploaOption &&
        this.uploaOption.maxSize &&
        parseInt((file.size / 1024).toFixed()) > this.uploaOption.maxSize
      ) {
        this.handleMaxSize(file);
        return false;
      }
      this.uploadFile = file;
      this.$emit("changeFile", file);
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
