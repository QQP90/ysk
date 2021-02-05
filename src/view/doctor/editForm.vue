<template>
  <div>
    <div class="form-box">
      <Form
        :model="doctorInfo"
        ref="doctorInfo"
        :rules="ruleValidate"
        label-position="right"
        :label-width="100"
        class="formData"
      >
        <div class="form-content">
          <div class="other-items">
            <Row>
              <Col :span="4">
                <FormItem label="姓名：" prop="name">
                  <Input v-model="doctorInfo.name" />
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem label="性别：" :labelWidth="60" prop="sex">
                  <Select v-model="doctorInfo.sex">
                    <Option :value="1" label="男"></Option>
                    <Option :value="2" label="女"></Option>
                    <Option :value="0" label="未知"></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="5">
                <FormItem label="省市区：" prop="areaId">
                  <Cascader :data="allAreas" v-model="currentArea"></Cascader>
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem label="临床职称：" prop="clinicPosition">
                  <Select v-model="doctorInfo.clinicPosition">
                    <Option
                      v-for="item in allClinicPosition"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="5">
                <FormItem label="通行证ID：" prop="memberId">
                  <Input v-model="doctorInfo.memberId" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="4">
                <FormItem label="联系电话：" prop="phone">
                  <Input v-model="doctorInfo.phone" />
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem prop="degree" label="学历：" :labelWidth="60">
                  <Select v-model="doctorInfo.degree">
                    <Option
                      v-for="item in allDigree"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="5">
                <FormItem label="毕业院校：" prop="school">
                  <Input v-model="doctorInfo.school" />
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem label="开始工作年份：" prop="startedWork">
                  <Input v-model="doctorInfo.startedWork" />
                  <!-- <DatePicker type="year" v-model="doctorInfo.startedWork" @on-change="handleYearChange"></DatePicker> -->
                </FormItem>
              </Col>
              <Col :span="5">
                <FormItem label="Email：" prop="email">
                  <Input v-model="doctorInfo.email" />
                </FormItem>
              </Col>
            </Row>
          </div>
          <div class="form-avatar">
            <div class="avatar-box r-row">
              <img
                class="avatar-image"
                v-if="doctorInfo.headPortrait"
                :src="doctorInfo.headPortrait"
              />
              <img
                class="avatar-image"
                v-else
                src="https://image.39.net/daoyi/images/pics/default_ys.gif"
              />
              <div class="image-item-cover">
                <Icon
                  v-if="doctorInfo.headPortrait"
                  type="ios-eye-outline"
                  title="查看大图"
                  @click.native="handleView(doctorInfo.headPortraitCorrect)"
                ></Icon>
                <Upload
                  :action="uploadUrl"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleUploadSuccess"
                >
                  <Icon type="ios-camera" title="重新上传" size="30"></Icon>
                </Upload>
              </div>
            </div>
          </div>
        </div>
        <div class="form-content">
          <div style="flex:1;" class="left-form">
            <Divider orientation="left">详细资料</Divider>

            <FormItem label="简介：" prop="introduceCn">
              <Input
                v-model="doctorInfo.introduceCn"
                type="textarea"
                :rows="3"
                placeholder="该医生的简要介绍"
              />
            </FormItem>
            <FormItem label="擅长：" prop="goodat">
              <Input
                v-model="doctorInfo.goodat"
                type="textarea"
                :rows="3"
                placeholder=""
              />
            </FormItem>
            <FormItem label="荣誉成就：">
              <Input
                v-model="doctorInfo.honor"
                type="textarea"
                :rows="2"
                placeholder=""
              />
            </FormItem>
            <FormItem label="发表论文：" prop="paper">
              <Input
                v-model="doctorInfo.paper"
                type="textarea"
                :rows="3"
                placeholder=""
              />
            </FormItem>
            <FormItem label="出诊备注：" prop="auditRemark">
              <Input
                v-model="doctorInfo.auditRemark"
                type="textarea"
                :rows="2"
                placeholder=""
              />
            </FormItem>
            <FormItem label="备注：" prop="remark">
              <Input
                v-model="doctorInfo.remark"
                type="textarea"
                :rows="2"
                placeholder=""
              />
            </FormItem>
          </div>
          <div class="width: 500px;margin-left: 10px;">
            <Divider orientation="left">证件资料</Divider>
            <!-- <FormItem label="身份证号：" prop="idCard">
              <Input v-model="doctorInfo.idCard" />
            </FormItem>
            <FormItem label="身份证照：" prop="remark">
              <div class="image-list">
                <div
                  class="image-item"
                  v-for="item in idCardPics"
                  :key="item.url"
                >
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url" />
                    <div class="image-item-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item.url)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveIdCardPic(item.url)"
                      ></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress
                      v-if="item.showProgress"
                      :percent="item.percentage"
                      hide-info
                    ></Progress>
                  </template>
                </div>
                <Upload
                  v-if="idCardPics && idCardPics.length < 2"
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleIdCardPicUploadSuccess"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem> -->
            <FormItem label="执业证书：" prop="remark">
              <div class="image-list">
                <div
                  class="image-item"
                  v-for="item in certificatePics"
                  :key="item.url"
                >
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url" />
                    <div class="image-item-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item.url)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveCertPic(item.url)"
                      ></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress
                      v-if="item.showProgress"
                      :percent="item.percentage"
                      hide-info
                    ></Progress>
                  </template>
                </div>
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleCertificatePicUploadSuccess"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
            <FormItem label="执业证书备注" prop="certificatePicRemark">
              <Input
                type="textarea"
                v-model="doctorInfo.certificatePicRemark"
              />
            </FormItem>
            <FormItem
              label="是否齐全："
              prop="certificatePicStatus"
              style="width: 250px;"
            >
              <Select v-model="doctorInfo.certificatePicStatus">
                <Option :value="1">是</Option>
                <Option :value="3">否</Option>
              </Select>
            </FormItem>
            <FormItem label="职称证书：">
              <div class="image-list">
                <div
                  class="image-item"
                  v-for="item in titlePics"
                  :key="item.url"
                >
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url" />
                    <div class="image-item-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item.url)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveTitlePic(item.url)"
                      ></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress
                      v-if="item.showProgress"
                      :percent="item.percentage"
                      hide-info
                    ></Progress>
                  </template>
                </div>
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleTitlePicUploadSuccess"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
            <FormItem label="职称证书备注" prop="titlePicRemark">
              <Input type="textarea" v-model="doctorInfo.titlePicRemark" />
            </FormItem>
            <FormItem
              label="是否齐全："
              prop="titlePicStatus"
              style="width: 250px;"
            >
              <Select placement="top" v-model="doctorInfo.titlePicStatus">
                <Option :value="1">是</Option>
                <Option :value="3">否</Option>
              </Select>
            </FormItem>
            <FormItem label="工作证明：" prop="remark">
              <div class="image-list">
                <div
                  class="image-item"
                  v-for="item in workPics"
                  :key="item.url"
                >
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url" />
                    <div class="image-item-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item.url)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveWorkPic(item.url)"
                      ></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress
                      v-if="item.showProgress"
                      :percent="item.percentage"
                      hide-info
                    ></Progress>
                  </template>
                </div>
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleWorkPicUploadSuccess"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
          </div>
        </div>
        <Divider orientation="left">个人资料</Divider>
        <div class="content">
          <div class="ite">
            <FormItem label="身份证号：" prop="idCard">
              <Input style="width: 200px;" v-model="doctorInfo.idCard" />
            </FormItem>
            <FormItem label="有效时间" prop="idCard">
              <Input style="width: 200px;" v-model="doctorInfo.effectiveTime" />
            </FormItem>
          </div>
          <div class="ite">
            <FormItem label="身份证正面照：" prop="remark">
              <div class="image-list">
                <div
                  class="image-item"
                  v-for="item in idCardPics"
                  :key="item.url"
                >
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url" />
                    <div class="image-item-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item.url)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveIdCardPic(item.url)"
                      ></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress
                      v-if="item.showProgress"
                      :percent="item.percentage"
                      hide-info
                    ></Progress>
                  </template>
                </div>
                <Upload
                  v-if="idCardPics && idCardPics.length < 2"
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleIdCardPicUploadSuccess"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
            <FormItem label="身份证反面照：" prop="remark">
              <div class="image-list">
                <div
                  class="image-item"
                  v-for="item in idCardPics_reversePhoto"
                  :key="item.url"
                >
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url" />
                    <div class="image-item-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item.url)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveIdCardPic_fanmian(item.url)"
                      ></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress
                      v-if="item.showProgress"
                      :percent="item.percentage"
                      hide-info
                    ></Progress>
                  </template>
                </div>
                <Upload
                  v-if="
                    idCardPics_reversePhoto &&
                      idCardPics_reversePhoto.length < 2
                  "
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleIdCardPicUploadSuccess_fanmian"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
          </div>
          <div class="ite">
            <FormItem label="银行卡号：" prop="certificatePicRemark">
              <Input
                type="text"
                style="width: 200px;"
                v-model="doctorInfo.bankCardNumber"
              />
            </FormItem>
            <FormItem label="开户信息：" prop="certificatePicRemark">
              <Input
                style="width: 200px;"
                type="text"
                v-model="doctorInfo.accountOpenInfo"
              />
            </FormItem>
          </div>
          <div class="ite">
            <FormItem label="银行卡照片:">
              <div class="image-list">
                <div
                  class="image-item"
                  v-for="item in bankCardPhotos"
                  :key="item.url"
                >
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url" />
                    <div class="image-item-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item.url)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveTitlePic(item.url)"
                      ></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress
                      v-if="item.showProgress"
                      :percent="item.percentage"
                      hide-info
                    ></Progress>
                  </template>
                </div>
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handlbankCardPhotoUploadSuccess"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
          </div>
        </div>
      </Form>
    </div>
    <div class="form-action">
      <Checkbox v-model="notice">通知医生</Checkbox>
      <Button type="primary" @click="handleSave">保存</Button>
    </div>
    <Modal title="查看大图" v-model="isShowBigImage" footer-hide>
      <img :src="currentImage" v-if="isShowBigImage" style="width: 100%" />
    </Modal>
  </div>
