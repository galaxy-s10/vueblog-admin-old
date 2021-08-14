<template>
  <div>
    <Form :model="fromCol" :rules="rules" :label-width="100" ref="hssForm">
      <FormItem
        :label="item.name"
        :prop="item.prop"
        v-for="(item, index) in fromData.list"
        :key="index"
        :style="{ display: item.display }"
        :rules="item.rules"
      >
        <template>
          <div v-if="item.render">
            <hss-render
              :render="item.render"
              :row="item"
              :index="index"
            ></hss-render>
          </div>
          <!-- 输入框 -->
          <Input
            v-if="item.type == 'Input'"
            clearable
            :number="item.isNumber"
            :disabled="item.disabled"
            :type="item.mode == 'password' ? 'password' : 'text'"
            v-model="fromCol[item.prop]"
            :placeholder="item.placeholder"
          ></Input>
          <!-- 下拉框 -->
          <Select
            v-if="item.type == 'Select'"
            v-model="fromCol[item.prop]"
            :placeholder="item.placeholder"
            :multiple="item.isArray"
            clearable
            :disabled="item.disabled"
          >
            <Option v-for="(el, i) in item.data" :value="el.value" :key="i">{{
              el.label
            }}</Option>
          </Select>
          <!-- 单选框 -->
          <RadioGroup v-if="item.type == 'Radio'" v-model="fromCol[item.prop]">
            <Radio :label="el.value" v-for="el in item.data" :key="el.value">{{
              el.label
            }}</Radio>
          </RadioGroup>
          <!-- 多选框 -->
          <CheckboxGroup
            v-if="item.type == 'Check'"
            v-model="fromCol[item.prop]"
          >
            <Checkbox
              :label="el.value"
              v-for="el in item.data"
              :key="el.value"
              >{{ el.label }}</Checkbox
            >
          </CheckboxGroup>
          <!-- 树结构 -->
          <hss-tree
            v-if="item.type == 'Tree'"
            :treeData="item"
            :renderContent="item.renderContent"
            v-model="fromCol[item.prop]"
            @on-check-change="handleChoice"
          ></hss-tree>
          <!-- 日期选择器 -->
          <DatePicker
            v-if="item.type == 'Date'"
            v-model="fromCol[item.prop]"
            :type="item.mode ? item.mode : 'date'"
            :format="item.format ? item.format : 'yyyy-MM-dd HH:mm:ss'"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
          ></DatePicker>
          <!-- 上传文件 -->
          <hss-upload
            v-if="item.type == 'Upload'"
            :uploaOption="item.uploaOption"
            :file="fromCol[item.prop]"
            v-model="fromCol[item.prop]"
          ></hss-upload>
          <!-- md富文本 -->
          <hss-markdown
            v-if="item.type == 'Editor'"
            :initContent="fromCol[item.prop]"
            v-model="fromCol[item.prop]"
            :placeholder="item.placeholder"
            @changeHssMd="changeHssMd"
          ></hss-markdown>
          <!-- <hss-markdown
            v-if="item.type == 'editor'"
            :initContent="item.content"
            v-model="fromCol[item.prop]"
            :placeholder="item.placeholder"
            @changeHssMd="changeHssMd"
          ></hss-markdown> -->
          <!-- <hss-markdown
            v-if="item.type == 'editor'"
            :initContent="yyy || item.content"
            :placeholder="item.placeholder"
            @change111="changeMd"
          ></hss-markdown> -->
        </template>
      </FormItem>
      <FormItem v-if="fromData.submitBtn">
        <Button type="primary" @click="onSubmit()">确定</Button>
        <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import hssMarkdown from "../../../hssMarkdown/index";
