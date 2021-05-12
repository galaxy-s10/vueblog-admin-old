<template>
  <div>
    {{arr}}
    {{obj}}
    <button @click="change">点我</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arr: ["11", "22"],
      obj: { name: 123 }
    };
  },
  methods: {
    change() {
      debugger
      console.log("change");
      // this.arr[1] = new Date().getTime() + 12345;
      this.obj.name = new Date().getTime();
      console.log('11111');
    }
  }
};
</script>
