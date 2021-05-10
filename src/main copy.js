/**
 * 因为js是单线程的，先执行同步代码，遇到异步代码，不会等待异步代码执行完再向下执行，会异步代码放入队列，继续执行下面的同步代码
 * 既然js不会等待异步代码执行完，依旧会继续向下执行。即不管异步代码会不会对下面的代码有影响，js还是会依旧会继续向下执行
 * 因此，没必要将这部分异步代码打包进bundle.js里，反正将这部分异步代码打包进bundle.js了，js也是异步执行这里面的代码的，
 * 所以，可以将这部分异步代码从bundle.js里抽离出来，等bundle.js执行完了，再执行这部分异步代码，也是一样的效果。
 * 但是，将这部分从异步代码从bundle.js从抽离出来，可以减少bundle.js的体积大小，这样网络请求bundle.js的时候，就会快一点，
 * 这就是好处！
 * 但是默认是不管异步引入的的文件大小的，只要是异步了都会抽离出单独的一个包！如果每个异步引入的文件都单独打包出一个包，如果有一
 * 个异步引入的文件很小很小，只有几行代码，文件可能1kb都不到，如果也将这个文件抽离出一个单独文件引入的话，那么花一个网络请求去
 * 请求这个这么小的文件，开销先不说大不大（开销是相对的，约等于杀鸡用牛刀。），肯定是非常不划算的，既然这个文件这么小，倒不如直接让
 * 它打包进bundle.js里面，因为将它打包进bundle.js里的话，对bundle.js的体积来说没什么变化，网络请求bundle.js的时候，花费的请求时间也没什么变化，
 * 但是，如果将那个很小的文件抽离出来的话，却要额外发多一次网络请求（需要经历tcp三次握手四次挥手等等）,对比下来的话，很明显就不划算了。
 */

import Vue from 'vue'   //同步导入，默认会打包到bundle.js，不会代码抽离(除非手动设置了splitChunks，且chunks为async，这样同步代码就不会分离了，但设置了会将异步代码进行分离)
import VueRouter from 'vue-router'  //同步导入，默认会打包到bundle.js，不会代码抽离
import vueApp from './app.vue'  //同步导入，默认会打包到bundle.js，不会代码抽离
import Foo from './component/foo.vue'   //同步导入，默认会打包到bundle.js，不会代码抽离
import Bar from './component/bar.vue'   //同步导入，默认会打包到bundle.js，不会代码抽离
import Baz from './component/baz.vue'   //同步导入，默认会打包到bundle.js，不会代码抽离
import Layout from './component/layout.vue' //同步导入，默认会打包到bundle.js，不会代码抽离
import NotFound from './component/notFound.vue' //同步导入，默认会打包到bundle.js，不会代码抽离

// import mode1 from './js/mode1'   //同步导入，默认会打包到bundle.js，不会代码抽离
// console.log('mode1mode1', mode1)

// import mode3 from './js/mode3'   //同步导入，默认会打包到bundle.js，不会代码抽离
// console.log('mode3mode3', mode3)
// import mode2 from './js/mode2'   //同步导入，默认会打包到bundle.js，不会代码抽离

// import $1 from './js/jq'     //同步导入，默认会打包到bundle.js，不会代码抽离
import './js/jq'             //同步导入，默认会打包到bundle.js，不会代码抽离

// console.log('9999999999', $1)
// import('./js/jq')   //异步导入，默认都会进行代码抽离(除非手动设置了splitChunks，且chunks为initial，这样异步代码就不会分离了，但设置了会将同步代码进行分离)
// import('./js/little')   //异步导入，默认都会进行代码抽离


// import cpt from './js/component'

Vue.use(VueRouter)

import { name, sum } from './lib/utils'
console.log(name, sum(1, 2))
console.log('x')

const routes = [
    // { path: '/', redirect: '/foo' },
    { path: '/', component: Layout, },
    // { path: '/', component: Layout, redirect: 'foo' },
    {
        path: '/foo',
        component: Layout,
        children: [
            {
                path: '/foo',
                component: Foo
            }
        ]
    },
    {
        path: '/bar',
        component: Layout,
        children: [
            {
                path: '/bar',
                component: Bar
            }
        ]
    },
    {
        path: '/baz',
        component: Layout,
        children: [
            {
                path: '/baz',
                component: Baz
            }
        ]
    },
    { path: '*', component: NotFound }
]
const router = new VueRouter({
    // base:'/abc',
    // mode: 'history',
    routes
})


if (module.hot) {
    console.log('开启热更新')
    module.hot.accept('./lib/utils', () => {
        console.log('utils更新了')
    })
}

console.log('src下的mian.js')

new Vue({
    el: '#app',
    router,
    render: h => h(vueApp)
})