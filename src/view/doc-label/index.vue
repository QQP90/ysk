<template>
  <div class="app-container">
    <div class="toolbar-top">
      <Form inline ref="searchData" :model="searchLabeldata">
        <FormItem prop="eqStatus" label="状态" :labelWidth="60">
          <Select
            placeholder="全部"
            v-model="searchLabeldata.eqStatus"
            @on-change="getData"
          >
            <Option value="">全部</Option>
            <Option value="1">正常</Option>
            <Option value="2">删除</Option>
          </Select>
        </FormItem>
      </Form>
    </div>
    <Table
      :height="tableHeight"
      :columns="columns"
      :data="doctorLabelData"
      :loading="loading"
      border
      stripe
    ></Table>
    <div class="toolbar-bottom">
      <div class="action-box">
        <Button type="success" @click="handleNew"
          ><span class="icon-xinzeng font-icon"></span>新增医生标签</Button
        >
      </div>
      <div class="paging-box">
        <Page
          v-if="dataCount > 0"
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
      v-model="isShowEditForm"
      width="400"
      :title="labelFormTitle"
      :loading="labelFormSubmiting"
    >
      <Form
        :model="currentLabel"
        ref="labelEditForm"
        :rules="ruleLabel"
        :label-width="50"
      >
        <FormItem label="名称" prop="name">
          <Input
            v-model="currentLabel.name"
            placeholder="标签名称请控制在10字内"
          />
        </FormItem>
        <FormItem label="状态">
          <i-switch
            v-model="currentLabel.status"
            :true-value="1"
            :false-value="2"
            size="large"
          >
            <span slot="open">正常</span>
            <span slot="close">删除</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注">
          <Input
            v-model="currentLabel.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSave">保存</Button>
      </div>
    </Modal>
    <!--该标签的医生列表-->
    <Modal
      v-model="isShowDoctorForm"
      :title="doctorFormTitle"
      width="1160"
      footer-hide
    >
      <doctorList :tagId="currentLabel.id"></doctorList>
    </Modal>
  </div>
</template>

<script>
import apiLabel from "@/api/apiLabel";
import { formatDate } from "@/utils/formatDate";
import doctorList from "../doctor/doctor-list.vue";

