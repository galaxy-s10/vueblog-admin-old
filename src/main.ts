console.log('object');
import './a.less';
import './b.css';
// import loading from './loading';
import backdoor from './backdoor/index.tsx';
import Vue from 'vue';

var myText = document.createTextNode('sdfdsf你好');
document.body.appendChild(myText);

new Vue({
    render: h => h(backdoor),
  }).$mount('#app')