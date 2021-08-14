import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/index.vue'
// import Layout from '../views/login'

Vue.use(VueRouter)

// 默认路由
export const defaultRoutes = [{
    // 如果只有一个children，则侧边栏会显示这个children，即最外层没必要有name
    // name: "admin",
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    // meta: {
    //     title: '首页',
    //     icon: 'ios-speedometer',
    // },
    children: [{
        name: "dashboard",
        path: '/dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: {
            title: '控制台',
            icon: 'ios-speedometer',
        }
    }]
},
{
    name: "error",
    path: '/error',
    component: Layout,
    // redirect: '/error/404',
    // component: () => import('@/views/error'),
    meta: {
        title: '异常页面',
        icon: 'ios-information-circle',
    },
    children: [{
        name: "authError",
        path: '/error/401',
        component: () => import('@/views/error/401/index'),
        meta: {
            title: '权限错误',
        },
    },
    {
        name: "notFound",
        path: '/error/404',
        component: () => import('@/views/error/404/index'),
        // component: () => import('@/views/testPage'),
        meta: {
            title: '页面不存在',
        },
    },
    {
        name: "serverError",
        path: '/error/500',
        component: () => import('@/views/error/500/index'),
        meta: {
            title: '服务器错误',
        },
    },
    ]
},
{
    path: '/debug',
    component: Layout,
    redirect: '/debug/debugs',
    children: [{
        name: "debugs",
        path: '/debug/debugs',
        component: () => import('@/views/debug/index'),
        meta: {
            title: '调试',
            icon: 'ios-bug'
        },
    },]
},
{
    path: '/logManage',
    component: Layout,
    redirect: '/logManage/logList',
    children: [{
        name: "logList",
        path: '/logManage/logList',
        component: () => import('@/views/logManage/list/index'),
        meta: {
            title: '日志列表',
            icon: 'ios-paw',
        }
    }]
},
{
    path: '/login',
    name: 'adminlogin',
    hidden: true,
    meta: {
        title: '后台登录',
        icon: 'md-lock'
    },
    component: () => import('@/views/login/index'),
},

]


