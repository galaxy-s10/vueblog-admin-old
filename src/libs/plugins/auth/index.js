import checkAuth from './checkAuth'
import store from '@/store'

export default {
    bind(el, binding) {
        // console.log('----------初始化--------------------');
    },
    inserted(el, binding) {
        // console.log(el);
        // console.log(binding);
        const {
            value
        } = binding
        // console.log(value);
        // console.log('this.state');
        // console.log(store);
        // console.log(store);
        const auths = store.state.user.auth
        if (value && auths) {
            const isPermission = checkAuth(auths, value)
            if (!isPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            console.log('这是不需要验证权限的路由，不移除');
            // throw new Error('缺少指令权限数据')
        }
    },
    update(el, binding) {
        // console.log('更新');
        // console.log(el);
        // console.log(binding);
    }
}