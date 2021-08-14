import request from './request'

// 标签列表
export function getTagList(params) {
    return request({
        url: '/api/tag/pageList',
        method: 'get',
        params,
    })
}

// 修改标签
export function updateTag(data) {
    return request({
        url: '/api/tag/update',
        method: 'put',
        data
    })
}

// 添加标签
export function addTag(data) {
    return request({
        url: '/api/tag/add',
        method: 'post',
        data
    })
}

// 删除标签
export function deleteTag(id) {
    return request({
        url: '/api/tag/delete',
        method: 'delete',
        data: {
            id
        }
    })
}