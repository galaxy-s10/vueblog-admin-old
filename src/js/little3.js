console.log('我是little3.js')

import('./mode2').then(res=>{
    console.log('异步/动态导入mode2');
    console.log(res);
})