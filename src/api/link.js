import request from './request'

// 友链列表
export function getLinkList(params) {
    return request({
        url: '/api/link/pageList',
        method: 'get',
        params
    })
}

//添加友链
export function addLink(data) {
    return request({
        url: '/api/link/add',
        method: 'post',
        data
    })
}
//修改友链
export function updateLink(data) {
    return request({
        url: '/api/link/update',
        method: 'put',
        data
    })
}

//删除友链
export function deleteLink(id) {
    return request({
        url: "/api/link/delete",
        method: 'delete',
        data: {
            id
        }
    })
}