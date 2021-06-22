console.log('object');
import './a.less';
import './b.css';
// import loading from './loading';
// import CPT from './backdoor/index';
// import CPT from './hello/index.vue';
import CPT from './user/index.vue';
// console.log(backdoor);
import Vue from 'vue';

var myText = document.createTextNode('createTextNode');
document.body.appendChild(myText);

new Vue({
  render: h => h(CPT),
}).$mount('#app')