// 权限路由
export const roleRoutes = [{
    name: "setting",
    path: '/setting',
    component: Layout,
    meta: {
        title: '设置',
        icon: 'ios-settings',
    },
    children: [{
        name: "frontendList",
        path: '/setting/frontendManage',
        // 子路由的router-view
        component: () => import('@/views/setting'),
        meta: {
            title: '前台设置',
            roles: ['developer'],
        },
        children: [{
            name: "basicSetting",
            path: '/setting/frontendManage/basicSetting',
            component: () => import('@/views/setting/frontend/basic'),
            meta: {
                title: '基本设置',
            },
        },
        {
            name: "advancedSetting",
            path: '/setting/frontendManage/advancedSetting',
            component: () => import('@/views/setting/frontend/advanced'),
            meta: {
                title: '高级设置',
            },
        },
        ]
    },
    {
        name: "backendManage",
        path: '/setting/backendManage',
        component: () => import('@/views/setting'),
        meta: {
            title: '后台设置',
        },
        children: [{
            name: "profile",
            path: '/setting/backendManage/profile',
            component: () => import('@/views/setting/backend/profile'),
            meta: {
                title: '账号信息',
            },
        },
        {
            name: "security",
            path: '/setting/backendManage/security',
            component: () => import('@/views/setting/backend/security'),
            meta: {
                title: '修改密码',
            },
        },
        ]
    },
    {
        name: "frontMangage",
        path: '/setting/theme',
        component: () => import('@/views/setting/theme'),
        meta: {
            title: '主题设置',
        },
    },
    ]
},
{
    name: "articleManage",
    path: '/articleManage',
    component: Layout,
    meta: {
        title: '文章管理',
        icon: 'ios-create',
    },
    children: [{
        name: "articleList",
        path: '/articleManage/articleList',
        component: () => import('@/views/articleManage/list/index'),
        meta: {
            title: '文章列表',
        }
    },
    {
        name: "addArticle",
        path: '/articleManage/addArticle',
        component: () => import('@/views/articleManage/add/index'),
        meta: {
            title: '增加文章',
        }
    },
    {
        name: "updateArticle",
        path: '/articleManage/updateArticle/:id',
        hidden: true,
        component: () => import('@/views/articleManage/update/index'),
        meta: {
            title: '修改文章',
            roles: ['developer'],
        }
    },
    ]
},
{
    path: '/commentManage',
    component: Layout,
    children: [{
        name: "commentList",
        path: '/commentManage/commentList',
        component: () => import('@/views/commentManage/list/index'),
        meta: {
            title: '留言列表',
            icon: 'ios-chatbubbles',
        }
    }]
},
{
    name: "tagManage",
    path: '/tagManage',
    component: Layout,
    meta: {
        title: '标签管理',
        icon: 'ios-pricetags',
    },
    children: [{
        name: "tagList",
        path: '/tagManage/tagList',
        component: () => import('@/views/tagManage/list/index'),
        meta: {
            title: '标签列表',
        }
    },
    {

        name: "addTag",
        path: '/tagManage/addTag',
        component: () => import('@/views/tagManage/add/index'),
        meta: {
            title: '添加标签',
            roles: ['developer'],
        }
    },
    {
        // name: "hiddenTag",
        // 如果用了hidden，需要填一个路径，不然会报警告
        /**
         * [vue-router] Named Route 'linkManage' has a default child route. 
         * When navigating to this named route (:to="{name: 'linkManage'"),
         * the default child route will not be rendered. 
         * Remove the name from this route and use the name of the default child route for named links instead.
         */
        hidden: true,
        path: '/tagManage/hiddenTag',
    },
    ]
},
{
    name: "linkManage",
    path: '/linkManage',
    component: Layout,
    meta: {
        title: '友链管理',
        icon: 'ios-link',
    },
    children: [{
        name: "linkList",
        path: '/linkManage/linkList',
        component: () => import('@/views/linkManage/list/index'),
        meta: {
            title: '友链列表',
        }
    },
    {
        name: "addLink",
        path: '/linkManage/addLink',
        component: () => import('@/views/linkManage/add/index'),
        meta: {
            title: '添加友链',
            roles: ['developer'],
        }
    },
    {
        // 如果children里只有一个值，就只会显示这个值而不会显示父级
        // 如果需要children里面只有一个值也要显示父级的话，可以通过添加一个隐藏的值进行占位
        hidden: true,
        path: "/linkManage/hiddenLink"
    },
    ]
},
{
    name: "authManage",
    path: '/authManage',
    component: Layout,
    meta: {
        title: '权限管理',
        icon: 'ios-lock',
    },
    children: [{
        name: "userList",
        path: '/userManage/userList',
        component: () => import('@/views/userManage/list/index'),
        meta: {
            title: '用户管理',

        }
    },
    {
        name: "roleList",
        path: '/roleManage/roleList',
        component: () => import('@/views/roleManage/list/index'),
        meta: {
            title: '角色管理',
        }
    },
    {
        name: "authList",
        path: '/authManage/authList',
        component: () => import('@/views/authManage/list/index'),
        meta: {
            title: '权限管理',
        }
    },
    ]
},
{
    name: "musicManage",
    path: '/musicManage',
    component: Layout,
    meta: {
        title: '音乐管理',
        icon: 'ios-musical-notes',
    },
    children: [{
        name: "musicList",
        path: '/musicManage/list',
        component: () => import('@/views/musicManage/list/index'),
        meta: {
            title: '音乐列表',
        },
    },
    {
        name: "updateMusic",
        path: '/musicManage/update/:id',
        hidden: true,
        component: () => import('@/views/musicManage/update/index'),
        meta: {
            title: '修改音乐',
            roles: ['developer']
        },
    },
    {
        name: "uploadMusic",
        path: '/musicManage/upload',
        component: () => import('@/views/musicManage/upload/index'),
        meta: {
            title: '新增音乐',
            roles: ['developer']
        },
    },
    {
        hidden: true,
        path: '/musicManage/hiddenMusic',
    }
    ]
},
{
    name: "qiniuManage",
    path: '/qiniuManage',
    component: Layout,
    meta: {
        title: '七牛云',
        icon: 'ios-cloud',
    },
    children: [{
        name: "qiniuLlist",
        path: '/qiniuManage/list',
        component: () => import('@/views/qiniuManage/list/index'),
        meta: {
            title: '文件列表',
        },
    },
    {
        name: "uploadQiniu",
        path: '/qiniuManage/upload',
        component: () => import('@/views/qiniuManage/upload/index'),
        meta: {
            title: '上传文件',
            roles: ['developer']
        },
    },
    {
        hidden: true,
        path: '/qiniuManage/hiddenQiniu',
    }
    ]
},
{
    path: "*",
    redirect: "/404",
    hidden: true,
    // meta: {
    //     icon: "ios-podium-outline",
    //     title: "xxx",
    // },
    // component: () => import("@/views/error/401/index"),
},
]

const router = new VueRouter({
    // base: '/abc',
    mode: 'history',
    routes: [
        ...defaultRoutes,
        // ...roleRoutes
    ]
})

export default router