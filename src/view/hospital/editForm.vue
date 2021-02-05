<template>
  <div>
    <div class="form-box">
      <Form
        :model="hospitalInfo"
        ref="hospitalInfo"
        :rules="ruleValidate"
        label-position="right"
        :label-width="100"
        class="formData"
      >
        <div class="form-content">
          <div class="form-logo-map">
            <div class="logo-box">
              <img :src="hospitalInfo.pic" />
              <Upload
                :action="uploadUrl"
                :show-upload-list="false"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-success="handleUploadSuccess"
              >
                <Button icon="ios-cloud-upload-outline"> 点击上传</Button>
              </Upload>
            </div>
          </div>
          <div class="other-items">
            <Row>
              <Col :span="8">
                <FormItem label="省市区：" prop="areaId">
                  <Cascader :data="allAreas" v-model="currentArea"></Cascader>
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem label="性质：" :labelWidth="60" prop="nature">
                  <Select v-model="hospitalInfo.nature">
                    <Option
                      v-for="item in allNatures"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="6">
                <FormItem label="类型：" prop="hospitalType">
                  <Select v-model="hospitalInfo.hospitalType">
                    <Option
                      v-for="item in allTypes"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="6">
                <FormItem prop="grade" label="等级：">
                  <Select v-model="hospitalInfo.grade">
                    <Option
                      v-for="item in allGrades"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="12">
                <FormItem label="医院名称：" prop="name">
                  <Input v-model="hospitalInfo.name" />
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem label="是否下属分院：" prop="alias">
                  <i-switch v-model="isSubHospital" @on-change="handleSwitch">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                  </i-switch>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem
                  v-if="isSubHospital"
                  label="所属总院："
                  prop="parentId"
                >
                  <Select
                    v-model="hospitalInfo.parentId"
                    :loading="hospitalLoading"
                    remote
                    filterable
                    :remote-method="handleSearchHospital"
                    :label="hospitalInfo.parentName"
                    @on-change="handleSelectHospital"
                  >
                    <Option
                      v-for="option in parentHospitals"
                      :value="option.id"
                      :key="option.id"
                      :label="option.name"
                    ></Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="12">
                <FormItem label="别名：" prop="alias">
                  <Input v-model="hospitalInfo.alias" />
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem label="状态：" style="width:200px;" prop="status">
                  <Select v-model="hospitalInfo.status">
                    <Option :value="0">待审核</Option>
                    <Option :value="1">正常</Option>
                    <Option :value="2">删除</Option>
                    <Option :value="3">未通过</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="12">
                <FormItem label="医信中心:" prop="alias">
                  <Input v-model="hospitalInfo.outHospitalName" />
                </FormItem>
              </Col>
            </Row>
            <Divider orientation="left">联系信息</Divider>
            <Row>
              <Col :span="12">
                <FormItem label="详细地址：">
                  <Input v-model="hospitalInfo.address" />
                </FormItem>
              </Col>

              <Col :span="12">
                <FormItem label="医院总机：">
                  <Input v-model="hospitalInfo.telExchange" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="5">
                <FormItem label="经度：">
                  <Input v-model="hospitalInfo.longitude" />
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem label="纬度：" :labelWidth="60">
                  <Input v-model="hospitalInfo.latitude" />
                </FormItem>
              </Col>
              <Col :span="1" class="location-address">
                <Button
                  shape="circle"
                  type="info"
                  size="small"
                  icon="md-pin"
                  title="查看地图"
                  @click="handleShowMap"
                ></Button>
              </Col>
              <Col :span="6">
                <FormItem label="咨询电话：">
                  <Input v-model="hospitalInfo.hotline" />
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem label="医院官网：">
                  <Input v-model="hospitalInfo.website" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="12">
                <FormItem label="新闻网址：">
                  <Input v-model="hospitalInfo.newUrl" />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="咨询网址：">
                  <Input
                    v-model="hospitalInfo.consultUrl"
                    placeholder="医院在线咨询的跳转地址，一般为商务通"
                  />
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
        <Divider orientation="left">详细资料</Divider>
        <FormItem label="简介：" prop="intro">
          <Input
            v-model="hospitalInfo.intro"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="这里填写医院的简要介绍"
          />
        </FormItem>
        <FormItem label="先进设备：">
          <Input
            v-model="hospitalInfo.equipment"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="医院的先进设备、技术等"
          />
        </FormItem>
        <FormItem label="科研成果：">
          <Input
            v-model="hospitalInfo.scientific"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="主要的、重大的医学科研成果"
          />
        </FormItem>
        <FormItem label="荣誉成就：">
          <Input
            v-model="hospitalInfo.honor"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="医院获取的重大荣誉"
          />
        </FormItem>
      </Form>
    </div>
    <div class="form-action">
      <Button type="primary" @click="handleSave">保存</Button>
    </div>
    <Modal
      width="600px"
      :title="'查看医院位置：' + hospitalInfo.name"
      v-model="isShowMapView"
    >
      <div>
        <baidu-map
          class="baidumap"
          :center="{ lng: coordinate.lng, lat: coordinate.lat }"
          :zoom="15"
          :sroll-wheel-zoom="true"
          :mapStyle="{ styleJson: [] }"
          mapType="BMAP_NORMAL_MAP"
        >
          <bm-marker
            :position="{ lng: coordinate.lng, lat: coordinate.lat }"
            :dragging="true"
            @dragend="handleDrag"
          >
          </bm-marker>
          <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>

          <!-- <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation> -->
          <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation> -->
        </baidu-map>
        <div style="color: #999;text-align:center;">（可拖动红点选择定位）</div>
      </div>
      <div slot="footer">
        <Button @click="handleResetCoordinate">重置</Button>
        <Button type="primary" @click="handleConfirmCoordinate">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import config from "@/config";
