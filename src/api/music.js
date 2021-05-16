import request from './request'

// 音乐列表
export function getMusicList(params) {
    return request({
        url: '/api/music/pageList',
        method: 'get',
        params
    })
}

// 查找音乐
export function findMusic(id) {
    return request({
        url: '/api/music/findOne',
        method: 'get',
        params: { id }
    })
}

// 添加音乐
export function addMusic(data) {
    return request({
        url: '/api/music/add',
        method: 'post',
        data
    })
}
// 修改音乐
export function updateMusic(data) {
    return request({
        url: '/api/music/update',
        method: 'put',
        data
    })
}

// 删除音乐
export function deleteMusic(id) {
    return request({
        url: "/api/music/delete",
        method: 'delete',
        data: {
            id
        }
    })
}