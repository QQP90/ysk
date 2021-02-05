<template>
  <div class="app-container">
    <div class="toolbar-top">
      <Form inline :label-width="60" :model="searchModel">
        <FormItem prop="doctorId" label="医生ID">
          <Input
            type="text"
            placeholder="医生ID"
            clearable
            v-model="searchModel.doctorId"
          />
        </FormItem>
        <FormItem prop="doctorName" label="姓名">
          <Input
            type="text"
            placeholder="医生姓名"
            clearable
            v-model="searchModel.name"
          />
        </FormItem>
        <FormItem prop="hospitalName" label="所属医院">
          <Input
            type="text"
            placeholder="医生所在的医院名称"
            clearable
            v-model="searchModel.hospitalName"
          />
        </FormItem>

        <FormItem prop="hospitalName" label="通行证ID">
          <Input
            type="text"
            placeholder="通行证ID"
            clearable
            v-model="searchModel.memberId"
          />
        </FormItem>

        <FormItem prop="status" label="状态">
          <Select
            placeholder="状态"
            v-model="searchModel.status"
            @on-change="handleStatusSelect"
          >
            <Option value="">全部</Option>
            <Option value="0">待审核</Option>
            <Option value="1">正常</Option>
            <Option value="2">删除</Option>
            <Option value="3">未通过</Option>
          </Select>
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
        <FormItem prop="status" label="最后编辑人" :label-width="110">
          <Input
            type="text"
            placeholder="最后编辑人"
            clearable
            v-model="searchModel.modifyUser"
          />
        </FormItem>
        <FormItem label="最近编辑时间" :label-width="110">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 200px"
            @on-change="handleModifyTime"
          ></Date-picker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchEvent">查询</Button>
        </FormItem>
      </Form>
    </div>
    <Table
      stripe
      class="main-content"
      :columns="columns"
      :data="allDoctorData"
      :height="tableHeight"
      :loading="loading"
    >
      <template slot-scope="{ row }" slot="avatar">
        <div class="avatar-box r-row">
          <img v-if="row.headPortrait" :src="row.headPortrait" />
          <img
            v-else
            src="https://image.39.net/daoyi/images/pics/default_ys.gif"
          />
        </div>
      </template>
      <template slot-scope="{ row }" slot="operation">
        <div class="r-row">
          <span
            class="icon-da iconfont"
            title="首页"
            @click="handleClickDoctorIndex(row)"
          ></span>
          <span
            class="icon-xuanzhongshangcheng iconfont"
            title="首页"
            @click="handleClickDoctorIndex(row)"
          ></span>

          <span
            class="icon-chakan font-icon"
            title="查看医生详情"
            @click="handleEditDoctor(row)"
          ></span>
          <span
            v-if="row.status == 1"
            class="icon-xiugaizhuangtai font-icon"
            title="修改医生状态"
            @click="handleSetStatus(row)"
          ></span>
          <Dropdown @on-click="name => handleCmd(name, row)">
            <a href="javascript:void(0)"
              ><span class="icon-bianji font-icon"></span
            ></a>
            <Dropdown-menu slot="list">
              <Dropdown-item name="expand">编辑扩展信息</Dropdown-item>
              <Dropdown-item name="depart">管理医生所属科室</Dropdown-item>
              <Dropdown-item name="label">管理医生标签</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
          <span
            v-if="!(row.status === 2)"
            class="icon-shanchu1 font-icon"
            title="删除该医生"
            @click="remove(row.id)"
          ></span>
        </div>
      </template>
    </Table>
    <div class="toolbar-bottom">
      <div class="action-box">
        <Button type="success" @click="handleNewDoctor"
          ><span class="icon-xinzeng font-icon"></span>新增医生</Button
        >
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
    <!--修改医生状态-->
    <Modal
      :title="doctorStatusModalTitle"
      width="500"
      class="status-box"
      v-model="isShowDoctorStatusModal"
    >
      <div class="status-item r-row">
        <span class="status-label">状态：</span>
        <Select class="status-select" v-model="currentDocInfo.status">
          <Option :value="0">待审核</Option>
          <Option :value="1">正常</Option>
          <!--                  <Option :value="2">删除</Option>-->
          <Option :value="3">未通过</Option>
        </Select>
      </div>
      <!--审核不通过备注-->
      <div class="status-item  r-row" v-if="currentDocInfo.status == 3">
        <span class="status-label">备注：</span>
        <i-input
          class="status-remark"
          type="textarea"
          :rows="4"
          placeholder="请输入..."
          v-model="currentDocInfo.remark"
        ></i-input>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleSaveStatusRelation">提交</Button>
      </div>
    </Modal>
    <Modal
      :title="doctorTagModalTitle"
      width="500"
      v-model="isShowDoctorTagModal"
    >
      <Checkbox
        class="tag-check-item"
        size="large"
        v-for="tag in allTags"
        :value="tag.checked"
        :key="tag.id"
        @on-change="val => handleTagCheck(val, tag)"
        >{{ tag.name }}</Checkbox
      >
      <div slot="footer">
        <Button type="primary" @click="handleSaveTagRelation">提交</Button>
      </div>
    </Modal>

    <Modal
      title="医生扩展信息"
      width="800"
      :styles="{ top: '20px' }"
      v-model="isShowExpandInfo"
      footer-hide
    >
      <moreInfoView
        v-if="isShowExpandInfo"
        :doctorId="currentDoctor.id"
        @afterSaveSuccess="handleAfterExpandInfo"
      ></moreInfoView>
    </Modal>

    <Modal
      :title="doctorFormTitle"
      width="80%"
      :styles="{ top: '20px', 'min-width': '800px' }"
      v-model="isShowDoctorEditForm"
      footer-hide
    >
      <editFormView
        v-if="isShowDoctorEditForm"
        :doctorId="currentDoctor.id"
        @afterSaveSuccess="handleAfterSaveSuccess"
        @afterAuditComplete="handleTest"
      ></editFormView>
    </Modal>
    <Modal
      :title="doctorFormTitle"
      width="80%"
      :styles="{ top: '20px', 'min-width': '800px' }"
      v-model="isShowDoctorReadForm"
      footer-hide
    >
      <readFormView
        v-if="isShowDoctorReadForm"
        :doctorId="currentDoctor.id"
        @afterSaveSuccess="handleAfterSaveSuccess"
        @afterAuditComplete="handleTest"
      ></readFormView>
    </Modal>

    <Modal
      :title="currentDoctor.name + '所关联的科室信息'"
      width="800"
      v-model="isShowDepartments"
      footer-hide
    >
      <departmentsView
        v-if="isShowDepartments"
        :doctorInfo="currentDoctor"
      ></departmentsView>
    </Modal>
    <Modal
      title="新增医生主页"
      width="1000"
      v-model="showDoctorIndex"
      footer-hide
    >
      <addDoctorIndex
        ref="addDoctorIndex"
        @close="handleClose"
        :Id="addDoctorIndexId"
      ></addDoctorIndex>
    </Modal>
  </div>
