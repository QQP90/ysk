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
            v-model="searchHospitaldata.id"
            @on-enter="handleSearch"
          />
        </FormItem>
        <FormItem label="姓名" style="width:300px;">
          <Input
            type="text"
            placeholder="姓名"
            clearable
            v-model="searchHospitaldata.name"
            @on-enter="handleSearch"
          />
        </FormItem>
        <FormItem label="部门" style="width:300px;">
          <Input
            type="text"
            placeholder="部门"
            clearable
            v-model="searchHospitaldata.department"
            @on-enter="handleSearch"
          />
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
      <userMangeForm
        ref="systemLogFormView"
        :currentsystemLogId="currentsystemLog.ID"
        @afterSaveSuccess="afterSaveSuccess"
      ></userMangeForm>
    </Modal>
  </div>
</template>

<script>
import { adminUserList, deleteAdminUser } from "@/api/user";
import apiSystem from "@/api/apiSystem";

import userMangeForm from "./userMangeForm";

export default {
  components: { userMangeForm },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 265,
      searchHospitaldata: {},
      currentsystemLog: {}, // 当前操作的医院
      systemLogFormTitle: "用户编辑", // 医院表单弹窗标题
      isShowsystemLogForm: false, // 是否显示医院表单弹窗
      loading: true,
      currentImage: "",
      isShowBigImage: false,
      columns: this.buildColumns(),
      systemLogoData: [], // 数据列表
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
          key: "ID",
          align: "center",
          width: 80
        },
        {
          title: "UID",
          key: "UID",
          width: 120,
          align: "center"
        },

        {
          title: "姓名",
          key: "REALNAME",
          minWidth: 180,
          align: "center"
        },
        {
          title: "昵称",
          key: "PETNAME",
          minWidth: 180,
          align: "center"
        },
        {
          title: "部门",
          key: "DEPARTMENT",
          minWidth: 180,
          align: "center"
        },

        {
          title: "时间",
          key: "CREATE_TIME",
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
                    class: "icon-bianji font-icon",
                    title: "查看详情"
                  },
                  on: {
                    click: () => {
                      this.currentsystemLog = params.row;
                      this.isShowsystemLogForm = true;
                      setTimeout(() => {
                        this.$refs.systemLogFormView.getList();
                        this.$refs.systemLogFormView.allResourceTree();
                      }, 200);
                    }
                  }
                }),
                h("span", {
                  attrs: {
                    class: "icon-shanchu1 font-icon",
                    title: "删除"
                  },
                  on: {
                    click: () => {
                      let id = params.row.ID;
                      console.log(params.row, 9);
                      this.deleteUser(id);
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
    // 删除角色
    deleteUser(id) {
      deleteAdminUser(id).then(res => {
        if (res.data.code == 200) {
          this.$Message.success("删除成功");
          this.loadSearchData();
        }
      });
    },
    loadSearchData() {
      this.loading = true;
      adminUserList({
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        ...this.searchHospitaldata
      })
        .then(res => {
          this.loading = false;

          if (res && res.status == 200) {
             if (res.data.code == 405) {
              this.$Message.error("该用户没有此权限");
              return
            }
            this.dataCount = res.data.data.total;
            this.systemLogoData = res.data.data.list;
          }
        })
        .catch(err => {
          this.loading = false;
          this.$Message.error(err.message);
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
