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
        <FormItem label="时间">
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
      <Button type="success" @click="addRole">添加角色</Button>
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
      <roleMangeForm
        ref="systemLogFormView"
        :currentReloId="currentId"
        @afterSaveSuccess="afterSaveSuccess"
      ></roleMangeForm>
    </Modal>
  </div>
</template>

<script>
import apiSystem from "@/api/apiSystem";
import roleMangeForm from "./roleMangeForm";

export default {
  components: { roleMangeForm },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 265,
      searchHospitaldata: {},
      currentId: 0, // 当前操作的医院
      systemLogFormTitle: "角色编辑", // 表单弹窗标题
      isShowsystemLogForm: false, // 是否显示表单弹窗
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
          key: "id",
          align: "center",
          width: 80
        },
        {
          title: "用户",
          key: "name",
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
          title: "状态",
          key: "status",
          minWidth: 180,
          align: "center",
          render: (h, params) => {
            let st = "";
            if (params.row.status == 1) {
              st = "开启";
            }
            return h("div", st);
          }
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
                      this.currentId = params.row.id;
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
                      let id = params.row.id;
                      this.deleteRole(id);
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
        .AdminReloList({
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
          this.$Message.warning(err.message);
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
    },
    // 删除角色
    deleteRole(id) {
      apiSystem.deleteRole(id).then(res => {
        if (res.data.code == 200) {
          this.$Message.success("删除成功");
          this.loadSearchData();
        }
      });
    },
    addRole() {
      this.isShowsystemLogForm = true;
      this.currentId = 0;
      setTimeout(() => {
        this.$refs.systemLogFormView.allResourceTree();
      }, 200);
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
.toolbar-bottom {
  display: flex;
  justify-content: space-between;
}
</style>
