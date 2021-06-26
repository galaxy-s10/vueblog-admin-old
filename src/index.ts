import Btn from "./btn";
import Btn2 from "./btn2/index";
// import App from './backdoor/index';
// import App from '../dist/backdoor/index';
// import App from '../dist/hello/index';
import App from "./hello/index";
import Switch from "./switch/index";
import Vue from "vue";
function hello(compiler: string) {
  console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
console.log(Btn());

// const components = {
//   Switch,
// };

// module.exports =components
// export { Switch };
// console.log(Btn2);

// console.log('object');
// import './a.less';
// import './b.css';
// // import loading from './loading';
// // import CPT from './backdoor/index';
// import CPT from './avatar/index';
// // import App from './hello/index.vue';
// import App from './user/index.vue';
// // import App from './render/index.vue';
// // console.log(backdoor);
// import Vue from 'vue';

// console.log(CPT);

// var myText = document.createTextNode('createTextNode');
// document.body.appendChild(myText);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
