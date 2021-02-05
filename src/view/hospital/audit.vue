<template>
  <div>
    <div class="wrapper-c" v-show="isReady">
      <!--<div  class="header">-->
      <div v-if="!isNewDoctor" class="header">
        <div class="title"></div>
        <div class="org">修改前</div>
        <div class="new">修改后</div>
      </div>
      <div class="audit-box">
        <div class="item"></div>

        <div class="item" style="padding:30px 0px 10px 0;">
          <div class="title">医院名称：</div>
          <div class="org" v-if="!isNewDoctor">{{ hospital_Org.name }}</div>
          <Input
            :class="renderNewItemClass(hospital_Org.name, hospital_New.name)"
            v-model="hospital_New.name"
          />
        </div>
        <div class="item">
          <div class="title">医院别名：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ hospital_Org.alias }}
          </div>
          <div
            :class="renderNewItemClass(hospital_Org.alias, hospital_New.alias)"
          >
            <Input v-model="hospital_New.alias" :title="hospital_New.alias" />
          </div>
        </div>
        <div class="item">
          <div class="title">医院LOGO：</div>
          <div class="org" v-if="!isNewDoctor">
            <img
              crossOrigin="anonymous"
              v-if="hospital_Org.pic"
              class="avatar"
              :src="
                hospital_Org.headPortraitCorrect
                  ? hospital_Org.headPortraitCorrect.replace('/#/', '/org/')
                  : hospital_Org.pic.replace('/#/', '/org/')
              "
              title="点击查看大图"
              @click="
                handleView(
                  hospital_Org.headPortraitCorrect
                    ? hospital_Org.headPortraitCorrect.replace('/#/', '/org/')
                    : hospital_Org.pic.replace('/#/', '/org/')
                )
              "
            />
          </div>
          <div
            :class="
              renderNewItemClass(
                hospital_Org.headPortraitCorrect,
                hospital_New.headPortraitCorrect
              )
            "
            @mouseenter="isAvatarIconShow = true"
            @mouseleave="isAvatarIconShow = false"
          >
            <img
              crossOrigin="anonymous"
              v-if="hospital_New.pic"
              class="avatar"
              :src="
                hospital_New.pic
                  ? hospital_New.pic.replace('/#/', '/org/')
                  : hospital_New.pic.replace('/#/', '/org/')
              "
            />
            <div class="headPortraitCorrect-icon r-row" v-if="isAvatarIconShow">
              <span
                class="icon-chakan"
                title="查看"
                @click="handleView(hospital_New.pic.replace('/#/', '/org/'))"
              ></span>
              <Upload
                :action="uploadUrl"
                :show-upload-list="false"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-success="handleUploadSuccess"
              >
                <Icon
                  type="ios-camera"
                  class="ios-camera"
                  title="重新上传"
                  size="30"
                ></Icon>
              </Upload>
              <span
                class="icon-caijian"
                title="裁剪"
                @click="handleClip(hospital_New.pic.replace('/#/', '/org/'))"
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-box">
        <Button type="primary" class="yes" @click="handleOpenHospital"
          >选择医院</Button
        >
        <Button
          type="primary"
          v-if="marge"
          @click="handleThrough(1)"
          class="yes"
          >合并</Button
        >
        <Button type="primary" @click="handleThrough(1)" class="yes"
          >审核通过</Button
        >
        <Button @click="handleThrough(3)" class="no">审核不通过</Button>
      </div>
      <Modal title="请输入审核不通过的原因：" v-model="isShowAuditReason">
        <Input type="textarea" v-model="auditRemark" :rows="5" />
      </Modal>
      <Modal title="查看大图" v-model="isShowBigImage" footer-hide>
        <img :src="currentImage" v-if="isShowBigImage" style="width: 100%" />
      </Modal>

      <div id="clip" v-bind:style="hideClip" v-if="isShowClipBox">
        <div class="clip-mask" @click="handleCloseClip"></div>
        <div class="clip-box">
          <div class="clip-header">
            <div class="clip-title">裁剪头像</div>
            <span
              id="clip-close"
              class="icon-guanbi"
              @click="handleCloseClip"
            ></span>
          </div>
          <cropperView
            v-if="hospital_New.pic"
            @afterClipComplete="handleClipComplete"
            :clipUrl="hospital_New.pic.replace('/#/', '/org/')"
          ></cropperView>
        </div>
      </div>
    </div>
    <Spin size="large" fix v-show="!isReady"></Spin>
    <Modal
      title="医院列表"
      width="50%"
      height="80%"
      class="form-box"
      footer-hide
      v-model="isShowauditHospitalModal"
    >
      <audit-hospital @afterConfirm="handleHospital"></audit-hospital>
    </Modal>
  </div>
</template>
<script>
import config from "@/config";
// import apiDoctor from "@/api/apiDoctor";
import apiHospital from "@/api/apiHospital";
import ConstData from "@/utils/constData";
import expandInfo from "./expand-info";
import helper from "@/utils/helper";
import AreaData from "@/utils/areaData2";
import cropperView from "../../components/cropper/cropper";
import AuditHospital from "../audit/auditHospital";
import AuditDepartment from "../audit/auditDepartment";

