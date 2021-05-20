import router from './router'
import store from './store'
import cache from './libs/cache'
import {
  defaultRoutes
} from './router/router'


// 白名单，不需要登录即可跳转，如登录页
const whiteList = []
defaultRoutes.forEach(item => {
  if (whiteList.indexOf(item.path) == -1) {
    whiteList.push(item.path)
  }
  if (item.children) {
    item.children.forEach(iten => {
      if (whiteList.indexOf(iten.path) == -1) {
        whiteList.push(iten.path)
      }
    })
  }
})

// 因为默认登录重定向到/dashboard，而/dashboard又在白名单内，
// 因此这里手动给删掉/dashboard
whiteList.splice(whiteList.indexOf('/dashboard'), 1)

// console.log('白名单')
// console.log(whiteList)

// 比较两数组是否有交集(返回true代表有交集)
function hasMixin(a, b) {
  return a.length + b.length !== new Set([...a, ...b]).size
}
router.beforeEach(async (to, from, next) => {
  const hasToken = cache.getStorageExt("token")
  // 先判断有没有登录
  if (hasToken) {
    console.log('有token')
    const hasUserInfo = store.state.user
    // 判断用户有没有角色
    if (hasUserInfo.roles.length) {
      console.log('有token,有角色')
      console.log(to)
      // next({ ...to, replace: true })
      next()
    } else {
      // token存storage，用户信息存vuex，
      // 如果已登录的用户刷新，token还会在本地，但是vuex的数据会清空，需要重新获取
      console.log('有token,无角色');
      try {
        await store.dispatch("user/getUserInfo")
        await store.dispatch("user/getAuth")
        // 生成动态路由
        store.dispatch("user/generateRoutes");
        console.log(store)
        console.log(to)
        // next()
        next({ ...to, replace: true })
      } catch (err) {
        cache.clearStorage("token")
        next(`/login?direct=${to.path}`)
      }
    }
  } else {
    // if (to.path == '/login') {
    //   next()
    // } else {
    //   next(`/login?redirect=${to.path}`)
    // }
    console.log('无token')
    store.commit('user/setRoutes', [])
    console.log(whiteList)
    console.log(whiteList.indexOf(to.path))
    // return
    // 没登录的如果在白名单内，可以跳转
    if (whiteList.indexOf(to.path) != -1) {
      next()
    } else {
      // 没登录的如果不在白名单内，跳登录
      next(`/login?redirect=${to.path}`)
    }
  }
})



router.afterEach(() => {
  // console.log('afterEach')
})