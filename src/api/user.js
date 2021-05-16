import request from './request'

export function getUserList(params) {
  return request({
    url: '/api/user/pageList',
    method: 'get',
    params
  })
}

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/api/user/getuserinfo',
    method: 'get',
  })
}

export function findOne(id) {
  return request({
    url: '/api/user/findOne',
    method: 'get',
    params: {
      id
    }
  })
}

export function findDuplicate(data) {
  return request({
    url: '/api/user/findDuplicate',
    method: 'get',
    params: {
      ...data
    }
  })
}

export function findUser(id) {
  return request({
    url: '/api/user/findUser',
    method: 'get',
    params: {
      id
    }
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: '/api/user/delete',
    method: 'delete',
    data: { id }
  })
}

export function updateUser(data) {
  return request({
    url: '/api/user/update',
    method: 'put',
    data
  })
}

export function updateUserAndRole(data) {
  return request({
    url: '/api/user/updateUserAndRole',
    method: 'put',
    data
  })
}

export function updateUserStatus(data) {
  return request({
    url: '/api/user/updateStatus',
    method: 'put',
    data
  })
}

export function deleteuser(id) {
  return request({
    url: '/api/user/delete',
    method: 'delete',
    data: {
      id
    }
  })
}
