import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

//检查uid是否登录
export const checkLogin = () => {
  return axios.request({
    url:'/yskLogin',
    // url: '/checkLogin',
    method: 'get'
  })


}

export const getUserInfo = (url,data) => {
  return axios.request({
    url: url,
    data:data,
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

// 获取用户列表
export const  adminUserList= params => {
  return axios.request({
    url: '/adminUser/adminUserList',
    method: 'get',
    params,
  })
}
// 获取用户信息
export const  seleteAdminUser= id => {
  return axios.request({
    url: `/adminUser/seleteAdminUser/${id}`,
    method: 'get',
  })
}
// 删除用户
export const  deleteAdminUser= id => {
  return axios.request({
    url: `/adminUser/deleteAdminUser/${id}`,
    method: 'delete',
  })
}
// 修改用户
export const  updateAdminUser= data => {
  return axios.request({
    url: `/adminUser/updateAdminUser`,
    method: 'put',
    data
  })
}
// 获取角色树
export const  allRoleList= params => {
  return axios.request({
    url: `/adminUser/allRoleList/`+params,
    method: 'get',
  })
}
