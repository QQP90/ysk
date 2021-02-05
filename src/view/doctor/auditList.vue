<template>
  <div class="app-container">
    <div class="toolbar-top">
      <Form inline :label-width="60" :model="searchModel">
        <FormItem prop="hospitalName" label="所属医院">
          <Input
            type="text"
            placeholder="医院名称"
            clearable
            v-model="searchModel.hospitalName"
          />
        </FormItem>
        <FormItem prop="name" label="姓名">
          <Input
            type="text"
            placeholder="医生姓名"
            clearable
            v-model="searchModel.name"
          />
        </FormItem>
        <FormItem prop="name" label="通行证ID">
          <Input
            type="text"
            placeholder="通行证ID"
            clearable
            v-model="searchModel.memberId"
          />
        </FormItem>
        <FormItem label="资质审核状态" :label-width="100">
          <Select
            placeholder="状态"
            v-model="searchModel.qualificationStatus"
            @on-change="handleStatusSelect"
          >
            <Option value="">全部</Option>
            <Option value="0">待审核</Option>
            <Option value="1">正常</Option>
            <Option value="2">删除</Option>
            <Option value="3">未通过</Option>
          </Select>
        </FormItem>
        <FormItem label="资料审核状态" :label-width="100">
          <Select
            placeholder="状态"
            v-model="searchModel.dataStatus"
            @on-change="handleStatusSelect"
          >
            <Option value="">全部</Option>
            <Option value="0">待审核</Option>
            <Option value="1">正常</Option>
            <Option value="2">删除</Option>
            <Option value="3">未通过</Option>
          </Select>
        </FormItem>
        <FormItem label="最近认证申请时间" :label-width="110">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 200px"
            @on-change="handleAuthentionTime"
          ></Date-picker>
        </FormItem>
        <FormItem label="最近修改时间" :label-width="110">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 200px"
            @on-change="handleModifyTime"
          ></Date-picker>
        </FormItem>
        <FormItem label="来源" :label-width="110">
          <Select
            placeholder="来源"
            v-model="searchModel.source"
            @on-change="handleStatusSelect"
          >
            <Option value="">全部</Option>
            <Option value="0">医生库数据</Option>
            <Option value="1">就医助手</Option>
            <Option value="2">通行证</Option>
            <Option value="3">ask</Option>
            <Option value="4">医信中心</Option>
            <Option value="5">贵健康</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>
        </FormItem>
      </Form>
    </div>
    <Table
      stripe
      :columns="columns"
      :data="allDoctorData"
      :height="tableHeight"
      :loading="loading"
    ></Table>
    <div class="toolbar-bottom">
      <div class="action-box"></div>
      <div class="paging-box">
        <Page
          :total="dataCount"
          :page-size="pageSize"
          :current="pageIndex"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          show-sizer
          show-elevator
          show-total
          class="pageing"
        />
      </div>
    </div>
    <Modal
      title="编辑医生资料"
      width="80%"
      :styles="{ top: '20px', 'min-width': '800px' }"
      v-model="isShowEditModal"
      footer-hide
    >
      <editFormView
        v-if="isShowEditModal"
        :doctorId="currentDoctor.id"
        :hospitalId="currentDoctor.hospitalId"
        :labId="currentDoctor.labId"
        :auditId="currentDoctor.auditId"
        @afterSaveSuccess="handleSaveComplete"
      ></editFormView>
    </Modal>
    <Modal
      title="审核医生资料修改"
      width="60%"
      :styles="{ top: '20px' }"
      v-model="isShowAuditModal"
      footer-hide
    >
      <auditView
        v-if="isShowAuditModal"
        :doctor="currentDoctor"
        @afterAuditComplete="handleAuditComplete"
      ></auditView>
    </Modal>
    <Modal title="查看大图" v-model="visible" class-name="fl-image-modal">
      <img :src="imgUrl" v-if="visible" style="width: 100%" />
    </Modal>
  </div>
</template>

<script>
import apiDoctor from "@/api/apiDoctor";
import ConstData from "@/utils/constData";
import expandInfo from "./expand-info";
import auditView from "./audit"; // 审核UI
import editFormView from "./editForm";

