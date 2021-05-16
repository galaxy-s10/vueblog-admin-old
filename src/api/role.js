import request from './request'

// 获取角色列表
export function getRoleList() {
    return request({
        url: '/api/role/list',
        method: 'get',
    })
}

// 修改某个用户的角色
export function editUserRole(val) {
    return request({
        url: '/api/role/editUserRole',
        method: 'put',
        data: { ...val }
    })
}

// 修改某个角色的权限
export function editRoleAuth(val) {
    return request({
        url: '/api/role/editRoleAuth',
        method: 'put',
        data: { ...val }
    })
}

// 添加角色
export function addRole(data) {
    return request({
        url: '/api/role/addRole',
        method: 'post',
        data
    })
}

// 查询某个角色的父级
export function findParentRole(id) {
    return request({
        url: '/api/role/findParentRole',
        method: 'get',
        params: { id }
    })
}
// 查询某个角色的平行父级
export function findBrotherRole(id) {
    return request({
        url: '/api/role/findBrotherRole',
        method: 'get',
        params: { id }
    })
}

// 删除角色
export function deleteRole(id) {
    return request({
        url: '/api/role/deleteRole',
        method: 'delete',
        data: { id }
    })
}