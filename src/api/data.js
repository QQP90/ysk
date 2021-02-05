import axios from '@/libs/api.request'

export const getHospitalInfo = (url) => {
  return axios.request({
    url: url,
    method: 'get'
  })
}

export const getHospitalAddress = (url) => {
  return axios.request({
    url: url,
    method: 'get'
  })
}
export const getHospitalClass = (url) => {
  return axios.request({
    url: url,
    method: 'get'
  })
}
export const initCityList = (url) => {
  return axios.request({
    url: url,
    method: 'get'
  })
}

export const submitAddress = (url, data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}
export const deleteHospitalInfos = (url) => {
  return axios.request({
    url: url,
    method: 'delete'
  })
}

export const getAllDepartment = (url) => {
  return axios.request({
    url: url,
    method: 'get'
  })
}

export const getClassType = (url) => {
  return axios.request({
    url: url,
    method: 'get'
  })
}

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}
export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}


export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getAllDoctor = (url) => {
  return axios.request({
    url: url,
    method: 'get'
  })
}

export const getAllAddress = (url) => {
  return axios.request({
    url: url,
    method: 'get'
  })
}

export const deleteDepartmentInfos = (url) => {
  return axios.request({
    url: url,
    method: 'delete'
  })
}

export const deleteDoctorInfos = (url) => {
  return axios.request({
    url: url,
    method: 'delete'
  })
}

export const deleteClassTypeInfos = (url) => {
  return axios.request({
    url: url,
    method: 'delete'
  })
}

export const saveErrorLogger = info =>
{
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const getDoctorReview = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'get'
  })
}

export const subDoctorReview = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'get'
  })
}


export const getDoctorLabel = (url) => {
  return axios.request({
    url: url,
    method: 'get'
  })
}

export const addHospitalInfo = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}

export const addDoctorInfo = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}

export const addClassInfo = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}

export const addDoctorLabel = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}

export const addClassType = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}

export const editHospitalInfo = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'patch'
  })
}

export const editDoctorInfo = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'put'
  })
}

export const editClassType = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'put'
  })
}

export const editClassInfo = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'put'
  })
}


export const editLabelInfo = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'put'
  })
}

export const getDoctorTag = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'get'
  })
}

export const addDoctorTag = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}

export const deleteDoctorTag = (url , data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'delete'
  })
}

export const getAllDoctorTag = (url) => {
  return axios.request({
    url: url,
    method: 'get'
  })
}




