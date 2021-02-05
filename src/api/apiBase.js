import axios from '@/libs/api.request'
// 基础数据相关接口
export default class apiBase {
    // 获取所有地区
    static getAllAreas () {
        return axios.request({
            url: '/areaInfos/all',
            method: 'get'
        })
    }
}