</template>
<script>
import config from "@/config";
import ConstData from "@/utils/constData";
import apiDoctor from "@/api/apiDoctor";
import apiBase from "@/api/apiBase";
import helper from "@/utils/helper";
import AreaData from "@/utils/areaData2";

export default {
  components: {},
  props: {
    doctorId: {
      type: Number,
      required: false,
      default: 0
    },
    auditId: {
      type: Number
    },
    hospitalId: {
      type: Number
    },
    labId: {
      type: Number
    },
    types: {
      type: String
    },
    ruleValidate: {
      name: [{ required: true, message: "医院名称不能为空", trigger: "blur" }],
      intro: [{ required: true, message: "医院简介不能为空", trigger: "blur" }],
      pic: [{ required: true, message: "logo不能为空", trigger: "blur" }]
    }
  },
  data() {
    return {
      allClinicPosition: ConstData.arrayClinicPosition,
      allDigree: ConstData.arrayDigree,
      isShowBigImage: false, // 是否显示大图
      currentImage: "", // 图片地址
      doctorInfo: {}, // 当前医院信息
      currentData: {}, // 当前编辑数据
      allAreas: AreaData.allAreas, // 省市区地址
      currentArea: [],
      notice: true //通知医生
    };
  },
  computed: {
    certificatePics() {
      if (this.doctorInfo && this.doctorInfo.certificatePic) {
        let imgs = this.splitMultiImage(this.doctorInfo.certificatePic);
        return imgs;
      }
      return [];
    },
    /**
     * 身份照图片
     * */
    idCardPics() {
      if (this.doctorInfo && this.doctorInfo.frontPhoto) {
        let imgs = this.splitMultiImage(this.doctorInfo.frontPhoto);
        return imgs;
      }
      return [];
    },
    idCardPics_reversePhoto() {
      if (this.doctorInfo && this.doctorInfo.reversePhoto) {
        let imgs = this.splitMultiImage(this.doctorInfo.reversePhoto);
        return imgs;
      }
      return [];
    },
    titlePics() {
      if (this.doctorInfo.titlePic) {
        let imgs = this.splitMultiImage(this.doctorInfo.titlePic);
        return imgs;
      }
      return [];
    },
    // 银行卡照片
    bankCardPhotos() {
      if (this.doctorInfo.bankCardPhoto) {
        let imgs = this.splitMultiImage(this.doctorInfo.bankCardPhoto);
        return imgs;
      }
      return [];
    },
    workPics() {
      if (this.doctorInfo.workPic) {
        let imgs = this.splitMultiImage(this.doctorInfo.workPic);
        return imgs;
      }
      return [];
    },
    uploadUrl() {
      let baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      // let baseUrl = 'http://172.16.3.118:8081/';
      return `${baseUrl}upload/image?collectionId=4`;
    }
  },
  mounted() {
    console.log("types", this.types, this.doctorInfo.status);
    console.log("doctor-edit-form", "mounted", this.doctorId);
    this.loadDetail();
  },
  watch: {
    doctorId() {
      if (this.doctorId > 0) {
        this.doctorInfo = {};
        this.loadDetail();
      }
    }
  },
  methods: {
    loadDetail() {
      if (this.doctorId > 0) {
        apiDoctor.getDetail(this.doctorId).then(res => {
          let j = res.data;
          console.log("编辑医生信息", res.data);
          if (j.code === 200) {
            this.doctorInfo = j.data;
            this.currentArea = [];
            if (j.data.areaInfo.provinceId) {
              this.currentArea.push(j.data.areaInfo.provinceId);
            }
            if (j.data.areaInfo.cityId) {
              if (this.currentArea.indexOf(j.data.areaInfo.cityId) < 0) {
                this.currentArea.push(j.data.areaInfo.cityId);
              }
            }
            if (j.data.areaId) {
              if (this.currentArea.indexOf(j.data.areaId) < 0) {
                this.currentArea.push(j.data.areaId);
              }
            }
          } else {
            this.$Message.error(`加载医生详情失败，${j.message}`);
          }
        });
      }
    },
    handleSave(e) {
      let that = this;
      if (that.currentArea.length == 2) {
        that.doctorInfo.areaId = that.currentArea[1];
      } else if (that.currentArea.length == 3) {
        that.doctorInfo.areaId = that.currentArea[2];
      } else {
        that.doctorInfo.areaId = [];
      }
      let promise = new Promise((resolve, reject) => {
        that.$refs.doctorInfo.validate(valid => {
          if (valid) {
            if (that.types == "audit") {
              // 执行更新审核表
              let auditData = that.doctorInfo;
              auditData.doctorId = that.doctorId;
              auditData.hospitalId = that.hospitalId;
              auditData.labId = that.labId;
              auditData.id = that.auditId;
              console.info("www", auditData);
              return false;
              apiDoctor
                .saveAudit({ doctorInfo: that.doctorInfo, notice: this.notice })
                .then(res => {
                  if (res.data.code === 200) {
                    that.$Message.success("保存成功");
                    that.$emit("afterSaveSuccess");
                    resolve();
                  } else {
                    that.$Message.error(res.data.message);
                    reject();
                  }
                });
            } else {
              // 新增修改主表
              apiDoctor
                .save({ doctorInfo: that.doctorInfo, notice: this.notice })
                .then(res => {
                  if (res.data.code === 200) {
                    that.$Message.success("保存成功");
                    that.$emit("afterSaveSuccess");
                    resolve();
                  } else {
                    that.$Message.error(res.data.message);
                    reject();
                  }
                });
            }
            //
          } else {
            that.$Message.error("请检查输入项");
            reject();
          }
        });
      });
      return promise;
    },

    handleYearChange(val, date) {
      console.log(val, date);
      this.doctorInfo.startedWork = val;
    },
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        if (res.data[0]) {
          this.$set(this.doctorInfo, "headPortrait", res.data[0]);
        } else {
          this.$Message.error(`头像上传失败，${res.message}`);
        }
      } else {
        this.$Message.error(`头像上传失败，${res.message}`);
      }
    },
    /**
     * 身份证上传成功处理
     **/
    handleIdCardPicUploadSuccess(res, file) {
      if (res.code === 200) {
        if (res.data[0]) {
          let imgUrl = res.data[0];
          if (this.doctorInfo.frontPhoto) {
            this.doctorInfo.frontPhoto = `${this.doctorInfo.frontPhoto},${imgUrl}`;
          } else {
            this.$set(this.doctorInfo, "frontPhoto", imgUrl);
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
      console.log(this.doctorInfo);
    },
    handleIdCardPicUploadSuccess_fanmian(res, file) {
      if (res.code === 200) {
        if (res.data[0]) {
          let imgUrl = res.data[0];
          if (this.doctorInfo.reversePhoto) {
            this.doctorInfo.reversePhoto = `${this.doctorInfo.reversePhoto},${imgUrl}`;
          } else {
            this.$set(this.doctorInfo, "reversePhoto", imgUrl);
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
      console.log(this.doctorInfo);
    },
    // 职业证书上传成功处理
    handleCertificatePicUploadSuccess(res, file) {
      console.log("certificatePic", res);
      if (res.code === 200) {
        let imgUrl = res.data[0];
        if (imgUrl) {
          if (this.doctorInfo.certificatePic) {
            this.doctorInfo.certificatePic = `${this.doctorInfo.certificatePic},${imgUrl}`;
          } else {
            // data中未曾定义的属性，直接赋值无法响应式更新，可用$set;
            //                this.doctorInfo.certificatePic = imgUrl;
            this.$set(this.doctorInfo, "certificatePic", imgUrl);
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
      console.log(this.doctorInfo);
    },
    // 职称证书上传成功处理
    handleTitlePicUploadSuccess(res, file) {
      console.log(res);
      if (res.code === 200) {
        if (res.data[0]) {
          let imgUrl = res.data[0];
          if (this.doctorInfo.titlePic) {
            this.doctorInfo.titlePic = `${this.doctorInfo.titlePic},${imgUrl}`;
          } else {
            this.$set(this.doctorInfo, "titlePic", imgUrl);
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
    },
    // 银行卡上传成功处理
    handlbankCardPhotoUploadSuccess(res, file) {
      console.log(res);
      if (res.code === 200) {
        if (res.data[0]) {
          let imgUrl = res.data[0];
          if (this.doctorInfo.bankCardPhoto) {
            this.doctorInfo.bankCardPhoto = `${this.doctorInfo.bankCardPhoto},${imgUrl}`;
          } else {
            this.$set(this.doctorInfo, "bankCardPhoto", imgUrl);
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
    },
    // 工作证上传成功处理
    handleWorkPicUploadSuccess(res, file) {
      console.log(res);
      if (res.code === 200) {
        if (res.data[0]) {
          let imgUrl = res.data[0];
          if (this.doctorInfo.workPic) {
            this.doctorInfo.workPic = `${this.doctorInfo.workPic},${imgUrl}`;
          } else {
            this.$set(this.doctorInfo, "workPic", imgUrl);
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
    },
    // 删除身份证照片
    handleRemoveIdCardPic(url) {
      this.doctorInfo.frontPhoto = helper.removeItemFromMultiString(
        this.doctorInfo.frontPhoto,
        url
      );
    },
    // 删除身份证反面照片
    handleRemoveIdCardPic_fanmian(url) {
      this.doctorInfo.reversePhoto = helper.removeItemFromMultiString(
        this.doctorInfo.reversePhoto,
        url
      );
    },
    // 删除职称照片
    handleRemoveTitlePic(url) {
      this.doctorInfo.titlePic = helper.removeItemFromMultiString(
        this.doctorInfo.titlePic,
        url
      );
    },
    //  // 删除银行卡照片
    // handleRemovebankCardPhoto(url) {
    //   this.doctorInfo.bankCardPhoto = helper.removeItemFromMultiString(
    //     this.doctorInfo.bankCardPhoto,
    //     url
    //   );
    // },
    // 删除职业证照片
    handleRemoveCertPic(url) {
      this.doctorInfo.certificatePic = helper.removeItemFromMultiString(
        this.doctorInfo.certificatePic,
        url
      );
    },
    // 删除工作证照片
    handleRemoveWorkPic(url) {
      this.doctorInfo.workPic = helper.removeItemFromMultiString(
        this.doctorInfo.workPic,
        url
      );
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传图片格式不正确",
        desc: "文件 " + file.name + " 非允许的图片格式，请上传jpg、png格式图片"
      });
    },
    handleView(url) {
      this.currentImage = url;
      this.isShowBigImage = true;
    },
    splitMultiImage(images) {
      if (images) {
        let imgList = images.split(",");
        let list = [];
        imgList.forEach((obj, idx) => {
          list.push({
            status: "finished",
            percentage: 100,
            name: obj,
            url: obj
          });
        });
        console.log(images, list);
        return list;
      }
      return [];
    }
  }
};
</script>
<style lang="less" scoped>
.form-box {
  /*max-height: 600px;*/
  min-width: 800px;
  padding-right: 20px;
  overflow: auto;

  .form-content {
    display: flex;
    //justify-content: space-between;

    .form-avatar {
      .avatar-box {
        height: 130px;
        line-height: 130px;
        margin-left: 30px;
        text-align: center;
        position: relative;
        overflow: hidden;

        .avatar-image {
          width: 100%;
          height: auto;
        }
      }
      .avatar-box:hover .image-item-cover {
        display: block;
      }
    }
    .other-items {
      flex: 1;
    }
  }
  .image-list {
    max-width: 372px;
    display: flex;
    flex-wrap: wrap;
  }
  .image-item {
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin: 0 4px 4px 0;
  }
  .image-item:hover .image-item-cover {
    display: block;
  }
  .image-item img {
    width: 100%;
    height: 100%;
  }
  .image-item-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);

    .ivu-upload {
      display: inline;
    }
  }

  .image-item-cover i {
    color: #fff;
    font-size: 40px;
    cursor: pointer;
    margin: 0 2px;
  }
}
.form-action {
  text-align: right;
  border-top: 1px solid #e8eaec;
  padding: 10px 30px 0 0;
}
.left-form {
  min-width: 300px;
}
.ivu-col {
  min-width: 120px !important;
}
.yes-button {
  margin-left: 20px;
}
.content {
  display: flex;
}
.ite {
  width: 300px;
}
</style>