</template>

<script>
import { deleteDoctorInfos } from "@/api/data";
import apiDoctor from "@/api/apiDoctor";
import apiLabel from "@/api/apiLabel";
import ConstData from "@/utils/constData";
import { formatDate } from "@/utils/formatDate";
import ButtonDrop from "@/view/components/button-drop/index.vue";
import doctorModal from "./doctor-modal";
import expandInfo from "./expand-info";
import moreInfoView from "./moreInfo";
import editFormView from "./editForm";
import readFormView from "./readForm";
import departmentsView from "./departments";
import addDoctorIndex from "./addDoctorIndex";

export default {
  components: {
    doctorModal,
    expandInfo,
    moreInfoView,
    editFormView,
    readFormView,
    departmentsView,
    ButtonDrop,
    addDoctorIndex
  },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 265,
      searchModel: {
        doctorId: "",
        hospitalName: "",
        name: "",
        status: "",
        memberId: ""
      },
      loading: false,
      dataCount: 0,
      pageSize: 10,
      pageIndex: 1,
      imgUrl: "",
      visible: false,
      allDoctorData: [],
      columns: this.buildColumns(),
      currentDoctor: {}, // 当前操作的医生
      isShowDoctorEditForm: false, // 是否显示医生编辑表单
      isShowDoctorReadForm: false,
      doctorFormTitle: "", // 编辑医生信息弹窗标题
      isShowDepartments: false, // 是否显示医生所在的科室列表
      isShowDoctorTagModal: false, // 是否显示关联医生标签弹窗
      doctorTagModalTitle: "关联医生标签", // 弹窗标题
      allTags: [], // 所有医生标签
      currentDocId: 0, // 当前操作的医生ID
      currentDocTags: [], // 当前操作医生的标签
      isShowExpandInfo: false, // 是否显示医生的扩展信息
      // -- 医生审核相关--Begin----
      isShowAuditModal: false,
      // -- 医生审核相关--End----
      doctorStatusModalTitle: "修改医生状态", // 弹框标题
      isShowDoctorStatusModal: false, // 是否显示修改医生状态弹框
      currentDocInfo: { status: 0 }, // 当前操作医生的信息
      showDoctorIndex: false,
      addDoctorIndexId: 0
    };
  },
  mounted() {
    this.handleSearch();
    // 先将全部标签加载出来（打标签时再加载，会有异步加载数据的问题）
    this.loadAllTags();
  },
  methods: {
    // 下拉菜单的操作
    handleCmd(cmd, data) {
      switch (cmd) {
        case "edit":
          // 编辑
          this.handleEditDoctor(data);
          break;
        case "expand":
          // 编辑扩展信息
          this.currentDoctor = data;
          this.isShowExpandInfo = true;
          break;
        case "depart":
          // 所属科室
          this.currentDoctor = data;
          this.isShowDepartments = true;
          break;
        case "label":
          // 标签
          this.handleSetLabel(data);
          break;
        //                case 'delete':
        //                    // 删除
        //                    this.remove(data.id)
        //                    break;
      }
      console.log(cmd, data);
    },
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
          title: "ID",
          key: "id",
          width: 80,
          align: "center"
        },
        {
          title: "头像",
          slot: "avatar",
          width: 120,
          align: "center"
        },
        {
          title: "基本信息",
          key: "name",
          minWidth: 120,
          render: (h, params) => {
            let data = params.row;
            let sexName = "未知";
            if (data.sex === 1) {
              sexName = "男";
            } else if (data.sex === 2) {
              sexName = "女";
            }
            return h("div", [
              h("p", [h("strong", data.name)]),
              h("p", ConstData.getClinicPositionName(data.clinicPosition)),
              h("p", data.labName),
              h("p", data.hospitalName)
            ]);
          }
        },
        {
          title: "标签",
          key: "tagInfo",
          minWidth: 160,
          render: (h, params) => {
            let tags = params.row.tagInfo;
            if (tags && tags.length > 0) {
              let tagList = [];

              tags.forEach(element => {
                tagList.push(
                  h(
                    "Tag",
                    {
                      props: {
                        color: "success"
                      }
                    },
                    element.tagName
                  )
                );
              });
              return h("div", tagList);
            }
            return h("div", "-");
          }
        },

        {
          title: "通行证ID",
          key: "memberId",
          minWidth: 60,
          align: "center"
        },
        {
          title: "注册来源",
          key: "source",
          align: "center",
          width: 80,
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
          title: "创建时间",
          key: "createTime",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [h("p", params.row.createTime)]);
          }
        },
        {
          title: "最后编辑人及时间",
          key: "modifyTime",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h("p", params.row.modifyUser),
              h("p", params.row.modifyTime)
            ]);
          }
        },
        {
          title: "状态",
          width: 130,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let statusName = ConstData.getStatusName(params.row.status);
            switch (params.row.status) {
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
          title: "操作",
          slot: "operation",
          width: 180,
          align: "left"
        }
      ];
    },
    show(index) {
      console.log("index:", this.allDoctorData[index], 14587);
      let type1;
      switch (this.allDoctorData[index].sex) {
        case 0:
          type1 = "未知";
          break;
        case 1:
          type1 = "男";
          break;
        case 2:
          type1 = "女";
          break;
      }
      let sex = type1;
      let type4;
      switch (this.allDoctorData[index].status) {
        case 1:
          type4 = "有效";
          break;
        case 2:
          type4 = "删除";
          break;
        case 0:
          type4 = "未审核";
          break;
        case 3:
          type4 = "审核不通过";
          break;
        default:
          type4 = "未知";
      }
      let status = type4;
      let type5;
      switch (this.allDoctorData[index].source) {
        case 0:
          type5 = "医生库数据";
          break;
        case 1:
          type5 = "就医助手";
          break;
        case 2:
          type5 = "通行证";
          break;
        case 3:
          type5 = "ask";
          break;
        case 4:
          type5 = "医信中心";
          break;
        default:
          type4 = "未知";
      }
      let source = type5;
      this.$Modal.info({
        title: "医生详情",
        content: `
                  姓名：${this.allDoctorData[index].name}<br>
                  医生ID：${this.allDoctorData[index].id}<br>
                  性别：${sex}<br>
                  毕业学校：${this.allDoctorData[index].school}<br>
                  学位：${this.allDoctorData[index].degree}<br>
                  开始工作年份：${this.allDoctorData[index].startedWork}<br>
                  修改时间：${this.allDoctorData[index].modifyTime}<br>
                  修改人：${this.allDoctorData[index].modifyUser}<br>
                  状态：${status}<br>
                  临床职称：${this.allDoctorData[index].clinicPosition}<br>
                  行政职称：${this.allDoctorData[index].teachPosition}<br>
                  创建时间：${this.allDoctorData[index].createTime}<br>
                  社会任职：${this.allDoctorData[index].socialTitle}<br>
                  论文：${this.allDoctorData[index].paper}<br>
                  擅长：${this.allDoctorData[index].honor}<br>
                  荣誉成就：${this.allDoctorData[index].goodat}<br>
                  出诊备注：${this.allDoctorData[index].auditRemark}<br>
                  来源：${source}<br>
                  简介：${this.allDoctorData[index].introduceCn}<br>
                  头像：<img width="100" height="100" src="${this.allDoctorData[index].headPortrait}"><br>
                  标题照片：<img width="100" height="100" src="${this.allDoctorData[index].titlePic}"><br>
                  工作照片：<img width="100" height="100" src="${this.allDoctorData[index].workPic}"><br>
                  XX照片：<img width="100" height="100" src="${this.allDoctorData[index].certificatePic}"><br>
                  `,
        width: 700,
        closable: true
      });
    },
    handleViewDetail(row) {
      console.log(row);
    },
    handleStatusSelect() {
      this.handleSearch();
    },

    searchEvent() {
      this.pageIndex = 1;
      this.handleSearch();
    },
    handleSearch() {
      this.loading = true;
      let params = Object.assign(
        {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        this.searchModel
      );
      apiDoctor
        .search(params)
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
    // 修改医生状态
    handleSetStatus(docInfo) {
      this.isShowDoctorStatusModal = true;
      this.doctorStatusModalTitle = `为医生【${docInfo.name}】修改状态`;
      // Copy一份数据，以免双向同步，污染列表数据
      this.currentDocInfo = Object.assign({}, docInfo);
    },
    handleSaveStatusRelation() {
      let that = this;
      apiDoctor.save(that.currentDocInfo).then(res => {
        if (res.data.code === 200) {
          that.$Message.success("保存成功");
          that.handleSearch();
          that.isShowDoctorStatusModal = false;
        } else {
          that.$Message.error(res.data.message);
        }
      });
    },
    // 设置医生标签
    handleSetLabel(docInfo) {
      this.doctorTagModalTitle = `为医生【${docInfo.name}】关联标签`;
      // 加载当前医生的标签
      apiDoctor
        .getTagsOfDoctor({ doctorId: docInfo.id })
        .then(res => {
          console.log("doctorTag ", res);
          if (res.data.code === 200) {
            this.isShowDoctorTagModal = true;
            this.currentDoctor = docInfo;
            let tagIds = [];
            if (res.data.data.length > 0) {
              // 循环所有标签对象，只取标签id
              res.data.data.forEach(element => {
                tagIds.push(element.tagId);
              });
            }
            this.currentDocTags = tagIds;
            // 设置选中状态
            this.setTagChecked();
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    loadAllTags() {
      apiLabel.getList({ status: 1, pageNum: 1, pageSize: 200 }).then(res => {
        if (res.data.code === 200) {
          // this.allTags = res.data.data.list;
          res.data.data.list.forEach(element => {
            this.allTags.push({
              id: element.id,
              name: element.name,
              checked: false
            });
          });
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    // 重新梳理所有标签，设置当前医生的标签为选中状态
    setTagChecked() {
      if (this.allTags.length === 0) {
        console.log("loadAllTags");
        this.loadAllTags();
      }
      for (let i = 0; i < this.allTags.length; i++) {
        let tempIdx = this.currentDocTags.indexOf(this.allTags[i].id);
        if (tempIdx >= 0) {
          this.allTags[i].checked = true;
        } else {
          this.allTags[i].checked = false;
        }
      }
    },
    handleTagCheck(val, tag) {
      tag.checked = val;
    },
    handleSaveTagRelation() {
      let that = this;
      let checkedIds = [];
      if (this.allTags && this.allTags.length) {
        this.allTags.forEach(element => {
          if (element.checked) {
            checkedIds.push(element.id);
          }
        });
        if (!checkedIds.join(",")) {
          this.$Message.error("请选择关联标签");
          return false;
        }
        console.log(checkedIds.join(","));
        apiDoctor
          .setTagsOfDoctor({
            doctorId: this.currentDoctor.id,
            tagIds: checkedIds.join(",")
          })
          .then(res => {
            if (res.data.code === 200) {
              this.$Message.success("保存成功！");
              this.isShowDoctorTagModal = false;
              this.handleSearch();
            } else {
              this.$Message.error(res.data.message);
            }
          });
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "医生标签列表为空，前往新建？",
          onOk() {
            that.$router.push({ path: "doctor/label" });
          }
        });
      }
    },
    // 新增医生
    handleNewDoctor() {
      this.isShowDoctorEditForm = true;
      this.doctorFormTitle = "新增医生";
      this.currentDoctor = {};
    },
    // 编辑医生
    handleEditDoctor(docInfo) {
      this.currentDoctor = docInfo;
      //            this.doctorFormTitle = `编辑医生【${docInfo.name}】资料`;
      this.doctorFormTitle = `查看医生【${docInfo.name}】资料`;
      this.isShowDoctorReadForm = true;
    },
    handleAfterSaveSuccess() {
      this.isShowDoctorEditForm = false;
      this.handleSearch();
    },
    handleTest() {
      console.log("hhh");
    },
    cancel(value) {
      this.$emit("cancel");
      this.$refs[value].resetFields();
    },
    remove(id) {
      let that = this;
      this.$Modal.confirm({
        title: "提示",
        content: "是否确认删除本项",
        okText: "确定删除",
        cancelText: "取消",
        onOk: () => {
          deleteDoctorInfos("/doctorInfo/delete/" + id)
            .then(res => {
              if (res.data.code && res.data.code == 200) {
                this.$Message.success("删除成功");
                // 重新查询数据
                that.handleSearch();
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
      this.handleSearch();
    },
    changePageSize(value) {
      this.pageSize = value;
      this.handleSearch();
    },
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
    handleAfterExpandInfo() {
      this.isShowExpandInfo = false;
    },
    handleClickDoctorIndex(row) {
      this.showDoctorIndex = true;
      this.addDoctorIndexId = row.id;
      console.log(row.id);
      setTimeout(() => {
        this.$refs.addDoctorIndex.getData(row.id);
      }, 500);
    },
    // 关闭
    handleClose() {
      this.showDoctorIndex = false;
    },
    //修改时间
    handleModifyTime(value) {
      this.searchModel.geModifyTime = value[0];
      this.searchModel.leModifyTime = value[1];
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
.status-box {
  .status-item {
    justify-content: flex-start;
    align-items: flex-start;
    .status-label {
      display: inline-block;
      width: 100px;
      text-align: center;
    }
    .status-select {
      display: inline-block;
      width: 200px;
    }
    .status-remark {
      width: 300px;
    }
  }
  .status-item:last-child {
    margin-top: 30px;
  }
}
</style>