import ConstData from "@/utils/constData";
import AreaData from "@/utils/areaData";
import apiHospital from "@/api/apiHospital";
import apiBase from "@/api/apiBase";

export default {
  props: {
    hospitalId: {
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
      allGrades: ConstData.arrayHospitalGrade, // 所有医院等级
      allTypes: ConstData.arrayHospitalType, // 所有医院类型
      allNatures: ConstData.arrayHospitalNature, // 所有医院性质
      parentHospitals: [], // 供Select用的医院列表
      hospitalInfo: {}, // 当前医院信息
      isSubHospital: false, // 是否分院
      hospitalLoading: false, // 医院列表记载中效果
      currentData: {}, // 当前编辑数据
      coordinate: {
        lng: 0,
        lat: 0
      },
      isShowMapView: false, // 是否显示医院位置地图
      allAreas: AreaData.allAreas, //省市区地址
      currentArea: []
    };
  },
  computed: {
    uploadUrl() {
      let baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      return `${baseUrl}upload/image?collectionId=3`;
    }
  },
  created() {
    //        this.loadAllAreas();
  },
  mounted() {
    console.log("hospital-edit-form", "mounted");
    this.loadDetail();
  },
  watch: {
    hospitalId() {
      if (this.hospitalId == 0) {
        this.hospitalInfo = {};
        this.currentArea = [];
        this.isSubHospital = false;
        this.coordinate = {
          lng: 0,
          lat: 0
        };
      } else {
        this.loadDetail();
      }
    }
  },
  methods: {
    loadDetail() {
      if (this.hospitalId > 0) {
        apiHospital.getDetail(this.hospitalId).then(res => {
          let j = res.data;
          if (j.code === 200) {
            this.hospitalInfo = j.data;
            if (j.data.parentId > 0) {
              this.isSubHospital = true;
            }
            this.currentArea = [];
            if (j.data.provinceId) {
              this.currentArea.push(j.data.provinceId);
            }
            if (j.data.cityId) {
              if (this.currentArea.indexOf(j.data.cityId) < 0) {
                this.currentArea.push(j.data.cityId);
              }
            }
            if (j.data.areaId) {
              if (this.currentArea.indexOf(j.data.areaId) < 0) {
                this.currentArea.push(j.data.areaId);
              }
            }
          } else {
            this.$Message.error(`加载医院详情失败，${j.message}`);
          }
        });
      }
    },
    handleSave() {
      if (this.isSubHospital === false) {
        this.hospitalInfo.parentId = 0;
      }
      if (this.currentArea.length == 2) {
        this.hospitalInfo.areaId = this.currentArea[1];
      }
      this.$refs.hospitalInfo.validate(valid => {
        if (valid) {
          apiHospital.save(this.hospitalInfo).then(res => {
            console.log(res);
            if (res.data.code === 200) {
              this.$Message.success("保存成功");
              this.$emit("afterSaveSuccess");
              //this.$parent.isShowHospitalEditForm = false;
              //this.$parent.handleSearch();
              // this.$emit('afterSaveSuccess', res.data.data)
            } else {
              this.$Message.error(res.data.message);
            }
          });
        } else {
          this.$Message.error("请检查输入项");
        }
      });
    },
    handleShowMap() {
      this.isShowMapView = true;
      this.handleResetCoordinate();
      console.log(this.coordinate);
    },
    handleSwitch(val) {
      if (val) {
        this.isSubHospital = true;
      } else {
        this.isSubHospital = false;
      }
      console.log(val);
    },
    //        loadAllAreas() {
    //            apiBase.getAllAreas().then(res => {
    //                if (res.data.code === 200) {
    //                    sessionStorage.setItem('allAreas',)
    //                    this.allAreas = res.data.data;
    //                }
    //            });
    //        },
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        if (res.data[0]) {
          this.$set(this.hospitalInfo, "pic", res.data[0]);
        } else {
          this.$Message.error(`医院Logo上传失败，${res.message}`);
        }
      } else {
        this.$Message.error(`医院Logo上传失败，${res.message}`);
      }
    },
    handleSearchHospital(keyword) {
      if (keyword) {
        this.hospitalLoading = true;
        let params = {
          hospitalName: keyword,
          pageNum: 1,
          pageSize: 100
        };
        // if (/\b\d+\b/.test(keyword)) {
        //     params.hospitalId = parseInt(keyword);
        // } else {
        //     params.hospitalName = keyword;
        // }
        apiHospital
          .search(params)
          .then(res => {
            this.hospitalLoading = false;
            if (res && res.status == 200) {
              let list = res.data.data.list.map(item => {
                return {
                  id: item.id,
                  name: item.name
                };
              });
              this.parentHospitals = list;
            }
          })
          .catch(err => {
            this.hospitalLoading = false;
            console.log(err);
          });
      }
    },
    handleSelectHospital(val) {
      console.log("选中的是：", val);
    },
    // 恢复之前的坐标
    handleResetCoordinate() {
      this.coordinate.lat = this.hospitalInfo.latitude;
      this.coordinate.lng = this.hospitalInfo.longitude;
    },
    // 确认坐标，将地图上标记的坐标应用到医院资料上
    handleConfirmCoordinate() {
      this.hospitalInfo.latitude = this.coordinate.lat;
      this.hospitalInfo.longitude = this.coordinate.lng;
      this.isShowMapView = false;
    },
    handleDrag(e) {
      this.coordinate.lat = e.point.lat;
      this.coordinate.lng = e.point.lng;
    },
    handleFormatError() {}
  }
};
</script>
<style lang="less" scoped>
.form-box {
  /*max-height: 600px;*/
  padding-right: 20px;
  overflow: auto;

  .form-content {
    display: flex;
    justify-content: space-between;

    .form-logo-map {
      .logo-box {
        width: 200px;
        padding-right: 5px;
        text-align: center;

        img {
          width: 100%;
        }
      }
      .map-box {
        width: 200px;
        height: auto;
        .baidumap {
          width: auto;
          height: 200px;
        }
      }
    }
    .other-items {
      flex: 1;
    }
  }
}
.form-action {
  text-align: right;
  border-top: 1px solid #e8eaec;
  padding: 10px 30px 0 0;
}
.baidumap {
  width: 570px;
  height: 500px;
}
.location-address {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 0 !important;
  height: 32px;
}
.ivu-form-item {
  margin-top: 0 !important;
}
</style>