export default {
  components: { doctorList },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 215,
      searchLabeldata: {
        eqStatus: "1"
      },
      loading: false,
      dataCount: 0,
      pageSize: 20,
      pageIndex: 1,
      doctorLabelData: [], // 标签列表
      currentLabel: {
        status: "1"
      }, // 当前标签
      labelFormSubmiting: false, // 表单是否正在提交
      isShowDoctorForm: false, //是否医生列表弹窗
      doctorFormTitle: "医生列表", //医生列表弹窗标题
      ruleLabel: {
        name: [{ required: true, message: "标签名称不能为空", trigger: "blur" }]
      }, // 表单验证规则
      columns: [
        {
          title: "ID",
          key: "id",
          width: 80,
          tooltip: true
        },
        {
          title: "标签名称",
          key: "name",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Tag",
                {
                  props: {
                    color: "primary"
                  }
                },
                params.row.name
              )
            ]);
          }
        },
        {
          title: "最后修改时间",
          key: "modifyTime",
          width: 180,
          tooltip: true,
          render: (h, params) => {
            let timeString = "-";
            // 表格列显示文字
            if (params.row.modifyTime !== null) {
              timeString = formatDate(
                new Date(params.row.modifyTime),
                "yyyy-MM-dd hh:mm:ss"
              );
            }
            return h("div", timeString);
          }
        },
        {
          title: "状态",
          width: 120,
          tooltip: true,
          render: (h, params) => {
            let statusName = "未知";
            switch (params.row.status) {
              case 1:
                statusName = "正常";
                break;
              case 2:
                statusName = "删除";
                break;
            }
            return h("div", statusName);
          }
        },
        {
          title: "备注",
          key: "remark",
          tooltip: true
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            let editButton = h("span", {
              attrs: {
                class: "icon-bianji font-icon",
                title: "编辑该标签"
              },
              on: {
                click: () => {
                  // Object.assign复制，以免双向绑定污染源数据
                  this.currentLabel = Object.assign({}, params.row);
                  this.isShowEditForm = true;
                }
              }
            });
            let deleteButton = h("span", {
              attrs: {
                class: "icon-shanchu1 font-icon",
                title: "删除该标签"
              },
              on: {
                click: () => {
                  this.handleDelete(params.row);
                }
              }
            });
            let doctorButton = h("img", {
              attrs: {
                src: require("../../assets/images/doctor-icon.png"),
                title: "查看该标签医生",
                class: "doctor-icon font-icon"
              },
              on: {
                click: () => {
                  this.currentLabel = Object.assign({}, params.row);
                  this.doctorFormTitle = "【" + params.row.name + "】医生列表";
                  this.isShowDoctorForm = true;
                }
              }
            });
            let controlButton =
              params.row.status == 1
                ? [editButton, doctorButton, deleteButton]
                : [editButton, doctorButton];
            return h(
              "div",
              {
                attrs: {
                  class: "r-row"
                }
              },
              [controlButton]
            );
          }
        }
      ],
      isShowEditForm: false // 是否显示编辑表单
    };
  },
  computed: {
    labelFormTitle() {
      if (this.currentLabel.id && this.currentLabel.id > 0) {
        return "编辑医生标签";
      }
      return "新增医生标签";
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      apiLabel
        .getList({
          status: this.searchLabeldata.eqStatus,
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res && res.status === 200) {
            if (res.data.code == 405) {
              this.$Message.error("该用户没有此权限");
              return;
            }
            this.loading = false;
            this.pageIndex = res.data.data.pageNum;
            this.pageSize = res.data.data.pageSize;
            this.dataCount = res.data.data.total;
            this.doctorLabelData = res.data.data.list;
          } else {
            this.loading = false;
            this.$Message.error("加载数据失败！");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    customRowStyle(row, index) {
      if (row.status === 2) {
        return "disabled-data";
      }
    },
    handleNew() {
      this.currentLabel = {
        id: 0,
        name: "",
        status: 1,
        remark: ""
      };
      this.isShowEditForm = true;
    },
    handleSave() {
      let that = this;
      this.$refs["labelEditForm"].validate(valid => {
        if (valid) {
          that.labelFormSubmiting = true;
          let params = {
            name: that.currentLabel.name,
            remark: that.currentLabel.remark,
            status: that.currentLabel.status
          };
          if (that.currentLabel.id && that.currentLabel.id > 0) {
            //编辑标签
            that.$set(params, "id", that.currentLabel.id);
          }
          apiLabel
            .save(params)
            .then(res => {
              if (res.data.code === 200) {
                that.labelFormSubmiting = false;
                this.$Message.success("保存成功！");
                this.isShowEditForm = false;
                this.getData();
              } else {
                this.$Message.error(`保存失败，${res.data.message}`);
              }
            })
            .catch(err => {
              this.$Message.error("保存失败！");
              that.labelFormSubmiting = false;
              console.log("保存标签失败", err);
            });
        } else {
          this.$Message.error("请检查表单输入项");
        }
      });
    },
    handleDelete(tagInfo) {
      this.$Modal.confirm({
        title: "提示",
        content: `确认删除标签：【${tagInfo.name}】 吗？`,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          apiLabel
            .deleteType(tagInfo.id)
            .then(res => {
              let j = res.data;
              if (j.code === 200) {
                this.$Message.success("删除成功");
                // 重新查询数据
                this.getData();
              }
            })
            .catch(err => {
              this.$Message.success(err.message);
            });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        }
      });
    },
    changePage(value) {
      this.pageIndex = value;
      this.getData();
    },
    changePageSize(value) {
      this.pageSize = value;
      this.pageIndex = 1;
      this.getData();
    }
  }
};
</script>

<style>
.wrapper-c {
  background: #fff;
  padding-bottom: 30px;
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
.disabled-data {
  color: #ccc;
}
</style>
