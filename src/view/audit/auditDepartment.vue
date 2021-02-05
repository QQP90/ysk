<template>
  <div class="audit-hospital">
     <div >
      <Form inline class=" form-header" ref="searchData" :model="searchParams" :label-width="60">
        <FormItem prop="id" label="科室名称">
          <Input  type="text" placeholder="科室名称" clearable v-model="searchParams.name" @on-enter="handleSearch"  />
        </FormItem>
        <FormItem prop="eqStatus" label="状态">
          <Select width="130" v-model="searchParams.status" placeholder="状态" @on-change="handleSearch">
            <Option value="">全部</Option>
            <Option value="1">正常</Option>
            <Option value="2">删除</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch()">查询</Button>
        </FormItem>
        <Button type="success" @click="handleNewDepartment" style="float: right;" title="新增科室"><span class="icon-xinzeng" @click="handleNewDepartment"></span>新增科室</Button>
      </Form>
       <Table  border stripe  :height="tableHeight" :columns="columns" :data="dataList"   :loading="loading" highlight-row></Table>
       <div class="box-footer">
         <Page :total="totalCount" :page-size="pageSize" :current="pageIndex" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-elevator show-total class="pageing" />
       </div>
       <div class="btn-footer"><Button type="primary" @click="handleConfirm()">确定</Button></div>
    </div>
    <!--新增科室-->
    <Modal :title="departmentFormTitle" v-model="isShowDepartmentForm" footer-hide v-if="hospital&&hospital.hospitalId">
      <department-edit-form :departmentInfo="currentDepartment" :hospitalId="hospital.hospitalId" @afterSaveSuccess="handleSuccessSaved"></department-edit-form>
    </Modal>

  </div>
</template>

<script>
  import apiDepartment from '@/api/apiDepartment'
  import { formatDate } from '@/utils/formatDate'
  import DepartmentEditForm from '../department/editForm.vue'


  export default {
    name: 'auditDepartment',
    components:{ DepartmentEditForm},
    props:{
      departmentData: {
        required: true,
        default:'',
      }
    },
    data () {
      return {
        tableHeight: document.documentElement.clientHeight - 325,
        columns: this.buildColumns(),
        dataList: [], //科室列表数据
        hospital:{},
        searchParams: {// 科室查询参数
          name:'',
          status: '',
        },
        pageSize: 20,
        pageIndex: 1,
        isShowDepartmentForm: false, // 是否显示科室表单弹窗
        currentDepartment: {}, //当前操作的科室
        loading: false,
        totalCount: 0, // 数量
        currentChoose: '', //当前选中的医院id
        currentChooseData:'',//当前选中的数据
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
      this.loadData(this.departmentData);
    },
    methods: {
      //科室列表
      loadData(hospital) {
        if (hospital) {
          this.hospital = hospital;
        }
        this.loading = true;
        apiDepartment.getList({
          eqHospitalId: this.hospital.hospitalId,
          name: this.searchParams.name,
          eqStatus: this.searchParams.status,
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          console.log('科室列表',res.data.data)
          this.loading = false;
          if(res && res.status == 200){
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
      handleSearch(){
          this.pageIndex = 1;
          this.loadData();
      },
      handleNewDepartment () {
        this.currentDepartment = {};
        this.isShowDepartmentForm = true;
      },
      // 保存成功后的操作
      handleSuccessSaved(newData) {
        this.loadData();
        this.isShowDepartmentForm = false;
      },

      initSerachPage(){
        this.pageIndex=1;
        this.pageSize=20;
      },
      changePage (value) {
        this.pageIndex = value
        this.loadData()
      },
      changePageSize (value) {
        this.pageSize = value
        this.loadData()
      },
      //确定
      handleConfirm(){
        let data=this.currentChooseData;
        if(!data){
          this.$Message.warning('请选择科室');
        }else{
           this.$emit('afterConfirm',data)
        }
      },
      buildColumns() {
        return [
          {
            title:' ',
            width: 60,
            align: 'center',
            render: (h, params) => {
              let id = params.row.id;
              let flag = false;
              if (this.currentChoose === id) {
                flag = true
              } else {
                flag = false
              }
              let self = this
              return h('div', [
                h('Radio',{
                  props:{
                    value:flag,
                  },
                  on:{
                    'on-change':() => {
                      self.currentChoose =id;
                      self.currentChooseData=params.row;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: 'ID',
            key: 'id',
            width:100
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
            minWidth: 120,
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
          }
        ];
      },
    },
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
  .audit-hospital .ivu-form-item{
    margin-top:0!important;
  }
  .audit-hospital .btn-footer{
     text-align: right;
  }


</style>
