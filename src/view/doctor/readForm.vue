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
          <div class="other-items pr">
            <Row>
              <Col :span="3">
                <FormItem label="姓名：" prop="name">
                  <div>{{ doctorInfo.name }}</div>
                </FormItem>
              </Col>
              <Col :span="2">
                <FormItem label="性别：" :labelWidth="60" prop="sex">
                  <div>{{ renderSex(doctorInfo.sex) }}</div>
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem label="省市区：" prop="areaId">
                  <Cascader
                    class="old-areas read-areas"
                    disabled
                    :data="allAreas"
                    v-model="currentArea"
                  ></Cascader>
                </FormItem>
              </Col>
              <Col :span="3">
                <FormItem label="临床职称：" prop="clinicPosition">
                  <div>
                    {{ renderClinicPosition(doctorInfo.clinicPosition) }}
                  </div>
                </FormItem>
              </Col>
              <Col :span="5">
                <FormItem label="通行证ID:" prop="memberId">
                  <div class="memberId">
                    <i-input
                      class="mem_input"
                      disabled
                      v-model="doctorInfo.memberId"
                      :title="doctorInfo.memberId"
                    />
                    <i-button @click="handleSelectId(2)">重新绑定</i-button>
                  </div>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col :span="3">
                <FormItem label="联系电话：" prop="phone">
                  <div>{{ doctorInfo.phone }}</div>
                </FormItem>
              </Col>
              <Col :span="2">
                <FormItem prop="degree" label="学历：" :labelWidth="60">
                  <div>{{ renderDigree(doctorInfo.degree) }}</div>
                </FormItem>
              </Col>
              <Col :span="3">
                <FormItem label="毕业院校：" prop="school">
                  <div>{{ doctorInfo.school }}</div>
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem label="开始工作年份：" prop="startedWork">
                  <div>{{ doctorInfo.startedWork }}</div>
                </FormItem>
              </Col>

              <Col :span="5">
                <FormItem label="就医助手ID:" prop="yykId">
                  <div class="memberId">
                    <i-input
                      class="mem_input"
                      disabled
                      v-model="doctorInfo.yykId"
                    /><i-button @click="handleSelectId(1)">重新绑定</i-button>
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="14">
                <FormItem label="Email：" prop="email">
                  <div>{{ doctorInfo.email }}</div>
                </FormItem>
              </Col>
              <Col :span="6">
                <FormItem label="第三方ID:" prop="outDoctorId">
                  <div class="memberId">
                    <i-input
                      class="mem_input"
                      disabled
                      v-model="doctorInfo.outDoctorId"
                      :title="doctorInfo.outDoctorId"
                    /><i-button @click="handleSelectId(4)">重新绑定</i-button>
                  </div>
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
                  @click.native="handleView(doctorInfo.headPortrait)"
                ></Icon>
              </div>
            </div>
          </div>
        </div>
        <div class="form-content">
          <div style="flex:1;" class="left-form">
            <Divider orientation="left">详细资料</Divider>

            <FormItem label="简介：" prop="introduceCn">
              <div class="left-item">{{ doctorInfo.introduceCn }}</div>
            </FormItem>
            <FormItem label="擅长：" prop="goodat">
              <div class="left-item">{{ doctorInfo.goodat }}</div>
            </FormItem>
            <FormItem label="荣誉成就：">
              <div class="left-item">{{ doctorInfo.honor }}</div>
            </FormItem>
            <FormItem label="发表论文：" prop="paper">
              <div class="left-item">{{ doctorInfo.paper }}</div>
            </FormItem>
            <FormItem label="出诊备注：" prop="auditRemark">
              <div class="left-item">{{ doctorInfo.auditRemark }}</div>
            </FormItem>
            <FormItem label="备注：" prop="remark">
              <div class="left-item">{{ doctorInfo.remark }}</div>
            </FormItem>
          </div>
          <div class="right-form">
            <Divider orientation="left">证件资料</Divider>
            <!-- <FormItem label="身份证号：">
              <div>{{ doctorInfo.idCard ? doctorInfo.idCard : "暂无" }}</div>
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
              </div>

            </FormItem>
            <FormItem label="执业证书备注：">
              <div>
                {{
                  doctorInfo.certificatePicRemark
                    ? doctorInfo.certificatePicRemark
                    : "暂无"
                }}
              </div>
            </FormItem>
            <FormItem label="是否齐全：" style="width: 250px;">
              <div v-if="doctorInfo.certificatePicStatus === 1">是</div>
              <div v-else-if="doctorInfo.certificatePicStatus === 3">否</div>
              <div v-else>--</div>
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
              </div>
            </FormItem>
            <FormItem label="职称证书备注：">
              <div>
                {{
                  doctorInfo.titlePicRemark ? doctorInfo.titlePicRemark : "暂无"
                }}
              </div>
            </FormItem>
            <FormItem label="是否齐全：" style="width: 250px;">
              <div v-if="doctorInfo.titlePicStatus === 1">是</div>
              <div v-else-if="doctorInfo.titlePicStatus === 3">否</div>
              <div v-else>--</div>
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
              </div>
            </FormItem>
          </div>
        </div>
        <Divider orientation="left">个人资料</Divider>
        <div class="content">
          <div class="ite">
            <FormItem label="身份证号：" prop="idCard">
              <Tag>{{ doctorInfo.idCard ? doctorInfo.idCard : "暂无" }}</Tag>
            </FormItem>
            <FormItem label="有效时间" prop="idCard">
              <Tag>{{doctorInfo.effectiveTime?doctorInfo.effectiveTime:'暂无'}}</Tag>
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
              </div>
            </FormItem>
          </div>
          <div class="ite">
            <FormItem label="银行卡号：" prop="certificatePicRemark">
              <Tag>{{doctorInfo.bankCardNumber?doctorInfo.bankCardNumber:'暂无'}}</Tag>
            </FormItem>
            <FormItem label="开户信息：" prop="certificatePicRemark">
               <Tag>{{doctorInfo.accountOpenInfo?doctorInfo.accountOpenInfo:'暂无'}}</Tag>
      
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
              
              </div>
            </FormItem>
          </div>
        </div>
      </Form>
    </div>
    <Modal title="查看大图" v-model="isShowBigImage" footer-hide>
      <img :src="currentImage" v-if="isShowBigImage" style="width: 100%" />
    </Modal>
    <Modal
      width="800"
      :title="selectIdText"
      v-model="isShowSelectList"
      footer-hide
      @on-cancel="handleCancel"
    >
      <selectId :sId="sId" ref="setId" @save="handleSave"></selectId>
    </Modal>
  </div>
