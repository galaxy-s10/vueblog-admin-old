import request from './request'

// 获取日志列表
export function getLogList(params) {
    return request({
        url: '/api/log/list',
        method: 'get',
        params
    })
}