export default {
  components: { expandInfo, auditView, editFormView },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 215,
      searchModel: {
        id: "",
        hospitalName: "",
        doctorName: "",
        dataStatus: "",
        qualificationStatus: "",
        memberId: "",
        minAuthenticationTime: "", //最小最近申请认证时间
        maxAuthenticationTime: "", //最大最近申请认证时间
        minModifyTime: "", //最小修改时间
        maxModifyTime: "", //最大修改时间
        source: ""
      }, // 查询条件
      loading: false,
      dataCount: 0, // 数据总数
      pageSize: 20,
      pageIndex: 1,
      imgUrl: "", // 大图地址
      visible: false,
      allDoctorData: [],
      columns: this.buildColumns(),
      currentDoctor: {}, // 当前操作的医生
      currentDocId: 0, // 当前操作的医生ID
      currentDocTags: [], // 当前操作医生的标签
      //--  医生修改相关 --Begin
      isShowEditModal: false,
      //--  医生修改相关 --end
      // -- 医生审核相关--Begin----
      isShowAuditModal: false

      // -- 医生审核相关--End----
    };
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    buildColumns() {
      return [
        {
          type: "expand",
          width: 30,
          render: (h, params) => {
            return h(expandInfo, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          title: "医生ID",
          key: "doctorId",
          align: "center",
          minwidth: 80
        },
        {
          title: "头像",
          key: "headPortrait",
          align: "center",
          minwidth: 120,
          render: (h, params) => {
            let imgstr = "";
            //表格列显示文字
            if (params.row.headPortrait == null) {
              imgstr = "https://image.39.net/daoyi/images/pics/default_ys.gif";
            } else {
              imgstr = params.row.headPortrait.replace("/#/", "/org/");
            }
            return h(
              "div",
              {
                attrs: {
                  class: "avatar-box doctor-avatar "
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
          title: "基本信息",
          key: "name",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            let data = params.row;
            let sexName = "未知";
            if (data.sex === 1) {
              sexName = "男";
            } else if (data.sex === 2) {
              sexName = "女";
            }
            return h(
              "div",
              {
                attrs: {
                  class: "hhhtest"
                }
              },
              [
                h("p", [h("strong", data.name)]),
                h("p", ConstData.getClinicPositionName(data.clinicPosition)),
                h("p", data.labName),
                h("p", data.hospitalName)
              ]
            );
          }
        },
        {
          title: "学校",
          key: "school",
          align: "center",
          minwidth: 120
        },
        {
          title: "注册来源",
          key: "source",
          align: "center",
          minwidth: 100,
          render: (h, params) => {
            let sourceName = "";
            switch (params.row.source) {
              case 0:
                sourceName = "医生库数据";
                break;
              case 1:
                sourceName = "就医助手";
                break;
              case 2:
                sourceName = "通行证";
                break;
              case 3:
                sourceName = "ask";
                break;
              case 4:
                sourceName = "医信中心";
                break;
              case 5:
                sourceName = "贵健康";
                break;
              default:
                sourceName = "未知";
            }
            return h("div", sourceName);
          }
        },
        {
          title: "资质审核状态", //qualificationStatus
          minwidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            switch (params.row.qualificationStatus) {
              case 1:
                return h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "success"
                    }
                  },
                  "正常"
                );
              case 2:
                return h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "default"
                    }
                  },
                  "删除"
                );
              case 0:
                return h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "warning"
                    }
                  },
                  "待审核"
                );
              case 3:
                return h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "error"
                    }
                  },
                  "未通过"
                );
              default:
                return "未知";
            }

            return h(
              "div",
              {
                domProps: {
                  title: type
                }
              },
              type
            );
          }
        },
        {
          title: "最近认证申请时间",
          key: "authenticationTime",
          align: "center",
          sortable: true,
          minwidth: 150,
          render: (h, params) => {
            return h("div", [h("p", params.row.authenticationTime)]);
          }
        },
        {
          title: "资料审核状态", //dataStatus
          minwidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            switch (params.row.dataStatus) {
              case 1:
                return h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "success"
                    }
                  },
                  "正常"
                );
              case 2:
                return h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "default"
                    }
                  },
                  "删除"
                );
              case 0:
                return h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "warning"
                    }
                  },
                  "待审核"
                );
              case 3:
                return h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "error"
                    }
                  },
                  "未通过"
                );
              default:
                return "未知";
            }

            return h(
              "div",
              {
                domProps: {
                  title: type
                }
              },
              type
            );
          }
        },
        {
          title: "最近修改时间",
          key: "modifyTime",
          align: "center",
          sortable: true,
          minwidth: 150,
          render: (h, params) => {
            return h("div", [
              h("p", params.row.modifyUser),
              h("p", params.row.modifyTime)
            ]);
          }
        },
        {
          title: "操作",
          maxwidth: 50,
          align: "center",
          render: (h, params) => {
            //20190509更新：所有状态均显示审核按钮
            let status = params.row.status;
            let edit_btn = h("span", {
              attrs: {
                class: "icon-bianji font-icon"
              },
              domProps: {
                title: "编辑医生资料"
              },
              on: {
                click: () => {
                  this.$set(this.currentDoctor, "id", params.row.doctorId);
                  this.$set(
                    this.currentDoctor,
                    "hospitalId",
                    params.row.hospitalId
                  );
                  this.$set(this.currentDoctor, "labId", params.row.labId);
                  this.$set(this.currentDoctor, "auditId", params.row.id);
                  this.isShowEditModal = true;
                  console.log("审核表id", params.row);
                }
              }
            });
            let audit_btn = h("span", {
              attrs: {
                class: "icon-shenhe font-icon"
              },
              domProps: {
                title: "审核医生资料修改"
              },
              on: {
                click: () => {
                  this.$set(this.currentDoctor, "id", params.row.doctorId);
                  this.$set(
                    this.currentDoctor,
                    "hospitalName",
                    params.row.hospitalName
                  );
                  this.$set(this.currentDoctor, "name", params.row.name);
                  this.isShowAuditModal = true;
                }
              }
            });
            // let all_btn=(status===1)?[audit_btn,edit_btn]:[audit_btn];
            let all_btn = [audit_btn, edit_btn];
            return h("div", all_btn); //已通过，显示编辑按钮，不显示审核按钮
          }
        }
      ];
    },
    handleStatusSelect() {
      this.handleSearch();
    },
    handleSearch(pageNum) {
      // 如果有指定的页码，则使用指定的页码
      if (pageNum) {
        this.pageIndex = parseInt(pageNum);
      }
      this.loading = true;
      apiDoctor
        .getAuditList({
          hospitalId: this.searchModel.id,
          hospitalName: this.searchModel.hospitalName,
          name: this.searchModel.name,
          dataStatus: this.searchModel.dataStatus,
          qualificationStatus: this.searchModel.qualificationStatus,
          memberId: this.searchModel.memberId,
          minAuthenticationTime: this.searchModel.minAuthenticationTime,
          maxAuthenticationTime: this.searchModel.maxAuthenticationTime,
          minModifyTime: this.searchModel.minModifyTime,
          maxModifyTime: this.searchModel.maxModifyTime,
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          source: this.searchModel.source
        })
        .then(res => {
          this.loading = false;
          let jsonResult = res.data;
          if (jsonResult.code === 200) {
            this.dataCount = jsonResult.data.total;
            this.allDoctorData = jsonResult.data.list;
          } else {
            this.$Message.error(jsonResult.message);
            console.log(jsonResult);
          }
        })
        .catch(err => {
          this.$Message.error("获取数据失败");
          console.log(err);
        });
    },
    // 审核完成后的操作
    handleAuditComplete() {
      this.isShowAuditModal = false;
      this.handleSearch();
    },
    handleSaveComplete() {
      this.isShowEditModal = false;
      this.handleSearch();
    },
    changePage(value) {
      this.pageIndex = value;
      this.handleSearch();
    },
    changePageSize(value) {
      this.pageSize = value;
      this.handleSearch();
    },
    // 查看大图
    handleView(url) {
      this.imgUrl = url;
      this.visible = true;
    },
    customRowStyle(row, index) {
      if (row.status === 2) {
        return "disabled-data";
      } else if (row.warning === 3) {
        return "disabled-data";
      }
    },
    //申请认证时间
    handleAuthentionTime(value) {
      this.searchModel.minAuthenticationTime = value[0];
      this.searchModel.maxAuthenticationTime = value[1];
      this.handleSearch();
    },
    //修改时间
    handleModifyTime(value) {
      this.searchModel.minModifyTime = value[0];
      this.searchModel.maxModifyTime = value[1];
      this.handleSearch();
    }
  }
};
</script>

<style lang="less" scoped>
.disabled-data {
  color: #ccc;
}
.warning-data {
  color: #ed4014;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>
