import axios from '@/libs/api.request'
// 医院科室相关接口
export default class apiDepartment {
  // 获取医院科室列表
  static getList(params) {
    return axios.request({
      url: '/labInfos',
      method: 'get',
      params: params
    })
  }
  // 保存标签（新增及修改均适用）
  static save(data) {
    // 新增用post，修改用put
    let action = 'post'
    let path = "/labInfo/add"
    if (data.id > 0) {
      action = 'put'
      path = '/labInfo/update'
    }
    return axios.request({
      url: path,
      method: action,
      data: data
    })
  }
  // 获取科室类型列表
  static getTypeList(params) {
    return axios.request({
      url: '/labTypes',
      method: 'get',
      params: params
    })
  }
  // 保存科室类型
  static saveType(data) {
    // 新增用post，修改用put
    let action = 'post'
    let path = '/labType/add'
    if (data.id > 0) {
      action = 'put'
      path = '/labType/update'
    }
    return axios.request({
      url: path,
      method: action,
      data: data
    });
  }
  // 删除科室类型
  static deleteType(id) {
    return axios.request({
      url: `/labType/delete/${id}`,
      method: 'delete'
    });
  }

  //删除科室
  static deleteLab(id) {
    return axios.request({
      url: `/labInfo/delete/${id}`,
      method: 'delete'
    })
  }
}
