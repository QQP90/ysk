<template>
   <div>
    <div class="wrapper-c" >
        <Form inline class="form-c form-header" ref="searchData" :model="searchParams">
            <FormItem prop="id" v-if="!hospital">
                <Input type="text" placeholder="医院ID" clearable v-model="searchParams.id" />
            </FormItem>
            <FormItem prop="name">
                <Input type="text" placeholder="科室名称" clearable v-model="searchParams.name" />
            </FormItem>
            <FormItem prop="eqStatus">
                <Select placeholder="状态" v-model="searchParams.status" @on-change="handleStatusSelect">
                    <Option value="">全部</Option>
                    <Option value="1">正常</Option>
                    <Option value="2">删除</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSearch()">查询</Button>
            </FormItem>
            <Button type="success" @click="handleNewDepartment" style="float: right;"><span class="icon-xinzeng"></span>新增科室</Button>
        </Form>
<!--        <div class="box-list">-->
          <Table  border stripe  :height="tableHeight" :columns="columns" :data="dataList"   :loading="loading"></Table>
<!--        </div>-->
        <Modal :title="departmentFormTitle" v-model="isShowDepartmentForm" footer-hide v-if="hospital&&hospital.id">
            <departmentEditForm :departmentInfo="currentDepartment" :hospitalId="hospital.id" @afterSaveSuccess="handleSuccessSaved"></departmentEditForm>
        </Modal>
    </div>
     <div class="box-footer">
       <Page :total="totalCount" :page-size="pageSize" :current="pageIndex" @on-change="changePage" @on-page-size-change="changePageSize"  show-total show-sizer show-elevator show-total class="pageing" />
     </div>
     <!--该科室的医生列表-->
     <Modal v-model="isShowDoctorForm" :title="doctorFormTitle" width="1160"   footer-hide>
       <doctor-list v-if="hospital"  :labId="currLabId"></doctor-list>
     </Modal>
   </div>
</template>

