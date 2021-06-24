module.exports = {
  presets: [
    "@babel/preset-env"
    // [
    //   "@babel/preset-env",
    //   {
    //     // false: 不用任何的polyfill相关的代码
    //     // usage: 代码中需要哪些polyfill, 就引用相关的api
    //     // entry: 手动在入口文件中导入 core-js/regenerator-runtime, 根据目标浏览器引入所有对应的polyfill
    //     useBuiltIns: "entry",
    //     corejs: 3,
    //   },
    // ],
    // ['@vue/babel-preset-jsx']
  ],
  plugins: [
    "transform-vue-jsx",  //vue使用jsx就得用这个插件（即使是在vue文件里面使用了render函数也算使用了jsx）！否则解析不了jsx会报错。
    // [
    //   "@babel/plugin-transform-runtime",
    //   {
    //     corejs: 3,
    //   },
    // ],
  ],
};
