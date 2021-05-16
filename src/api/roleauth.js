import request from './request'

// 获取某个用户的角色以及权限
export function getUserRoleAuth(id) {
    return request({
        url: '/api/roleauth/oneRoleAuth',
        method: 'get',
        params: { id }
    })
}

// 获取某个用户的角色以及权限
export function getAuth(id) {
    return request({
        url: '/api/roleauth/getUserAuth',
        method: 'get',
        params: { id }
    })
}

// 获取所有用户以及其角色列表
export function getUserRoleList(params) {
    return request({
        url: '/api/roleauth/userRoleList',
        method: 'get',
        params
    })
}

// 给某个角色新增权限
export function addAuthForRole(data) {
    return request({
        url: '/api/roleauth/addAuth',
        method: 'post',
        data,
    })
}