// import { getAuth } from "@/api/auth";
// import { getRoleList } from "../../../api/role";
import { getAuth } from "../../../api/roleauth";
import router, { roleRoutes } from '../../../router/router';
import { login, getUserInfo } from "@/api/user";
import cache from '@/libs/cache'
const user = {
    // 加了命名空间，mutations,actions,getters都要带上模块名
    // （state加不加命名空间都要带模块名）
    namespaced: true,
    state: () => ({
        token: "",
        remember: false,    // 七天内免登陆
        roles: [],
        auth: [],
        username: "",
        id: "",
        status: "",
        avatar: "",
        title: "",
        addRoutes: []
    }),
    mutations: {
        setRoutes(state, payload) {
            state.addRoutes = payload
        },
        editRemember(state, payload) {
            state.remember = payload
        },
        setToken(state, { token, exp }) {
            state.token = token
            cache.setStorageExt("token", token, exp);
        },
        setUser(state, payload) {
            const { id, username, status, avatar, title } = payload
            state.id = id
            state.username = username
            state.avatar = avatar
            state.title = title
            state.status = status
        },
        setRole(state, payload) {
            state.roles = payload
        },
        setAuth(state, payload) {
            state.auth = payload
        },

    },
    actions: {
        // 生成权限路由
        generateRoutes({ commit, state }) {
            // 比较两数组是否有交集(返回true代表有交集)
            function hasMixin(a, b) {
                return a.length + b.length !== new Set([...a, ...b]).size
            }
            // 判断权限
            function hasPermission(route, roles) {
                if (route.meta && route.meta.roles) {
                    return hasMixin(route.meta.roles, roles)
                    // return roles.some(role => {
                    //     console.log(role);
                    //     route.meta.roles.includes(role)
                    // })
                } else {
                    return true
                }
            }
            // 递归权限路由
            function filterAsyncRoutes(routes, roles) {
                const res = []
                routes.forEach(route => {
                    const tmp = { ...route }
                    if (hasPermission(tmp, roles)) {
                        if (tmp.children) {
                            tmp.children = filterAsyncRoutes(tmp.children, roles)
                        }
                        res.push(tmp)
                    }
                })

                return res
            }
            let accessRoutes = filterAsyncRoutes(roleRoutes, state.roles)
            router.addRoutes(accessRoutes)
            commit('setRoutes', accessRoutes)
        },
        login({ state }, userInfo) {
            return new Promise((reslove, reject) => {
                login(userInfo).then(res => {
                    reslove(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取用户信息
        getUserInfo({ commit, state }) {
            // let res = cache.getStorageExt('token')
            return new Promise((resolve, reject) => {
                getUserInfo().then(res => {
                    const { userInfo } = res
                    console.log(userInfo)
                    commit('setUser', userInfo)
                    if (res.code == 0) {
                        reject('验证失败，请重新登录。')
                    } else {
                        resolve(userInfo)
                    }
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            })
        },
        // 获取用户角色以及权限
        getAuth({ commit, state }) {
            let id = state.id
            return new Promise((resolve, reject) => {
                getAuth(id).then(res => {
                    const { count, rows } = res
                    if (count == 0) {
                        reject({ message: '你没有任何权限！' })
                    } else {
                        let role = []
                        let auth = []
                        rows[0].user.roles.forEach(item => {
                            role.push(item.role_name)
                        });
                        rows[0].user.roles.forEach(item => {
                            item.auths.forEach(val => {
                                auth.push(val.auth_name)
                            })
                        });
                        commit("setRole", role)
                        commit("setAuth", auth)
                        resolve(res)
                    }
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            })

        }
    }
}
export default user