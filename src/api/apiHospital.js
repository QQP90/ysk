import axios from '@/libs/api.request'
// 医院相关接口
export default class apiHospital {
  // 获取医院列表
  static search(params) {
    return axios.request({
      url: '/hospitalInfos',
      method: 'get',
      params: params
    })
  }
  // 获取单个医院的详细信息
  static getDetail(hospitalId) {
    return axios.request({
      url: `/hospitalInfos/${hospitalId}`,
      method: 'get'
    });
  }
  // 保存医院（新增及修改均适用）
  static save(data) {
    // 新增用post，修改用put
    let action = 'post'
    let path = '/hospitalInfos/add'
    if (data.id > 0) {
      action = 'put'
      path = '/hospitalInfos/update'
    }
    return axios.request({
      url: path,
      method: action,
      data: data
    })
  }
  // 删除医院
  static delete(id) {
    return axios.request({
      url: `/hospitalInfos/delete/${id}`,
      method: 'delete'
    })
  }

  // 获取医院地址
  static getAddresses(hospitalId) {
    return axios.request({
      url: `/hospitalAddress/${hospitalId}`,
      method: 'get'
    });
  }
  // 保存医院地址（新增及修改均适用）
  static saveAddress(data) {
    // 新增用post，修改用put
    let action = 'post'
    if (data.id > 0) {
      action = 'put'
    }
    return axios.request({
      url: '/hospitalAddress',
      method: action,
      data: data
    })
  }

  // 保存医院地址（新增及修改均适用）
  static auditHospital(params) {
    return axios.request({
      url: '/auditHospital',
      method: 'put',
      params,
    })
  }
}
