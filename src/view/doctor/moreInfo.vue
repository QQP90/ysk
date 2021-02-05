<template>
  <div>
    <div class="form-box">
      <Form
        :model="doctorMoreInfo"
        ref="doctorMoreInfo"
        label-position="right"
        :label-width="120"
        class="formData"
      >
        <FormItem label="执业证书公网信息" prop="certificatePicPub">
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
        <FormItem label="执业证书备注" prop="certificatePicPubRemark">
          <Input
            type="textarea"
            v-model="doctorMoreInfo.certificatePicPubRemark"
          />
        </FormItem>
        <FormItem
          label="是否齐全："
          prop="certificatePicPubStatus"
          style="width: 250px;"
        >
          <Select v-model="doctorMoreInfo.certificatePicPubStatus">
            <Option :value="1">是</Option>
            <Option :value="3">否</Option>
          </Select>
        </FormItem>
        <FormItem label="职称公网信息证书" prop="titlePicPub">
          <div class="image-list">
            <div class="image-item" v-for="item in titlePics" :key="item.url">
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
        <FormItem label="职称证书备注" prop="titlePicPubRemark">
          <Input type="textarea" v-model="doctorMoreInfo.titlePicPubRemark" />
        </FormItem>
        <FormItem
          label="是否齐全："
          prop="titlePicPubStatus"
          style="width: 250px;"
        >
          <Select placement="top" v-model="doctorMoreInfo.titlePicPubStatus">
            <Option :value="1">是</Option>
            <Option :value="3">否</Option>
          </Select>
        </FormItem>
        <FormItem label="百家号ID" prop="bjDoctorId">
          <Input style="width:300px" v-model="doctorMoreInfo.bjDoctorId" />
        </FormItem>
        <FormItem label="今日头条医生ID" prop="jrttDoctorId">
          <Input style="width:300px" v-model="doctorMoreInfo.jrttDoctorId" />
        </FormItem>
        <FormItem label="拇指医生ID" prop="thumbDoctorId">
          <Input style="width:300px" v-model="doctorMoreInfo.thumbDoctorId" />
        </FormItem>
      </Form>
    </div>
    <div class="form-action">
      <Button type="primary" size="large" @click="handleSave">保存</Button>
    </div>
    <Modal title="查看大图" v-model="isShowBigImage" footer-hide>
      <img :src="currentImage" v-if="isShowBigImage" style="width: 100%" />
    </Modal>
  </div>
</template>
<script>
import config from "@/config";
import apiDoctor from "@/api/apiDoctor";
import helper from "@/utils/helper";

export default {
  props: {
    doctorId: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      doctorMoreInfo: {}, // 当前医生信息
      isShowBigImage: false, // 是否显示大图
      currentImage: ""
    };
  },
  computed: {
    certificatePics() {
      console.log("computed", this.doctorMoreInfo);
      if (this.doctorMoreInfo && this.doctorMoreInfo.certificatePicPub) {
        let imgs = this.splitMultiImage(this.doctorMoreInfo.certificatePicPub);
        return imgs;
      }
      return [];
    },
    titlePics() {
      if (this.doctorMoreInfo.titlePicPub) {
        let imgs = this.splitMultiImage(this.doctorMoreInfo.titlePicPub);
        return imgs;
      }
      return [];
    },
    uploadUrl() {
      let baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      //let baseUrl = 'http://172.16.3.118:8081/';
    }
  },
  mounted() {
    this.loadMoreInfo();
  },

  methods: {
    loadMoreInfo() {
      console.log("loadMoreInfo", this.doctorId);
      if (this.doctorId > 0) {
        apiDoctor.getExpandInfo(this.doctorId).then(res => {
          let j = res.data;
          if (j.code === 200) {
            if (j.data) {
              this.doctorMoreInfo = j.data;
            } else {
              this.doctorMoreInfo = {
                id: this.doctorId,
                certificatePicPub: "",
                titlePicPub: ""
              };
            }
          } else {
            this.$Message.error("加载医生扩展信息失败，" + j.message);
          }
        });
      }
    },
    // 职业证书上传成功处理
    handleCertificatePicUploadSuccess(res, file) {
      console.log(res);
      if (res.code === 200) {
        if (res.data[0]) {
          let imgUrl = res.data[0];
          console.log("111", this.doctorMoreInfo.certificatePicPub);
          if (this.doctorMoreInfo.certificatePicPub) {
            console.log("222", this.doctorMoreInfo.certificatePicPub);
            this.doctorMoreInfo.certificatePicPub = `${this.doctorMoreInfo.certificatePicPub},${imgUrl}`;
          } else {
            //                    this.doctorMoreInfo.certificatePicPub = imgUrl;
            this.$set(this.doctorMoreInfo, "certificatePicPub", imgUrl);
            console.log("333", imgUrl);
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
      console.log(this.doctorMoreInfo);
    },
    // 职称证书上传成功处理
    handleTitlePicUploadSuccess(res, file) {
      console.log(res);
      if (res.code === 200) {
        if (res.data[0]) {
          let imgUrl = res.data[0];
          if (this.doctorMoreInfo.titlePicPub) {
            this.doctorMoreInfo.titlePicPub = `${this.doctorMoreInfo.titlePicPub},${imgUrl}`;
          } else {
            this.doctorMoreInfo.titlePicPub = imgUrl;
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
    },
    // 删除职称照片
    handleRemoveTitlePic(url) {
      this.doctorMoreInfo.titlePicPub = helper.removeItemFromMultiString(
        this.doctorMoreInfo.titlePicPub,
        url
      );
    },
    // 删除职业证照片
    handleRemoveCertPic(url) {
      this.doctorMoreInfo.certificatePicPub = helper.removeItemFromMultiString(
        this.doctorMoreInfo.certificatePicPub,
        url
      );
    },
    handleSave() {
      console.log("handleSave", this.doctorMoreInfo);
      apiDoctor.saveExpandInfo(this.doctorMoreInfo).then(res => {
        let j = res.data;
        if (j.code === 200) {
          this.$Message.success("保存成功！");
          this.$emit("afterSaveSuccess");
        } else {
          this.$Message.error(`保存失败；${j.message}`);
        }
      });
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
    },

    handleView(name) {
      this.currentImage = name;
      this.isShowBigImage = true;
    },

    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传图片格式不正确",
        desc: "文件 " + file.name + " 非允许的图片格式，请上传jpg、png格式图片"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.form-box {
  /*max-height: 600px;*/
  padding-right: 20px;
  overflow: auto;
}

.image-list {
  float: left;
}
.image-item {
  display: inline-block;
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
  margin-right: 4px;
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
}
.image-item:hover .image-item-cover {
  display: block;
}
.image-item-cover i {
  color: #fff;
  font-size: 40px;
  cursor: pointer;
  margin: 0 2px;
}
.form-action {
  text-align: right;
  border-top: 1px solid #e8eaec;
  padding: 10px 20px 0 0;
}
</style>