import hssUpload from "../../../hssUpload/index";
import hssRender from "./render.js";
import fromRules from "./rules";
import hssTree from "../../tree/index";
export default {
  components: { hssTree, hssRender, hssMarkdown, hssUpload },
  props: {
    fromData: {
      type: Object,
      default: () => {},
    },
    initData: {
      type: Object,
      default: () => {},
    },
    // 是否初始化数据(即显示默认数据，如果不初始化就是全空)
    init: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      yyy: "",
      rules: {}, //验证器
      fromCol: {}, //所有输入字段
      fromDataNew: {},
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    changeHssMd(v) {
      console.log("changeHssMd");
      // console.log(v);
    },
    handleReset() {
      let temp = [];
      this.fromDataNew.list.forEach((item) => {
        if (!item.resetAble) {
          temp.push(item);
        }
      });
      temp.forEach((item) => {
        this.fromCol[item.prop] = "";
      });
    },
    // changeMd(v){
    // console.log(v);
    // this.yyy = v
    // },
    onSubmit() {
      this.$emit("onSubmit");
      // this.submit((v) => {
      //   if (v) {
      //     // console.log(v);
      //   } else {
      //     // console.log("表单验证失败");
      //   }
      // });
    },
    // 提交表单
    submit(cb) {
      let that = this;
      // 返回表单数据，如果验证不通过返回false
      let res = false;
      this.$refs["hssForm"].validate(async (valid) => {
        console.log(valid);
        if (valid) {
          console.log("表单验证成功");
          res = that.fromCol;
          cb(res);
        } else {
          console.log("表单验证失败");
          let that = this;
          function digui(j) {
            that.$refs["hssForm"].validateField(
              that.fromData.list[j].prop,
              (valid) => {
                if (valid) {
                  that.$Message.error(valid);
                  console.log("cb");
                  // console.log(cb)
                  cb(false);
                } else {
                  console.log(that.fromData.list[j].prop);
                  digui(j + 1);
                }
              }
            );
          }

          digui(0);
        }
      });
    },
    handleChoice() {},
    handleRule() {
      for (let i in this.fromData.list) {
        let item = this.fromData.list[i];
        this.rules[item.prop] = [];
        // 是否必须
        if (item.required) {
          // console.log(item.type);
          // console.log(item.isArray);
          // console.log(item.isObject);
          if (
            item.type === "Select" ||
            item.type === "Radio" ||
            item.type === "Check" ||
            item.type === "Tree" ||
            item.isObject
          ) {
            // Select,Radio,Check,Tree组件，验证类型为array或object或number
            this.rules[item.prop] = [
              {
                required: true,
                message: item.name + "不能为空",
                trigger: "change",
                // trigger: "blur",
                type: item.isArray
                  ? "array"
                  : item.isObject
                  ? "object"
                  : item.isString
                  ? "string"
                  : "number",
              },
            ];
          }
          //  else if (item.type == "editor") {
          //   this.rules[item.prop] = [
          //     {
          //       required: true,
          //       message: item.name + "不能为空",
          //       type: "string",
          //       // type: "number",
          //     },
          //   ];
          // }
          else {
            // 其他组件(如input,picker)，验证类型为strgin或date或number
            this.rules[item.prop] = [
              {
                required: true,
                message: item.name + "不能为空",
                // trigger: "change",
                // trigger: "blur",
              },
              {
                // trigger: "change",
                // trigger: "blur",
                message:
                  item.name +
                  `必须是${
                    item.isNumber ? "数字" : item.isDate ? "日期" : "字符串"
                  }类型`,
                type: item.isNumber
                  ? "number"
                  : item.isDate
                  ? "date"
                  : "string",
              },
            ];
            // if (item.isNumber) {
            //   this.rules[item.prop] = [
            //     {
            //       // required: true,
            //       message: item.name + "数字",
            //       trigger: "change",
            //       // trigger: "blur",
            //       type: "number",
            //     },
            //   ];
            // }
          }
        }
        // 验证规则
        // if (item.rule) {
        //   if (typeof item.rule === "string") {
        //     for (let key in fromRules) {
        //       if (item.rule == key) {
        //         this.rules[item.prop] = this.rules[item.prop].concat(
        //           fromRules[item.rule]
        //         );
        //       }
        //     }
        //   } else if (item.rule instanceof Object) {
        //     this.rules[item.prop].push(item.rule);
        //   }
        // }
      }
    },
    handleVal(data) {
      this.fromDataNew = { ...this.fromData };
      if (data) {
        if (this.init) {
          // 编辑时候格式化数据
          for (let i = 0; i < this.fromDataNew.list.length; i++) {
            let item = this.fromDataNew.list[i];
            this.fromDataNew.list[i].val = data[item.prop];
          }
        } else {
          // 添加置空表单
          for (let i = 0; i < this.fromDataNew.list.length; i++) {
            let item = this.fromDataNew.list[i];
            if (item.default) {
              this.fromDataNew.list[i].val = item.default;
            } else {
              this.fromDataNew.list[i].val = "";
            }
          }
        }
      }
    },
    // 处理表单数据集
    handleFromCol() {
      // console.log(this.fromCol);
      console.log("处理表单数据集");
      for (let i in this.fromData.list) {
        let item = this.fromData.list[i];
        // console.log(item);
        this.$set(this.fromCol, item.prop, item.val);
      }
      // console.log(this.fromCol);
    },
  },
  watch: {
    // 处理表单选项发生改变的时候初始化
    "fromData.list": {
      handler() {
        this.fromCol = {};
        console.log(this.initData);
        this.handleVal(this.initData);
        this.handleFromCol();
        this.handleRule();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
