import request from './request'

export function updateQiniu(data) {
  console.log(data);
  return request({
    url: '/api/qiniu/updateQiniu',
    method: 'put',
    data
  })
}

export function getQiniuToken(user_id) {
  return request({
    url: '/api/qiniu/token',
    method: 'get',
    params: { user_id }
  })
}

export function deleteQiniu(filename) {
  return request({
    url: '/api/qiniu/delete',
    method: 'delete',
    data: {
      filename
    }
  })
}

export function getQiniuList(params) {
  return request({
    url: '/api/qiniu/pageList',
    method: 'get',
    params
  })
}

export function insertQiniu(data) {
  return request({
    url: '/api/qiniu/insert',
    method: 'post',
    data
  })
}

export function getAllQiniuData() {
  return request({
    url: '/api/qiniu/getAllQiniuData',
    method: 'get',
  })
}
