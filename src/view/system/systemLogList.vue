<template>
  <div class="app-container">
    <div class="toolbar-top">
      <Form
        inline
        ref="searchData"
        :model="searchHospitaldata"
        :label-width="50"
      >
        <FormItem label="ID" style="width:300px;">
          <Input
            type="text"
            placeholder="ID"
            clearable
            v-model="searchHospitaldata.logId"
            @on-enter="handleSearch"
          />
        </FormItem>
         <FormItem label="用户" style="width:300px;">
          <Input
            type="text"
            placeholder="用户"
            clearable
            v-model="searchHospitaldata.createName"
            @on-enter="handleSearch"
          />
        </FormItem>
        <FormItem  label="时间">
         <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 200px"
            @on-change="handleModifyTime"
          ></Date-picker>
        </FormItem>
 

        <FormItem>
          <Button type="primary" @click="handleSearch">查询</Button>
        </FormItem>
      </Form>
    </div>

    <Table
      stripe
      :height="tableHeight"
      :columns="columns"
      :data="systemLogoData"
      class="main-content"
      :loading="loading"
    ></Table>
    <div class="toolbar-bottom">
   
      <div class="paging-box">
        <Page
          :total="dataCount"
          :page-size="pageSize"
          :current="pageIndex"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          show-total
          show-sizer
          show-elevator
          class="pageing"
        />
      </div>
    </div>
    <Modal
      title="查看大图"
      v-model="isShowBigImage"
      class-name="fl-image-modal"
    >
      <img :src="currentImage" v-if="isShowBigImage" style="width: 100%" />
    </Modal>

    <Modal
      :title="systemLogFormTitle"
      width="80%"
      footer-hide
      v-model="isShowsystemLogForm"
    >
      <systemLogForm
        ref="systemLogFormView"
        :currentsystemLogId="currentsystemLog.id"
        @afterSaveSuccess="afterSaveSuccess"
      ></systemLogForm>
    </Modal>
  </div>
</template>

<script>
// import apiHospital from "@/api/apiHospital";
import apiSystem from "@/api/apiSystem";
import { formatDate } from "@/utils/formatDate";
import ConstData from "@/utils/constData";
import systemLogForm from "./systemLogForm";

export default {
  components: { systemLogForm },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 265,
      searchHospitaldata: {},
      allGrades: ConstData.arrayHospitalGrade, // 所有医院等级
      currentsystemLog: {}, // 当前操作的医院
      systemLogFormTitle: "日志详情", // 医院表单弹窗标题
      isShowsystemLogForm: false, // 是否显示医院表单弹窗
      currentAddressInfo: {}, // 当前操作的医院地址信息
      isShowDoctorForm: false, // 是否显示当前医院医生表单弹窗
      doctorFormTitle: "医生列表", // 医生列表表单弹窗标题
      loading: true,
      currentImage: "",
      isShowBigImage: false,
      columns: this.buildColumns(),
      systemLogoData: [], // 医院数据列表
      dataCount: 0,
      pageSize: 20,
      pageIndex: 1,
      testData: []
    };
  },
  mounted() {
    this.loadSearchData();
  },

  methods: {
    buildColumns() {
      return [
        {
          title: "ID",
          key: "id",
          align: "center",
          width: 80
        },
        {
          title: "用户",
          key: "createName",
          width: 120,
          align: "center"
        },

        {
          title: "描述",
          key: "description",
          minWidth: 180,
          align: "center"
        },
        {
          title: "时间",
          key: "createTime",
          minWidth: 180,
          align: "center"
        },
        {
          title: "操作",
          width: 160,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "control-box r-row"
                }
              },
              [
                h("span", {
                  attrs: {
                   class: "icon-chakan font-icon",
                    title: "查看详情"
                  },
                  on: {
                    click: () => {
                      this.currentsystemLog = params.row;
                      this.isShowsystemLogForm = true;
                      setTimeout(() => {
                        this.$refs.systemLogFormView.getList()
                      }, 200);
             
                    }
                  }
                })
              ]
            );
          }
        }
      ];
    },
    // 查看大图
    handleView(url) {
      this.currentImage = url;
      this.isShowBigImage = true;
    },
    loadSearchData() {
      this.loading = true;
      apiSystem
        .AdminOperaLog({
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          ...this.searchHospitaldata
        })
        .then(res => {
          this.loading = false;
          if (res && res.status == 200) {
               if (res.data.code == 405) {
              this.$Message.error("该用户没有此权限");
              return;
            }
            this.dataCount = res.data.data.total;
            this.systemLogoData = res.data.data.list;
          }
        })
        .catch(err => {
          this.loading = false;
          this.$Message.warning(err.message)
        });
    },
    handleGradeSelect() {
      this.initSerachPage();
      this.loadSearchData();
    },
    handleStatusSelect() {
      this.initSerachPage();
      this.loadSearchData();
    },
    afterSaveSuccess() {
      this.isShowsystemLogForm = false;
      this.loadSearchData();
    },
    initSerachPage() {
      this.pageIndex = 1;
      this.pageSize = 20;
    },
    changePage(value) {
      this.pageIndex = value;
      this.loadSearchData();
    },
    changePageSize(value) {
      this.pageSize = value;
      this.pageIndex = 1;
      this.loadSearchData();
    },
      //修改时间
    handleModifyTime(value) {
      this.searchHospitaldata.minCreateTime = value[0];
      this.searchHospitaldata.maxCreateTime = value[1];
      this.handleSearch();
    },
    handleSearch() {
      this.pageIndex = 1;
      this.pageSize = 20;
      this.loadSearchData();
    }
  }
};
</script>

<style lang="less" scoped>
.toolbar-top {
  display: flex;
  justify-content: flex-start;

  .search-bar {
    flex: 1;
  }
  .action-bar {
    width: 200px;
    text-align: right;
  }
}
.form-c {
  background: #fff;
  padding: 10px;
}
.box-footer {
  width: 100%;
  padding: 10px 0;
  position: relative;
}
.pageing {
  float: right;
  padding-right: 20px;
}
.alias-name {
  color: #666;
  padding-top: 2px;
  border-top: 1px solid #ccc;
}
.control-box {
  float: left;
  line-height: 30px;
}
</style>
