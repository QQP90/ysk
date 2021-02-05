<template>
  <div class="app-container">
    <div class="toolbar-top">
      <Form
        inline
        ref="searchData"
        :model="searchHospitaldata"
        :label-width="50"
      >
        <FormItem label="关键字" style="width:300px;">
          <Input
            type="text"
            placeholder="医院ID、名称、别名"
            clearable
            v-model="searchHospitaldata.keyword"
            @on-enter="handleSearch"
          />
        </FormItem>
        <FormItem prop="grade" label="等级">
          <Select
            width="130"
            v-model="searchHospitaldata.grade"
            @on-change="handleGradeSelect"
          >
            <Option value="">全部</Option>
            <Option v-for="item in allGrades" :key="item.id" :value="item.id">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="status" label="状态">
          <Select
            v-model="searchHospitaldata.status"
            @on-change="handleStatusSelect"
          >
            <Option value="">全部</Option>
            <!--  <Option value="0">待审核</Option>-->
            <Option value="1">正常</Option>
            <Option value="0">待审核</Option>
            <Option value="2">删除</Option>
            <!-- <Option value="3">未通过</Option>-->
          </Select>
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
      :data="hospitalData"
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
      title="审核医生资料修改"
      width="60%"
      :styles="{ top: '20px' }"
      v-model="isShowAuditModal"
      footer-hide
    >
      <auditView
        :HId="currentHospital.id"
        @close="handleCancel"
        ref="auditView"
      ></auditView>
    </Modal>
  </div>
</template>

<script>
import {
  getHospitalInfo,
  getHospitalAddress,
  deleteHospitalInfos,
  getHospitalClass
} from "@/api/data";
import apiHospital from "@/api/apiHospital";
import { formatDate } from "@/utils/formatDate";
import ConstData from "@/utils/constData";
import expandInfo from "./expand-info";
import auditView from "./audit";

export default {
  components: { expandInfo, auditView },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 265,
      searchHospitaldata: {
        grade: "",
        keyword: "",
        status: ""
      },
      currentHospital: {},
      isShowAuditModal: false, //审核页面
      allGrades: ConstData.arrayHospitalGrade, // 所有医院等级
      isShowDepartmentListModal: false, // 是否显示科室列表弹窗
      hospitalFormTitle: "新增医院", // 医院表单弹窗标题
      currentAddressInfo: {}, // 当前操作的医院地址信息
      loading: true,
      currentImage: "",
      isShowBigImage: false,
      columns: this.buildColumns(),
      hospitalData: [], // 医院数据列表
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
          type: "expand",
          width: 20,
          render: (h, params) => {
            return h(expandInfo, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          title: "ID",
          key: "id",
          align: "center",
          width: 80
        },
        {
          title: "Logo",
          key: "headPortrait",
          width: 120,
          align: "center",
          render: (h, params) => {
            let imgstr = "";
            // 表格列显示文字
            if (params.row.pic == null) {
              imgstr = "https://image.39.net/index/images/logo.png";
            } else {
              imgstr = params.row.pic;
            }
            return h(
              "div",
              {
                attrs: {
                  class: "hospital-logo r-row"
                }
              },
              [
                h("img", {
                  attrs: {
                    src: imgstr
                  },
                  on: {
                    click: e => {
                      this.handleView(e.srcElement.currentSrc);
                    }
                  }
                })
              ]
            );
          }
        },

        {
          title: "医院名称",
          key: "name",
          minWidth: 180,
          tooltip: true,
          render: (h, params) => {
            let items = [
              h(
                "a",
                {
                  domProps: {
                    title: params.row.name
                  },
                  on: {
                    click: () => {
                      window.open(params.row.website);
                    }
                  }
                },
                params.row.name
              )
            ];
            if (params.row.alias) {
              items.push(
                h(
                  "div",
                  {
                    domProps: {
                      class: "alias-name"
                    }
                  },
                  "（" +
                    params.row.alias.replace(new RegExp(/,/g), " ， ") +
                    "）"
                )
              );
            }
            return h("div", items);
          }
        },
        {
          title: "等级",
          key: "grade",
          width: 120,
          align: "center",
          render: (h, params) => {
            let gradeName = ConstData.getHospitalGradeName(params.row.grade);
            return h("div", gradeName);
          }
        },
        {
          title: "性质",
          align: "center",
          minWidth: 30,
          tooltip: true,
          render: (h, params) => {
            let natureName = ConstData.getHospitalNatureName(params.row.nature);
            return h("div", natureName);
          }
        },
        {
          title: "医院类型",
          minWidth: 80,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let typeName = ConstData.getHospitalTypeName(
              params.row.hospitalType
            );
            return h("div", typeName);
          }
        },
        {
          title: "医院总机",
          key: "telExchange",
          align: "center",
          minWidth: 130,
          tooltip: true
        },
        {
          title: "最近修改",
          key: "modifyTime",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h("div", params.row.modifyUser),
              h("div", params.row.modifyTime)
            ]);
          }
        },
        {
          title: "状态",
          width: 120,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.status === 1
                ? "success"
                : row.status === 2
                ? "error"
                : "warning";
            const text =
              row.status === 1 ? "正常" : row.status === 2 ? "删除" : "未知";
            //                         const text =ConstData.getStatusName(row.status);
            //
            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color: color
                }
              },
              text
            );
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
                    class: "icon-shenhe font-icon",
                    title: "审核医院"
                  },
                  on: {
                    click: () => {
                      this.currentHospital = params.row;
                      this.isShowAuditModal = true;
                      setTimeout(() => {
                        this.$refs.auditView.loadAuditInfo();
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
    handleDelete(hospital) {
      this.$Modal.confirm({
        title: "提示",
        content: `确认删除医院：${hospital.name}？`,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          apiHospital
            .delete(hospital.id)
            .then(res => {
              let d = res.data;
              if (d.code === 200) {
                this.$Message.success("删除成功");
                // 重新查询数据
                this.loadSearchData();
              } else {
                this.$Message.error(`删除失败：${d.message}`);
              }
            })
            .catch(err => {
              console.log(err);
              this.$Message.error(err.message);
            });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        }
      });
    },
    loadSearchData() {
      this.loading = true;
      apiHospital
        .search({
          keyWords: this.searchHospitaldata.keyword,
          grade: this.searchHospitaldata.grade,
          status: this.searchHospitaldata.status,
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        })
        .then(res => {
          this.loading = false;
          if (res && res.status == 200) {
               if (res.data.code == 405) {
              this.$Message.error("该用户没有此权限");
              return
            }
            this.pageIndex = res.data.data.pageNum;
            this.pageSize = res.data.data.pageSize;
            this.dataCount = res.data.data.total;
            this.hospitalData = res.data.data.list;
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
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

    initSerachPage() {
      this.pageIndex = 1;
      this.pageSize = 20;
    },
    cancel(value) {
      this.$emit("cancel");
      this.$refs[value].resetFields();
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
    },
    handleCancel() {
      this.isShowAuditModal = false;
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
