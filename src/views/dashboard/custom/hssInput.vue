<template>
  <div>
    <!-- 第一种情况（报警告），hssIptVal未定义在实例上 -->
    <!-- <input type="text" @input="changeIpt" :value="hssIptVal" /> -->
    <!-- 第二种情况 -->
    <input type="text" @input="changeIpt" :value="val" />
    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
      <FormItem prop="user">
        <Input type="text" v-model="formInline.user" placeholder="Username">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formInline.password" placeholder="Password">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit()">Signin</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  props: {
    val: {
      type: String,
      default: "",
    },
  },
  model: {
    prop: "hssIptVal",
    event: "hssChangeIpt",
  },
  data() {
    return {
      formInline: {
        user: "",
        password: "",
      },
      ruleInline: {
        user: [
          { required: true, message: "Please fill in the user name", trigger: "blur" },
        ],
        password: [
          { required: true, message: "Please fill in the password.", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit(cb) {
      this.$refs["formInline"].validate((valid) => {
        console.log(valid);
        if (valid) {
          cb(998);
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
        
      });
      return 9;
    },
    changeIpt(e) {
      console.log("子组件input");
      this.$emit("hssChangeIpt", e.target.value);
    },
  },
};
</script>
