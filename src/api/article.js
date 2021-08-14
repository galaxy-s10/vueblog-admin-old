import request from './request'

// export function articleList(ordername, orderby) {
//   return request({
//     url: '/api/article',
//     method: 'get',
//     params: {
//       ordername,
//       orderby
//     }
//   })
// }
// export function articletypelist() {
//   return request({
//     url: '/api/article/typelist',
//     method: 'get',
//   })
// }
export function getArticleList(params) {
  return request({
    url: '/api/article/pageList',
    method: 'get',
    params
  })
}
export function findArticle(id) {
  return request({
    url: '/api/article/findOne',
    method: 'get',
    params:{
      id
    }
  })
}
export function addArticle(data) {
  return request({
    url: '/api/article/add',
    method: 'post',
    data
  })
}
export function updateArticle(data) {
  return request({
    url: '/api/article/update',
    method: 'put',
    data
  })
}
export function deleteArticle(id) {
  return request({
    url: '/api/article/delete',
    method: 'delete',
    data: {
      id
    }
  })
}
