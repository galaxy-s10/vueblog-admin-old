import request from './request'

// 文章类型列表
export function getTypeList(params) {
    return request({
        url: '/api/type/pageList',
        method: 'get',
        params
    })
}

// 添加文章类型
export function addType(data) {
    return request({
        url: '/api/type/add',
        method: 'post',
        data
    })
}
// 修改文章类型
export function updateType(data) {
    return request({
        url: '/api/type/update',
        method: 'put',
        data
    })
}

// 删除文章类型
export function deleteType(id) {
    return request({
        url: "/api/type/delete",
        method: 'delete',
        data: {
            id
        }
    })
}