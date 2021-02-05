<template>
  <div class="audit-hospital">
     <div >
      <Form inline class=" form-header" ref="searchData" :model="searchHospitaldata" :label-width="60">
        <FormItem prop="id" label="关键字" style="width:300px;">
          <Input  type="text" placeholder="医院ID、名称、别名" clearable v-model="searchHospitaldata.keyword" @on-enter="handleSearch"  />
        </FormItem>
        <FormItem prop="grade" label="等级">
          <Select width="130" v-model="searchHospitaldata.grade" @on-change="handleGradeSelect">
            <Option value="">全部</Option>
            <Option v-for="item in allGrades" :key="item.id" :value="item.id">
              {{item.name}}
            </Option>
          </Select>
        </FormItem>
  <!--      <FormItem prop="status" label="状态">-->
  <!--        <Select v-model="searchHospitaldata.status" @on-change="handleStatusSelect">-->
  <!--          <Option value="">全部</Option>-->
  <!--          <Option value="1">正常</Option>-->
  <!--          <Option value="2">删除</Option>-->
  <!--        </Select>-->
  <!--      </FormItem>-->
        <FormItem>
          <Button type="primary" @click="handleSearch()">查询</Button>
        </FormItem>
        <Button type="success" @click="handleNewHospital" style="float: right;" title="新增医院" ><span class="icon-xinzeng"></span>新增医院</Button>
      </Form>
       <Table  border stripe  :height="tableHeight" :columns="columns" :data="dataList"   :loading="loading" highlight-row></Table>
       <div class="box-footer">
         <Page :total="totalCount" :page-size="pageSize" :current="pageIndex" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-elevator show-total class="pageing" />
       </div>
       <div class="btn-footer"><Button type="primary" @click="handleConfirm()">确定</Button></div>
    </div>
    <!--查看大图-->
    <Modal title="查看大图" v-model="isShowBigImage" class-name="fl-image-modal">
      <img :src="currentImage" v-if="isShowBigImage" style="width: 100%">
    </Modal>
    <!--新增医院-->
    <Modal :title="hospitalFormTitle"  width="80%" footer-hide v-model="isShowHospitalEditForm">
      <hospitalForm ref="hospitalFormView" :hospitalId="currentHospital.id" @afterSaveSuccess="afterSaveSuccess"></hospitalForm>
    </Modal>

  </div>
</template>

<script>
  import ConstData from '@/utils/constData'
  import apiHospital from '@/api/apiHospital'
  import hospitalForm from '../hospital/editForm'

  export default {
    name: 'auditHospital',
    components:{ hospitalForm},
    data () {
      return {
        tableHeight: document.documentElement.clientHeight - 325,
        allGrades: ConstData.arrayHospitalGrade, // 所有医院等级
        currentHospital: {}, // 当前操作的医院
        hospitalFormTitle: '新增医院', // 医院表单弹窗标题
        isShowHospitalEditForm: false, // 是否显示医院表单弹窗
        searchHospitaldata: {
          grade: '',
          keyword: '',
          status: ''
        },
        loading: false,
        totalCount: 0, // 数量
        dataList: [], //医院列表数据
        pageSize: 20,
        pageIndex: 1,
        currentImage: '',//查看大图url
        isShowBigImage: false, //查看大图弹框是否可见
        columns: this.buildColumns(),
        currentChoose: '', //当前选中的医院id
        currentChooseHospital:'',//当前选中的医院
      }
    },
    computed: {

    },
    mounted () {

      this.handleSearch();
    },
    methods: {
      //新增医院
      handleNewHospital(){
        this.currentHospital = {
          id: 0
        };
        this.hospitalFormTitle = '新增医院';
        this.isShowHospitalEditForm = true;
      },
      //医院保存成功后
      afterSaveSuccess(){
        this.isShowHospitalEditForm = false;
        this.handleSearch();
      },
      //医院列表
      handleSearch () {
        this.loading = true;
        apiHospital.search({
          keyWords: this.searchHospitaldata.keyword,
          grade: this.searchHospitaldata.grade,
          status: this.searchHospitaldata.status,
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          console.log('getHospitalInfo', res)
          this.loading = false;
          if (res && res.status == 200) {
            this.pageIndex = res.data.data.pageNum
            this.pageSize = res.data.data.pageSize
            this.totalCount = res.data.data.total
            this.dataList = res.data.data.list
          }
        }).catch(err => {
          this.loading = false;
          console.log(err)
        })
      },
      handleNewDepartment () {

      },
      handleGradeSelect () {
        this.initSerachPage();
        this.handleSearch();
      },
      handleStatusSelect () {
        this.initSerachPage();
        this.handleSearch();
      },
      initSerachPage(){
        this.pageIndex=1;
        this.pageSize=20;
      },
      changePage (value) {
        this.pageIndex = value
        this.handleSearch()
      },
      changePageSize (value) {
        this.pageSize = value
        this.handleSearch()
      },
      // 查看大图
      handleView (url) {
        this.currentImage = url;
        this.isShowBigImage = true;
      },
      //确定
      handleConfirm(){
        let data=this.currentChooseHospital;
        if(!data){
          this.$Message.warning('请选择医院');
        }else{
           this.$emit('afterConfirm',data)
        }
      },
      buildColumns () {
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
                      self.currentChooseHospital=params.row;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: 'ID',
            key: 'id',
            width: 100
          },
          {
            title: 'Logo',
            key: 'headPortrait',
            minWidth: 80,
            tooltip: true,
            render: (h, params) => {
              let imgstr = ''
              //表格列显示文字
              if (params.row.pic == null) {
                imgstr = 'https://image.39.net/index/images/logo.png'
              } else {
                imgstr = params.row.pic
              }
              return h('div', {
                attrs: {
                  class: 'hospital-logo r-row',
                },
              }, [
                h('img', {
                  attrs: {
                    src: imgstr,
                  },
                  on: {
                    click: (e) => {
                      this.handleView(e.srcElement.currentSrc)
                    }
                  },
                }),
              ]);
            }
          },
          {
            title: '医院名称',
            key: 'name',
            minWidth: 80,
            tooltip: true
          },
          {
            title: '等级',
            key: 'grade',
            width: 120,
            tooltip: true,
            render: (h, params) => {
              let gradeName = ConstData.getHospitalGradeName(params.row.grade);
              return h('div', gradeName);
            }
          },
          {
            title: '性质',
            key: 'modifyTime',
            width: 150,
            tooltip: true,
            render: (h, params) => {
              let natureName = ConstData.getHospitalNatureName(params.row.nature);
              return h('div', natureName)
            }
          },
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