<script>
import apiDepartment from '@/api/apiDepartment'
import { formatDate } from '@/utils/formatDate'
import departmentEditForm from './editForm.vue'
import DoctorList from '../doctor/doctor-list.vue'
export default {
    components: { departmentEditForm,DoctorList },
    data() {
        return {
            tableHeight:document.documentElement.clientHeight - 325,
            hospital: null,
            searchParams: {
                status: ''
            }, // 科室查询参数
            loading: false,
            totalCount: 0, // 数量
            dataList: [], // 科室列表数据
            pageSize: 20,
            pageIndex: 1,
            columns: this.buildColumns(),
            isShowDepartmentForm: false, // 是否显示科室编辑弹窗
            currentDepartment: {},
            isShowDoctorForm:false, //是否显示医生表单弹窗
            doctorFormTitle:'医生列表',//医生表单弹窗标题
            currLabId:0,
        }
    },
    computed: {
        departmentFormTitle() {
            if (this.currentDepartment.id > 0) {
                return '编辑科室：' + this.currentDepartment.name;
            }
            return '新增科室';
        }
    },
    mounted () {

        // this.loadData();
    },
    methods: {
        buildColumns() {
            return [
                {
                    title: 'ID',
                    key: 'id',
                    width: 80
                },
                {
                    title: '科室名称',
                    key: 'name',
                    minWidth: 80,
                    tooltip: true
                },
                {
                    title: '科室类型',
                    key: 'labTypeName',
                    minWidth: 80,
                    tooltip: true
                },
                {
                    title: '状态',
                    key: 'status',
                    width: 120,
                    tooltip: true,
                    render: (h, params) => {
                        let type
                        switch(params.row.status){
                            case 0:
                            type = '无效'
                            break
                            case 1:
                            type = '正常'
                            return h('Tag', {props: {
                                    type: 'dot',
                                    color: 'success'
                                }}, type);
                            break
                            case 2:
                            type = '删除'
                            return h('Tag', {props: {
                                    type: 'dot',
                                    color: 'default'
                                }}, type);
                            break
                        }
                        return h('Tag', {props: {
                                    type: 'dot',
                                    color: 'warning'
                                }}, type);
                    }
                },
                {
                    title: '修改时间',
                    key: 'modifyTime',
                    width: 150,
                    tooltip: true,
                    render: (h, params) => {
                        let time = '';
                        //表格列显示文字
                        if (params.row.modifyTime !== null) {
                            time = formatDate(new Date(params.row.modifyTime), 'yyyy-MM-dd hh:mm:ss');
                        }
                        return h('div', time);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    render: (h, params) => {
                       let editButton=h('Button', {
                         props: {
                           type: 'info',
                           shape: 'circle',
                           size: 'small',
                           icon: 'md-create'
                         },
                         domProps:{
                           title: '编辑科室信息'
                         },
                         style: {
                           marginRight: '5px'
                         },
                         on: {
                           click: () => {
                             this.currentDepartment = Object.assign({},params.row);
                             this.isShowDepartmentForm = true;
                           }
                         }
                       });
                       let deleteButton=h('Button', {
                         props: {
                           type: 'dashed',
                           shape: 'circle',
                           size: 'small',
                           icon: 'md-close'
                         },
                         domProps:{
                           title: '删除该科室'
                         },
                         on: {
                           click: () => {
                             this.handleDelete(params.row.id)
                           }
                         }
                       });
                       let doctorButton=h('img',{
                        attrs:{
                          src:require('../../assets/images/doctor-icon.png'),
                          title:'查看该科室医生',
                          class:"doctor-icon",
                        },
                        on:{
                          click: () => {
                            this.currLabId=params.row.id;
                            this.doctorFormTitle ='【'+params.row.name+'】医生列表';
                            this.isShowDoctorForm=true;
                          }
                        },
                      });
                       let controlButton=params.row.status==1?[editButton,doctorButton,deleteButton]:[editButton,doctorButton];
                      return h('div',{
                        attrs:{
                          class:"r-row",
                        }},[controlButton])}
                }
            ];
        },
        loadData (hospital) {
            if (hospital) {
                this.hospital = hospital;
            }
            this.loading = true;
            apiDepartment.getList({
                eqHospitalId: this.hospital.id,
                name: this.searchParams.name,
                eqStatus: this.searchParams.status,
                pageNum: this.pageIndex,
                pageSize: this.pageSize
            }).then(res => {
                this.loading = false;
                if(res && res.status == 200){
                    console.log('getAllDepartment', res);
                    this.totalCount = res.data.data.total;
                    this.dataList = res.data.data.list;
                } else {
                    this.$Message.error(res.message);
                }
            }).catch(err => {
                this.loading = false;
                console.log(err)
            })
        },
        handleSearch() {
            this.pageIndex = 1;
            this.loadData();
        },
        handleStatusSelect(){
          this.handleSearch();
       },
        // 创建新科室
        handleNewDepartment() {
            this.currentDepartment = {};
            this.isShowDepartmentForm = true;
        },
        // 保存成功后的操作
        handleSuccessSaved(newData) {
            this.loadData();
            this.isShowDepartmentForm = false;
        },
        handleDelete (id) {
            this.$Modal.confirm({
                title: '提示',
                content: '是否确认删除本项',
                okText: '确定删除',
                cancelText: '取消',
                onOk: () => {
                  apiDepartment.deleteLab(id).then(res => {
                        console.log('res',res);
                        if(res.data.code && res.data.code == 200) {
                            this.$Message.success('删除成功')
                            // 重新查询数据
                            this.loadData();
                        }
                    }).catch(err => {
                        this.$Message.success(err.message)
                    })
                },
                onCancel: () => {
                    this.$Message.info('已取消')
                }
            })
        },
        changePage (value) {
            this.pageIndex = value
            this.loadData()
        },
        changePageSize (value) {
            this.pageSize = value
            this.loadData()
        }
    }
}
</script>

<style scoped>
.wrapper-c {
    background: #fff;
    padding-bottom: 30px;
    position: relative;
}
.ivu-form-item {
    margin-bottom: 10px;
}

.box-footer {
    width: 100%;
    padding: 10px 0;
    height: 60px;
}
.pageing {
    float: right;
    padding-right: 20px;
}
</style>
