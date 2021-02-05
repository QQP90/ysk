<template>
  <div class="app-container">
    <div class="toolbar-top">
      <Form inline ref="searchData" :label-width="80">
        <FormItem label="名称:" style="width:300px;">
          <Input type="text" clearable v-model="resourceSearchData.name" />
        </FormItem>
        <FormItem label="上级名称:" style="width:300px;">
          <Input type="text" clearable v-model="resourceSearchData.pname" />
        </FormItem>
        <FormItem label="类型:" style="width:300px;">
          <i-select v-model="resourceSearchData.type" style="width:150px;">
            <i-option
              v-for="(item, index) in list"
              :value="item.value"
              :key="index"
              >{{ item.label }}</i-option
            >
          </i-select>
        </FormItem>
        <FormItem label="状态:" style="width:150px;">
          <i-select style="width:150px">
            <i-option
              v-for="(item, index) in statusList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</i-option
            >
          </i-select>
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
      :data="resourceData"
      class="main-content"
      :loading="loading"
    ></Table>
    <div class="toolbar-bottom">
      <Button type="success" @click="addResource">添加资源</Button>
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
      :title="resourceFormTitle"
      width="800px"
      footer-hide
      v-model="isShowResourceForm"
    >
      <resourceForm
        ref="resourceFormView"
        :resourceFormId="currentResourceId"
        @afterSaveSuccess="afterSaveSuccess"
      ></resourceForm>
    </Modal>
  </div>
</template>

<script>
import apiResource from "@/api/apiResource";

import resourceForm from "./resourceForm";

export default {
  components: { resourceForm },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 265,
      resourceSearchData: {},
      currentResourceId: 0, // 当前操作的资源
      resourceFormTitle: "资源编辑", // 表单弹窗标题
      isShowResourceForm: false, // 是否显示表单弹窗
      loading: true,
      currentImage: "",
      columns: this.buildColumns(),
      resourceData: [], // 数据列表
      dataCount: 0,
      pageSize: 20,
      statusList: [
        {
          value: 1,
          label: "开启"
        },
        {
          value: 0,
          label: "关闭"
        }
      ],
      list: [
        {
          value: 1,
          label: "菜单"
        },
        {
          value: 2,
          label: "功能"
        },
        {
          value: 3,
          label: "模块"
        }
      ],
      pageIndex: 1
    };
  },
  created() {
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
          title: "名称",
          key: "name",
          width: 120,
          align: "center"
        },

        {
          title: "上级名称",
          key: "pname",
          minWidth: 180,
          align: "center"
        },
        {
          title: "类型",
          minWidth: 180,
          align: "center",
          render: (h, params) => {
            let str = "";
            if (params.row.type == 1) {
              str = "菜单";
              return h("span", str);
            }
            if (params.row.type == 2) {
              str = "功能";
              return h("span", str);
            }
            if (params.row.type == 3) {
              str = "模块";
              return h("span", str);
            }
          }
        },
        {
          title: "状态",
          minWidth: 180,
          align: "center",
          render: (h, params) => {
            let status = params.row.status;
            let str = "";

            if (status == 1) {
              str = "开启";
              return h("span", str);
            } else {
              str = "关闭";
              return h("span", str);
            }
          }
        },
        {
          title: "时间",
          key: "logDt",
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
                      this.currentResourceId = params.row.id;
                      this.isShowResourceForm = true;
                      setTimeout(() => {
                        this.$refs.resourceFormView.getList(
                          this.currentResourceId
                        );
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
                      this.deleteAdminResource(id);
                    }
                  }
                })
              ]
            );
          }
        }
      ];
    },
    // 删除角色
    deleteAdminResource(id) {
      apiResource.deleteAdminResource(id).then(res => {
        if (res.data.code == 200) {
          this.$Message.success("删除成功");
          this.loadSearchData();
        }
      });
    },
    addResource() {
      this.isShowResourceForm = true;
      this.currentResourceId = 0;
    },

    loadSearchData() {
      this.loading = true;
      apiResource
        .adminResourceList({
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          ...this.resourceSearchData
        })
        .then(res => {
          this.loading = false;
          if (res && res.status == 200) {
            if (res.data.code == 405) {
              this.$Message.error("该用户没有此权限");
              return;
            }
            this.dataCount = res.data.data.total;
            this.resourceData = res.data.data.list;
          }
        })
        .catch(err => {
          this.loading = false;
          this.$Message.warning(err.message);
        });
    },
    afterSaveSuccess() {
      this.isShowResourceForm = false;
      this.loadSearchData();
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
.toolbar-bottom {
  display: flex;
  justify-content: space-between;
}
</style>
