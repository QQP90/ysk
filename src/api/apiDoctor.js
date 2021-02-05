import axios from '@/libs/api.request'
// 医生相关接口
export default class apiDoctor {
  // 获取医生列表
  static search(params) {
    return axios.request({
      url: '/doctorInfos',
      method: 'get',
      params: params
    })
  }
  // 获取医生基本信息
  static getDetail(doctorId) {
    return axios.request({
      url: `/doctorInfo/${doctorId}`,
      method: 'get'
    })
  }
  // 获取医生扩展信息
  static getExpandInfo(doctorId) {
    return axios.request({
      url: `/doctorInfoExpand/${doctorId}`,
      method: 'get'
    })
  }
  // 保存医生（新增及修改均适用）
  static save(data) {
    // 新增用post，修改用put
    let action = 'post'
    let path = '/doctorInfo/add'
    if (data.doctorInfo.id > 0) {
      action = 'put'
      path = '/doctorInfo/update'
    }
    return axios.request({
      url: path,
      method: action,
      data: data
    })
  }
  // 保存医生的扩展信息
  static saveExpandInfo(data) {
    return axios.request({
      url: '/doctorInfoExpand/addorup',
      method: 'put',
      data: data
    })
  }
  // 获取医生所属的科室列表
  static getDepartmentOfDoctor(params) {
    return axios.request({
      url: '/doctorInfo/listLabDoctorRelation',
      method: 'get',
      params: params
    })
  }
  // 绑定医生科室
  static addDepartmentRelation(data) {
    return axios.request({
      url: '/doctorInfo/addLabDoctorRelation',
      method: 'post',
      params: data
    })
  }
  // 解除绑定医生科室
  static deleteDepartmentRelation(id) {
    return axios.request({
      url: '/doctorInfo/deleteLabDoctorRelation',
      method: 'delete',
      params: {
        id: id
      }
    })
  }
  // 获取医生的标签
  static getTagsOfDoctor(params) {
    return axios.request({
      url: '/doctorTagRelation',
      method: 'get',
      params: params
    })
  }
  // 更新医生的标签
  static setTagsOfDoctor(data) {
    return axios.request({
      url: '/doctorTagRelation/update',
      method: 'post',
      params: data
    })
  }
  // 获取医生审核信息(即修改前修改后数据)
  static getAuditInfo(doctorId) {
    return axios.request({
      url: `/doctorInfoAudit/${doctorId}`,
      method: 'get'
    })
  }
  // 审核医生资料
  static audit(data) {
    return axios.request({
      url: '/doctorInfoAudit/audit',
      method: 'post',
      params:data
    })
  }

  // 获取待审核医生列表
  static getAuditList(params) {
    return axios.request({
      url: '/doctorInfoAudits',
      method: 'get',
      params: params
    })
  }

  // 更新审核表：当且仅当：医生有效时：同步主表
  static saveAudit(data) {
    return axios.request({
      url: '/doctorInfoAudit/update',
      method: 'put',
      data: data
    })
  }
  // 更新审核表：当且仅当：医生有效时：同步主表
  static PostDoctorHome(data) {
    return axios.request({
      url: '/doctorHome/addorup',
      method: 'post',
      data: data
    })
  }
  // 更新审核表：当且仅当：医生有效时：同步主表
  static GetDoctorHome(id) {
    return axios.request({
      url: '/doctorHome/' + id,
      method: 'get'
    })
  }
  //选择医生 selectDoctor
  static selectDoctor(params) {
    return axios.request({
      url: '/doctorList',
      method: 'get',
      params
    })
  }
  //医生职业
  static tagInfo() {
    return axios.request({
      url: '/tagInfo/',
      method: 'get'
    })
  }
   //重新绑定医生
   static updateId(data) {
    return axios.request({
      url: '/memberId/yykid/outdoctorid',
      method: 'put',
      params:data
    })
  }
   //重新绑定医生
   static repeatDoctorInfo(params) {
    return axios.request({
      url: 'repeat/DoctorInfo/'+params,
      method: 'get',
    })
  }
}
