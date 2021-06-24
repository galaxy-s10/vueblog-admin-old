import Btn from './btn';
import Btn2 from './btn2';
function hello(compiler: string) {
  console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
console.log(Btn());
console.log(Btn2());

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

// new Vue({
//   render: h => h(App),
// }).$mount('#app')