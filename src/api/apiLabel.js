import axios from '@/libs/api.request'
// 医生标签相关接口
export default class apiLabel {
  // 获取标签列表
    static getList (params) {
        return axios.request({
            url: '/doctorTags',
            method: 'get',
            params: params
        })
    }
    // 保存标签（新增及修改均适用）
    static save (data) {
        // 新增用post，修改用put
        let action = 'post'
        let path = '/doctorTags/add'
        if (data.id > 0) {
            action = 'put'
            path = '/doctorTags/update'
        }
        return axios.request({
            url: path,
            method: action,
            data: data
        })
    }
    // 删除标签
    static deleteType(id) {
        return axios.request({
            url: `/doctorTags/delete/${id}`,
            method: 'delete'
        });
    }
}
