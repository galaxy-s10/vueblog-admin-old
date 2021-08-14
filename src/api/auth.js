import request from './request'

// 获取权限列表
export function getAuthList() {
    return request({
        url: '/api/auth/list',
        method: 'get',
    })
}

// 获取某个用户的所有权限
export function getUserAuth(id) {
    return request({
        url: '/api/auth/getUserAuth',
        method: 'get',
        params: { id }
    })
}


// 查询某个权限的父级
export function findParentAuth(id) {
    return request({
        url: '/api/auth/findParentAuth',
        method: 'get',
        params: { id },
    })
}

// 修改某个权限
export function editAuth(data) {
    return request({
        url: '/api/auth/editAuth',
        method: 'put',
        data,
    })
}

// 新增权限
export function addAuth(data) {
    return request({
        url: '/api/auth/addAuth',
        method: 'post',
        data,
    })
}

// 删除权限
export function deleteAuth(id) {
    return request({
        url: '/api/auth/delAuth',
        method: 'delete',
        data: { id },
    })
}