export default {
  components: {
    expandInfo,
    cropperView,
    AuditHospital,
    AuditDepartment
  },
  props: {
    HId: {
      required: true,
      default: 0
    }
  },
  data() {
    return {
      isReady: false, //页面内容是否准备好
      hospital_Org: {}, // 原资料
      hospital_New: {}, // 本次修改资料
      marge: false, //合并按钮显示
      isNewDoctor: false, // 是否新注册医生
      isShowBigImage: false, // 是否显示大图
      isShowClipBox: true, //是否显示裁剪弹窗
      hideClip: { opacity: 0 },
      currentImage: "", // 图片地址
      isShowAuditReason: false, // 是否显示审核不通过原因输入框
      auditRemark: "", // 审核意见
      isAvatarIconShow: false, //头像按钮(查看大图，重新上传)是否显示
      lastAuditRemark: "--", //上次操作审核备注
      lastAuditStatus: "--", //上次审核状态
      isSelectDoctor: false, //选择医生
      SelectDoctorId: 0, //选择医生ID
      isSdoc: false, //合并
      similarDoctorsColumns: [
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
          width: 80
        },
        {
          title: "头像",
          slot: "avatar",
          width: 120
        },
        {
          title: "基本信息",
          slot: "baseinfo",
          width: 150
        },
        {
          title: "所在医院-科室",
          slot: "hospitalinfo",
          minWidth: 160
        },

        {
          title: "通行证ID",
          key: "memberid",
          width: 100
        },
        {
          title: "来源",
          key: "source",
          width: 100,
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
          title: "最近修改",
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
          title: "#",
          slot: "operation",
          width: 150
        }
      ],
      loading: false, //加载
      allAreas: AreaData.allAreas, //省市区地址
      currentArea: [],
      isShowauditHospitalModal: false, //是否显示医院列表弹窗
      isShowauditDepartmentModal: false //是否显示科室列表弹窗
    };
  },
  computed: {
    uploadUrl() {
      let baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      return `${baseUrl}upload/image?collectionId=4`;
    },
    idCardPicNum() {
      let num = 0;
      if (this.hospital_New) {
        if (this.hospital_New.idCardPic) {
          let idCardPic = this.hospital_New.idCardPic.split(",");
          num = idCardPic ? idCardPic.length : num;
        }
      }
      return num;
    }
  },
  mounted() {
    this.loadAuditInfo();
  },
  watch: {
    HId() {
      // 医生ID有变动，则重新加载审核资料
      this.loadAuditInfo();
    }
  },
  methods: {
    loadAuditInfo() {
      if (this.HId > 0) {
        apiHospital.getDetail(this.HId).then(res => {
          this.isShowClipBox = false;
          this.isReady = true;
          let j = res.data;
          if (j.code === 200) {
            this.hospital_Org = { ...j.data };
            this.hospital_New = { ...j.data };
          } else {
            this.$Message.error(j.message);
          }
        });
      }
    },

    // 异同项高亮显示
    renderNewItemClass(orgVal, newVal) {
      let c = "new";
      if (orgVal !== newVal) {
        c = c + " diff";
      }
      return c;
    },
    // 异同项高亮显示
    renderNewItemClass2(orgVal, newVal) {
      // let c = 'new';
      let c = "";
      if (orgVal !== newVal) {
        // c = c + ' diff';
        c = "diff";
      }
      return c;
    },

    // 查看大图
    handleView(url) {
      this.currentImage = url;
      this.isShowBigImage = true;
    },
    //打开医院列表弹框
    handleOpenHospital() {
      this.isShowauditHospitalModal = true;
    },
    //医院选择确定后
    handleHospital(e) {
      this.hospital_New = { ...e };
      console.log(e);
      this.marge = true;
      this.hospital_New.mergeHospitalId = e.id;
      this.isShowauditHospitalModal = false;
    },

    /**
     * qStatus：资质状态 ； dStatus：资料状态
     **/
    handleThrough(status) {
      this.loading = true;
      let { id } = this.hospital_Org;
      let { mergeHospitalId } = this.hospital_New;
      let ps = { mergeHospitalId, hospitalId: id, status };
      console.log(12588);
      apiHospital
        .auditHospital(ps)
        .then(res => {
          if (res.data.code == 200) {
            this.loading = false;
            this.$Message.success("操作成功");
            this.$emit("close");
          }
        })
        .catch(err => {
          this.$Message.error(err.message);
        });
    },

    //上传失败处理
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传图片格式不正确",
        desc: "文件 " + file.name + " 非允许的图片格式，请上传jpg、png格式图片"
      });
    },
    //头像上传成功处理
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        if (res.data[0]) {
          this.$set(this.hospital_New, "pic", res.data[0]);
        } else {
          this.$Message.error(`头像上传失败，${res.message}`);
        }
      } else {
        this.$Message.error(`头像上传失败，${res.message}`);
      }
    },

    //裁剪处理
    handleClip(imgUrl) {
      var that = this;
      that.isShowClipBox = true;
      that.hideClip.opacity = 1;
    },
    handleCloseClip() {
      this.isShowClipBox = false;
      this.hideClip.opacity = 0;
    },
    //提交裁剪后的图片
    handleClipComplete(data) {
      // this.hospital_New.headPortraitCorrect=data;
      this.hospital_New.headPortrait = data;
      this.handleCloseClip();
    }
  }
};
</script>
<style lang="less" scoped>
.audit-box {
  overflow: auto;
  padding-bottom: 60px;
}
.header {
  clear: both;
  display: flex;
  font-weight: bold;
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9;
  background: #fff;
  .title {
    width: 190px;
    /*width: 160px;*/
    background: #fff;
  }
  .org,
  .new {
    flex: 1;
    text-align: center;
    padding: 10px 30px;
    max-width: 40%;
  }
}
.item {
  line-height: 20px;
  font-size: 14px;
  padding: 10px 0;
  clear: both;
  display: flex;
  .title {
    /*width: 130px;*/
    width: 190px;
    text-align: right;
    font-weight: bold;
  }
  .org,
  .new {
    flex: 1;
    text-align: center;
    padding: 0 30px;
    max-width: 40%;
  }

  .new {
    flex-wrap: wrap;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;

    align-items: center;
    .images-box {
      flex-wrap: wrap;
      justify-content: start;
    }
  }
}
.item:nth-of-type(even) {
  background: #f8f8f9;
}
.item:hover {
  background: #808695;
  color: #fff;
}

