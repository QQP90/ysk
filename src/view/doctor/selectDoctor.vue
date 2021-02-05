<template>
  <div class="app-container">
    <div class="toolbar-top">
      <Form inline :label-width="60" :model="searchModel">
        <FormItem prop="name" label="医生ID">
          <Input
            type="text"
            placeholder="医生ID"
            clearable
            v-model="searchModel.eqDoctorId"
          />
        </FormItem>
        <FormItem prop="name" label="医生姓名">
          <Input
            type="text"
            placeholder="医生姓名"
            clearable
            v-model="searchModel.likeName"
          />
        </FormItem>
        <FormItem prop="hospitalName" label="所在医院">
          <Input
            type="text"
            placeholder="医院名称"
            clearable
            v-model="searchModel.hospitalName"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getDataList(1)">查询</Button>
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
      <div class="action-box">
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
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
  </div>
</template>

<script>
import apiDoctor from "@/api/apiDoctor";
import constData from "@/utils/constData";
export default {
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 215,
      data: {},
      loading: false,
      searchModel: {
        likeName:this.SelectDoc.name,
        hospitalName:this.SelectDoc.hospitalName
      },
      columns: this.buildColumns(),
      dataCount: 0, // 数据总数
      pageSize: 20,
      pageIndex: 1,
      allDoctorData: [],
      selectDocDate: {} //选中医生
    };
  },
  mounted() {},
  props: {
    SelectDoc: {
      type: Object,
      default: {}
    }
  },
  methods: {
    buildColumns() {
      return [
        {
          title: "ID",
          key: "doctorId",
          align: "center",
          minwidth: 80
        },
        {
          title: "医生",
          key: "name",
          width: "80",
          align: "center"
        },
        {
          title: "职称",
          key: "clinicPositionName",
          align: "center"
        },
        {
          title: "医院",
          key: "hospitalName",
          align: "center",
          minwidth: 120
        },
        {
          title: "科室",
          key: "labName",
          align: "center",
          minwidth: 50
        },
        {
          title: "状态", //qualificationStatus
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
          title: "选择",
          align: "center",
          render: (h, params) => {
            return h("Radio", {
              props: {
                value: params.row.tag
              },
              on: {
                "on-change": () => {
                  this.allDoctorData.forEach(items => {
                    this.$set(items, "tag", false);
                  });
                  this.allDoctorData[params.index].tag = true;
                  this.selectDocDate = params.row;
                }
              }
            });
          }
        }
      ];
    },
    getDataList(pageNum) {
      // 如果有指定的页码，则使用指定的页码
      if (pageNum) {
        this.pageIndex = parseInt(pageNum);
      }
      this.loading = true;
      apiDoctor
        .selectDoctor({
          ...this.searchModel,
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
        })
        .then(res => {
          this.loading = false;
          let jsonResult = res.data;
          constData.arrayClinicPosition;
          if (jsonResult.code === 200) {
            this.dataCount = jsonResult.data.total;
            this.allDoctorData = jsonResult.data.list;
            // 明天来
            let len = constData.arrayClinicPosition.length;
            for (let i = 0; i < len; i++) {
              for (let j = 0; j < this.allDoctorData.length; j++) {
                if (
                  constData.arrayClinicPosition[i].id ==
                  this.allDoctorData[j].clinicPosition
                ) {
                  this.allDoctorData[j].clinicPositionName =
                    constData.arrayClinicPosition[i].name;
                }
              }
            }
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
    changePage(value) {
      this.pageIndex = value;
      this.getDataList();
    },
    changePageSize(value) {
      this.pageSize = value;
      this.getDataList();
    },
    handleSubmit() {
      this.$emit("save", this.selectDocDate);
    }
  }
};
</script>

<style lang="less" scoped></style>
