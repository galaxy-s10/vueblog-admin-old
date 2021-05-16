<template>
  <div>
    <Form :model="fromCol" :rules="rules">
      <FormItem
        :label="item.name"
        :prop="item.prop"
        v-for="(item, index) in fromData.list"
        :key="index"
      >
        <template>
          <Input
            v-if="item.type == 'Input'"
            clearable
            :disabled="item.disabled"
            :type="item.prop == 'password' ? 'password' : 'text'"
            v-model="fromCol[item.prop]"
            :placeholder="item.placeholder"
          ></Input>
          <!-- 下拉框 -->
          <Select
            v-else-if="item.type == 'Select'"
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
          <RadioGroup
            v-else-if="item.type == 'Radio'"
            v-model="fromCol[item.prop]"
          >
            <Radio :label="el.value" v-for="el in item.data" :key="el.value">{{
              el.label
            }}</Radio>
          </RadioGroup>
          <!-- 多选框 -->
          <CheckboxGroup
            v-else-if="item.type == 'Check'"
            v-model="fromCol[item.prop]"
          >
            <Checkbox
              :label="el.value"
              v-for="el in item.data"
              :key="el.value"
              >{{ el.label }}</Checkbox
            >
          </CheckboxGroup>
        </template>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import fromRules from "./rules";
export default {
  components: {},
  props: {
    fromData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      rules: {}, //验证器
      fromCol: {}, //所有输入字段
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    handleRule() {
      for (let i in this.fromData.list) {
        let item = this.fromData.list[i];
        this.rules[item.prop] = [];
        /*是否必须*/
        if (item.required) {
          if (
            item.type === "Select" ||
            item.type === "Radio" ||
            item.type === "Check" ||
            item.type === "Tree" ||
            item.isObject
          ) {
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
                  : "number",
              },
            ];
          } else {
            this.rules[item.prop] = [
              {
                required: true,
                message: item.name + "不能为空",
                trigger: "change",
                // trigger: "blur",
              },
            ];
          }
        }
        //验证规则
        console.log(item.rule)
        if (item.rule) {
          if (typeof item.rule === "string") {
            for (let key in fromRules) {
              if (item.rule == key) {
                this.rules[item.prop] = this.rules[item.prop].concat(
                  fromRules[item.rule]
                );
              }
            }
          } else if (item.rule instanceof Object) {
            this.rules[item.prop].push(item.rule);
          }
        }
        
      }
    },
  },
  watch: {
    //处理表单选项发生改变的时候初始化
    "fromData.list": {
      handler() {
        this.fromCol = {};
        // this.init();
        // if (this.api) {
        //   this.handleApiVal();
        // } else {
        //   this.handleVal(this.data);
        //   this.handleFromCol();
        // }
        this.handleRule();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
</style>