.action-box {
  text-align: right;
  border-top: 1px solid #e8eaec;
  padding: 10px 30px 10px 0;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
}
.action-box .yes {
  margin-right: 10px;
}
.action-box .no {
  color: rgba(235, 71, 38, 1);
}
.avatar {
  width: 120px;
  /*max-height: 120px;*/
  cursor: pointer;
}
.avatar-box {
  text-align: center;
}
.avatar-box img {
  height: 80px;
  border-radius: 5px;
  cursor: pointer;
}
.image-list {
  overflow: hidden;
  .list-item {
    position: relative;
    float: left;
    width: 120px;
    height: 120px;
    margin: 0 5px 5px 0;
    .image-item {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
}

.input {
  text-align: center !important;
}
.ivu-input {
  text-align: center !important;
}

.audit-box .headPortraitCorrect-icon {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  .icon-chakan {
    font-size: 30px;
    display: inline-block;
    margin-right: 10px;
  }
  .icon-chakan:hover {
    color: #fff !important;
    font-size: 36px !important;
  }
  .icon-caijian {
    font-size: 28px;
    display: inline-block;
  }
  .icon-caijian:hover {
    font-size: 34px;
  }
  .ios-camera:hover {
    font-size: 40px !important;
  }
}

.audit-box .image-item-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.audit-box .image-item-cover i {
  font-size: 24px;
  z-index: 2;
}
.ivu-icon-ios-camera:before {
  color: #e6e6e6;
}
.image-item-cover {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-weight: bold;
}
.item .org,
.item .new {
  word-wrap: break-word;
}
.areas {
  width: 100%;
  border-radius: 4px;
}
.old-areas .ivu-icon-ios-arrow-down:before {
  content: "" !important;
}
.old-areas .ivu-input[disabled],
fieldset[disabled] .ivu-input {
  background: #fff !important;
}
#clip {
  z-index: 9000;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.clip-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
.clip-box {
  z-index: 9999;
  background: #fff;
  border-radius: 7px;
}
.clip-header {
  border-bottom: 1px solid #e8eaec;
  padding: 14px 16px;
  line-height: 1;
  position: relative;
}
.clip-title {
  display: inline-block;
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #17233d;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#clip-close {
  font-size: 24px;
  color: #999;
  position: absolute;
  top: 12px;
  right: 20px;
  cursor: pointer;
}
#clip-close:hover {
  color: #17233d;
}
.hos-item {
  width: 100%;
  /*border:1px solid red;*/
}
.hos-item span:first-child {
  display: inline-block;
  width: 80%;
}
.hos-item span:last-child {
  display: inline-block;
  width: 20%;
}
.hos-line {
  text-align: left;
}
.hos-line span {
  display: inline-block;
  width: 80% !important;
  text-align: center;
}
.hos-item .ivu-select-input {
  text-align: center;
}
.hos-item .icon-xuanze {
  font-size: 20px;
  color: #2d8cf0;
  cursor: pointer;
}
.hos-item .icon-xuanze:hover {
  color: #fff;
  font-size: 23px;
  font-weight: bold;
}
.item:hover .icon-xuanze {
  color: #fff;
}
.other {
  padding: 20px 50px;
  border-top: 1px solid #e8eaec;
}
.other p {
  font-size: 17px;
  display: inline-block;
  margin-left: 50px;
  line-height: 36px;
}
</style>
