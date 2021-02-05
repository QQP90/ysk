<template>
  <div class="wrapper-box">
  <div class="wrapper-c">
<!--  <div class="doctor-list form-box">-->
      <Form inline class="form-c" ref="searchData" :label-width="60" :model="searchModel">
         <FormItem prop="doctorId" label="医生ID">
           <Input type="text" placeholder="医生ID" clearable v-model="searchModel.doctorId" />
         </FormItem>
        <FormItem prop="status" label="状态">
          <Select placeholder="状态" v-model="searchModel.status" @on-change="handleStatusSelect">
            <Option value="">全部</Option>
            <Option value="0">待审核</Option>
            <Option value="1">正常</Option>
            <Option value="2">删除</Option>
            <Option value="3">未通过</Option>
          </Select>
        </FormItem>
        <FormItem>
           <Button type="primary" @click="handleSearch">查询</Button>
        </FormItem>
      </Form>
     <div class="header"></div>
     <Table stripe :height="tableHeight" :columns="columns" :data="doctorsData" class="main-content" :loading="loading"></Table>

  </div>
    <div class="box-footer">
      <Page  :total="dataCount" :page-size="pageSize" :current="pageIndex" show-sizer show-elevator  show-total  @on-change="changePage" @on-page-size-change="changePageSize" class="pageing"></Page>
    </div>
  </div>
</template>
<script>
 import apiDoctor from '@/api/apiDoctor';
 import ConstData from '@/utils/constData'

  export default {
    props: {
      hospitalId:{ //医院id
        type: Number,
        required: false,
        default: 0
      },
      labId:{ //科室id
        type:Number,
      },
      tagId:{ //标签id
        type:Number,
      },
    },
    data() {
      return {
        // tableHeight:document.documentElement.clientHeight - 265,
        tableHeight:document.documentElement.clientHeight - 325,
        columns:this.buildColumns(),
        doctorsData:[], //医生列表数据
        loading:true,
        dataCount: 0, // 数据总数
        pageSize: 20,
        pageIndex: 1,
        searchModel:{// 查询条件
          doctorId:null,
          hospitalId:null,
          hospitalName:'',
          labId:null,
          labName:'',
          name:'',
          status:null,
          tagId:null,
        },
      };
    },
    computed:{


    },
    watch:{
      hospitalId(){
        this.searchModel.hospitalId=this.hospitalId;
        this.pageIndex=1;
        this.loadDetail();

      },
      labId(){
        this.searchModel.labId=this.labId;
        this.pageIndex=1;
        this.loadDetail();
      },
      tagId(){
        this.searchModel.tagId=this.tagId;
        this.pageIndex=1;
        this.loadDetail();
      },

    },
    mounted() {

    },
    methods: {
      loadDetail(){
        this.loading=true;
        var doctorParams={
          doctorId:this.searchModel.doctorId,
          hospitalId:this.searchModel.hospitalId,
          hospitalName:this.searchModel.hospitalName,
          labId:this.searchModel.labId,
          labName:this.searchModel.labName,
          name:this.searchModel.name,
          status:this.searchModel.status,
          tagId:this.searchModel.tagId,
          pageNum:this.pageIndex,
          pageSize:this.pageSize,
        };
        apiDoctor.search(doctorParams).then(res => {
           this.loading=false;
           if(res && res.status==200){
               this.pageIndex=res.data.data.pageNum;
               this.pageSize=res.data.data.pageSize;
               this.dataCount=res.data.data.total;
               this.doctorsData=res.data.data.list;
           }
        }).catch(err => {
           this.loading=false;
           console.log(err);
        })


      },
      handleStatusSelect(){
        this.loadDetail();
      },
      handleSearch(){
        this.pageIndex=1;
        this.loadDetail();
      },
      changePage(value){
        this.pageIndex = value;
        this.loadDetail();
      },
      changePageSize (value) {
        this.pageSize = value;
        this.loadDetail();
      },

      buildColumns(){
        return [
          {
            title:'ID',
             key:'id',
              width:80,
          },
          {
            title:'头像',
             key:'headPortrait',
              width:120,
              render:(h,params) => {
                let imgstr = '';
                 if(params.row.headPortrait==null){
                   imgstr='https://image.39.net/daoyi/images/pics/default_ys.gif'
                 }else{
                   imgstr=params.row.headPortrait;
                 }
                 return h('div',{
                   attrs:{
                     class:'avatar-box r-row'
                   },
                 },[h('img',{
                    attrs:{
                      src:imgstr,
                    },
                    on:{
                      click:() => {

                      }
                    },
                 })]);
              }
          },{
            title:'姓名',
            key:'name',
            minWidth:120,
            render:(h,params) => {
              let data = params.row;
              let sexName = '未知';
              if (data.sex === 1) {
                sexName = '男';
              } else if(data.sex === 2) {
                sexName = '女';
              }
              return h('div', [
                h('p', [
                  h('strong', data.name)
                ]),
                h('p', ConstData.getClinicPositionName(data.clinicPosition)),
                h('p', data.labName),
                h('p', data.hospitalName)
              ])
            }
          },{
            title:'标签',
            key:'tagInfo',
            minWidth:160,
            render: (h, params) => {
              let tags = params.row.tagInfo;
              if (tags && tags.length > 0) {
                let tagList = [];
                tags.forEach(element => {
                  tagList.push(h('Tag', {
                      props: {
                        color: 'success'
                      }
                    }, element.tagName)
                  );
                });
                return h('div', tagList);
              }
              return h('div','-');
            }
          },
          {
            title:'通行证ID',
            key:'memberId',
            minWidth:60,
            render: (h,params) => {
              if(params.row.memberId){
                return h('div', params.row.memberId)
              }
              return h('div','-');
            }
          },
          {
            title:'来源',
            key:'source',
            width:80,
            render:(h,params) => {
              let sourceName = '';
              switch(params.row.source){
                case 0:
                  sourceName = '医生库数据'
                  break
                case 1:
                  sourceName = '就医助手'
                  break
                case 2:
                  sourceName = '通行证'
                  break
                case 3:
                  sourceName = 'ask'
                  break
                case 4:
                  sourceName = '医信中心'
                  break
                default:
                  sourceName = '未知'
              }
              return h('div', sourceName);
            }
          },{
             title:'状态',
             key:'',
             width:130,
            tooltip: true,
            render:(h,params) => {
              let statusName = ConstData.getStatusName(params.row.status);
              switch(params.row.status){
                case 1:
                  return h('Tag', {
                    props: {
                      type: 'dot',
                      color: 'success'
                    }
                  }, '正常');
                case 2:
                  return h('Tag', {
                    props: {
                      type: 'dot',
                      color: 'default'
                    }
                  }, '删除');
                case 0:
                  return h('Tag', {
                    props: {
                      type: 'dot',
                      color: 'warning'
                    }
                  }, '待审核');
                case 3:
                  return h('Tag', {
                    props: {
                      type: 'dot',
                      color: 'error'
                    }
                  }, '未通过');
                default:
                  return '未知';
              }

              return h('div',{
                domProps:{
                  title:type
                },
              },type)
            }
          },

        ];
      },


    }
  }
</script>
<style lang="less" scoped>
  .box-footer {
  width: 100%;
  padding: 10px 0;
  /*position: absolute;*/
  height: 60px;
}
.pageing {
  float: right;
  padding-right: 20px;
}
  .ivu-table-body{
    padding-bottom:87px!important;
  }


</style>
