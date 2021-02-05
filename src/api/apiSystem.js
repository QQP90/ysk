import axios from '@/libs/api.request'

export default class apiSystem {
  // 查询日志列表
  static AdminOperaLog(params) {
    return axios.request({
      url: '/adminOperaLogs',
      method: 'get',
      params
    });

  }
  // 查询日志列表查询日志列表
  static AdminOperaLogId(id) {
    return axios.request({
      url: `/adminOperaLog/${id}`,
      method: 'get',
    });
  }
  // 角色列表
  static AdminReloList(params) {
    return axios.request({
      url: `/adminRole/adminRoleList`,
      method: 'get',
      params
    });
  }
  // 角色详情
  static AdminReloListiD(id) {
    return axios.request({
      url: `/adminRole/${id}`,
      method: 'get',
    });
  }
   // 角色添加
   static addRole(data) {
    return axios.request({
      url: `/adminRole/addRole`,
      method: 'post',
      data
    });
  }
  // 角色更新
  static updateRole(data) {
    return axios.request({
      url: `/adminRole/updateRole`,
      method: 'put',
      data
    });
  }
  // 删除角色
  static deleteRole(id) {
    return axios.request({
      url: `/adminRole/deleteRole/${id}`,
      method: 'delete',
    });
  }
  //  /adminUser/allRoleList	获取角色树
  static allResourceTree(params) {
    return axios.request({
      url: `/adminRole/allResourceList`,
      method: 'get',
      params
    });
  }
}
