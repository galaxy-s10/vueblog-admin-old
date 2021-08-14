import request from './request'

// 获取前台信息
export function getFrontend() {
    return request({
        url: '/api/frontend/detail',
        method: 'get',
    })
}

// 更新前台信息
export function updateFrontend(data) {
    return request({
        url: '/api/frontend/update',
        method: 'put',
        data
    })
}

