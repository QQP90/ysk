import axios from '@/libs/api.request'
export default class apiResource{
    // 资源列表页
  static adminResourceList(params){
      return axios.request({
        url:"/adminResource/adminResourceList",
        method:"get",
        params
      }) 
   }
 
    // 更新资源
    static updateAdminResource(data){
        return axios.request({
          url:"/adminResource/updateAdminResource",
          method:"put",
          data
        }) 
     }
     
         // 更新资源
    static addResource(data){
        return axios.request({
          url:"/adminResource/addResource",
          method:"post",
          data
        }) 
     }
    //  详情页
    static seleteAdminResource(id){
        return axios.request({
            url:`/adminResource/seleteAdminResource/${id}`,
            method:'get',   
        })
    }

    //  删除资源
    static deleteAdminResource(id){
        return axios.request({
          url:`/adminResource/deleteAdminResource/${id}`,
          method:"delete"
        }) 
     }
    
}