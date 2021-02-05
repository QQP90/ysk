<template>
  <div class="app-container">
    <div class="toolbar-top">
      <Form inline :label-width="60" :model="searchModel">
        <FormItem v-if="sId.id == 2" prop="name" label="通行证ID">
          <Input
            type="text"
            placeholder="通行证ID"
            clearable
            v-model="searchModel.memberId"
          />
        </FormItem>
        <FormItem v-if="sId.id == 1" prop="name" label="医生库ID">
          <Input
            type="text"
            placeholder="医生库ID"
            clearable
            v-model="searchModel.yykId"
          />
        </FormItem>
        <FormItem v-if="sId.id == 4" prop="name" label="第三方ID">
          <Input
            type="text"
            placeholder="第三方ID"
            clearable
            v-model="searchModel.outDoctorId"
          />
        </FormItem>
        <FormItem prop="name" label="医生姓名">
          <Input
            type="text"
            placeholder="医生姓名"
            clearable
            v-model="searchModel.name"
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
        <FormItem prop="hospitalName" label="所在科室">
          <Input
            type="text"
            placeholder="所在科室"
            clearable
            v-model="searchModel.labName"
          />
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
export default {
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 215,
      data: {},
      loading: false,
      searchModel: {},
      columns: this.buildColumns(),
      dataCount: 0, // 数据总数
      pageSize: 20,
      pageIndex: 1,
      allDoctorData: [],
      selectDocDate: {} //选中医生
    };
  },
  props: {
    sId: Object
  },
  mounted() {},
  methods: {
    buildColumns() {
      return [
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
        },
        {
          title: "ID",
          align: "center",
          minwidth: 80,
          render: (h, params) => {
            switch (this.sId.id) {
              case 1:
                return h("div", [h("p", "就医助手ID " + params.row.yykId)]);
              case 2:
                return h("div", [h("p", "通行证ID " + params.row.memberId)]);
              case 4:
                return h("div", [h("p", "第三方ID " + params.row.outDoctorId)]);

              default:
                return "未知";
            }
          }
        },
        { title: "医生", key: "name", width: "80", align: "center" },
        {
          title: "医院和科室",
          align: "center",
          minwidth: 220,

          render: (h, params) => {
            return h("div", [
              params.row.hospitalName + "-",
              params.row.labName
            ]);
          }
        },
        {
          title: "其他关联的id", //dataStatus
          minwidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            switch (this.sId.id) {
              case 1:
                return h("div", [
                  h("p", "第三方ID " + params.row.memberId),
                  h("p", "通行证ID " + params.row.outDoctorId)
                ]);
              case 2:
                return h("div", [
                  h("p", "就医助手ID " + params.row.yykId),
                  h("p", "第三方ID " + params.row.outDoctorId)
                ]);
              case 4:
                return h("div", [
                  h("p", "就医助手ID " + params.row.yykId),
                  h("p", "通行证ID " + params.row.memberId)
                ]);

              default:
                return "未知";
            }
          }
        }
      ];
    },

    handleSearch(pageNum) {
      // 如果有指定的页码，则使用指定的页码
      if (pageNum) {
        this.pageIndex = parseInt(pageNum);
      }
      this.searchModel.source = this.sId.id;

      this.loading = true;
      apiDoctor
        .search({
          hospitalName: this.searchModel.hospitalName,
          name: this.searchModel.name,
          memberId: this.searchModel.memberId,
          yykId: this.searchModel.yykId,
          outDoctorId: this.searchModel.outDoctorId,
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
          }
        })
        .catch(err => {
          this.$Message.error("获取数据失败");
        });
    },
    changePage(value) {
      this.pageIndex = value;
      this.handleSearch();
    },
    changePageSize(value) {
      this.pageSize = value;
      this.handleSearch();
    },
    handleSubmit() {
      let obj = {};
      obj.udoctorId = this.selectDocDate.id;
      obj.doctorId=this.sId.did
      apiDoctor.updateId(obj).then(res => {
        
        if(res.data.code==200){
            this.$emit("save");
        }
      })
      .catch(err=>{
        this.$Message.error(err.message)
      })
    
    }
  }
};
</script>

<style lang="less" scoped></style>
