import Vue from 'vue'
import VueRouter from 'vue-router'
import vueApp from './app.vue'
import Foo from './component/foo.vue'
import Bar from './component/bar.vue'
import Baz from './component/baz.vue'
import Layout from './component/layout.vue'
import NotFound from './component/notFound.vue'

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
    mode: 'history',
    routes
})


if (module.hot) {
    console.log('开启热更新')
    module.hot.accept('./lib/utils',()=>{
        console.log('utils更新了')
    })
}

console.log('src下的mian.js')

new Vue({
    el: '#app',
    router,
    render: h => h(vueApp)
})