</template>
<script>
import config from "@/config";
import ConstData from "@/utils/constData";
import AreaData from "@/utils/areaData2";
import apiDoctor from "@/api/apiDoctor";
import apiBase from "@/api/apiBase";
import helper from "@/utils/helper";
import selectId from "./selectID";

export default {
  components: { selectId },
  props: {
    doctorId: {
      type: Number,
      required: false,
      default: 0
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
      allAreas: AreaData.allAreas, //省市区地址
      currentArea: [],
      selectIdText: "", //选中绑定的文本
      sId: {}, //传递的不同类型sId
      isShowSelectList: false //是否选中列表
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
      //let baseUrl = 'http://172.16.3.118:8081/';
      return `${baseUrl}upload/image?collectionId=4`;
    }
  },
  mounted() {
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
    //加载
    loadDetail() {
      if (this.doctorId > 0) {
        apiDoctor.getDetail(this.doctorId).then(res => {
          let j = res.data;
          if (j.code === 200) {
            this.doctorInfo = j.data;
            //初始化省市区
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
            //初始化省市区
          } else {
            this.$Message.error(`加载医生详情失败，${j.message}`);
          }
        });
      }
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
    },

    // 部分字段处理后显示
    renderClinicPosition(id) {
      return ConstData.getClinicPositionName(id);
    },
    renderSex(sex) {
      return ConstData.getSexName(sex);
    },
    renderDigree(id) {
      return ConstData.getDigreeName(id);
    },
    handleSelectId(d) {
      this.isShowSelectList = true;
      switch (d) {
        case 2:
          this.selectIdText = "选择通行证ID";
          break;
        case 1:
          this.selectIdText = "选择就医助手ID";
          break;
        case 4:
          this.selectIdText = "第三方ID";
          break;
        default:
          break;
      }
      this.sId.id = d;
      this.sId.did = this.doctorInfo.id;
      setTimeout(() => {
        this.$refs.setId.handleSearch();
      }, 500);
    },
    handleCancel() {
      this.isShowSelectList = false;
      setTimeout(() => {
        this.$refs.setId.searchModel = {};
        let obj = this.$refs.setId.searchModel;
      }, 200);
    },
    handleSave() {
      this.isShowSelectList = false;
      this.loadDetail();
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
    //float: left;
    //display: inline-block;
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
  max-width: 65%;
}
.right-form {
  width: 35%;
}
.ivu-col {
  min-width: 200px !important;
}
.yes-button {
  margin-left: 20px;
}
.left-item {
  min-width: 100px;
  width: 100%;
  height: 76px;
  border-radius: 5px;
  border: 1px solid #dfdfdf;
  overflow-y: auto;
}
.pr {
  position: relative;
}
.memberId {
  display: flex;
  width: 200px;
}
.mem_input {
  width: 100px;
  margin-right: 10px;
}
.content {
  display: flex;
}
.ite {
  width: 300px;
}
</style>
