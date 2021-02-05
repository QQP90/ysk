<template>
  <div class="app-container">
    <div class="toolbar-top">
      <Form inline :label-width="60">
        <Row>
          <FormItem :label-width="130" label="页面展示信息：">
            <CheckboxGroup v-model="currentData.type">
              <Checkbox label="1">文章</Checkbox>
              <Checkbox label="2">视频</Checkbox>
              <Checkbox label="3">音频</Checkbox>
              <Checkbox label="4">问答</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Row>
        <Row>
          <i-col span="4">
            <FormItem :label-width="130" label="页面模块推荐："></FormItem>
          </i-col>
          <i-col span="5">
            <FormItem :label-width="40" label="文章">
              <Input type="text" v-model="currentData.article" />
            </FormItem>
          </i-col>
          <i-col span="5">
            <FormItem :label-width="40" prop="name" label="视频">
              <Input type="text" v-model="currentData.video" />
            </FormItem>
          </i-col>
          <i-col span="5">
            <FormItem :label-width="40" prop="name" label="音频">
              <Input type="text" v-model="currentData.audio" />
            </FormItem>
          </i-col>
          <i-col span="5">
            <FormItem :label-width="40" prop="name" label="问答">
              <Input type="text" v-model="currentData.question" />
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <FormItem :label-width="130" label="PCBANNER图：">
              <div class="image-list">
                <div
                  class="image-item"
                  v-if="pcimgs.length > 0"
                  v-for="(item, index) in pcimgs"
                  :key="index"
                >
                  <img :src="item" />
                  <div class="image-item-cover">
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleView(item)"
                    ></Icon>
                    <Icon
                      type="ios-trash-outline"
                      @click.native="handleRemoveIdCardPic(item, 1)"
                    ></Icon>
                  </div>
                </div>
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handlePCpic"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block width:118px "
                >
                  <div style="width: 118px height:118px line-height: 118px ">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
          </i-col>
          <FormItem :label-width="130" label="wapBANNER图：">
            <div class="image-list">
              <div
                class="image-item"
                v-if="wapimgs.length > 0"
                v-for="(item, index) in wapimgs"
                :key="index"
              >
                <img :src="item" />
                <div class="image-item-cover">
                  <Icon
                    type="ios-eye-outline"
                    @click.native="handleView(item)"
                  ></Icon>
                  <Icon
                    type="ios-trash-outline"
                    @click.native="handleRemoveIdCardPic(item, 2)"
                  ></Icon>
                </div>
              </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-success="handleWAPpic"
                multiple
                type="drag"
                :action="uploadUrl"
                style="display: inline-block width:118px "
              >
                <div style="width: 118px height:118px line-height: 118px ">
                  <Icon type="ios-camera" size="40"></Icon>
                </div>
              </Upload>
            </div>
          </FormItem>
        </Row>
        <Row>
          <i-col span="24">
            <FormItem :label-width="130" label="PC链接：">
              <Input style="width:500px" v-model="currentData.pcurl" />
            </FormItem>
          </i-col>
          <FormItem :label-width="130" label="WAP链接：">
            <Input style="width:500px" v-model="currentData.wapurl" />
          </FormItem>
        </Row>
        <Row>
          <FormItem :label-width="130" label="状态：">
            <Radio-group v-model="currentData.status">
              <Radio label="1">正常</Radio>
              <Radio label="2">暂扣</Radio>
              <Radio label="3">初稿</Radio>
            </Radio-group>
          </FormItem>
        </Row>
        <FormItem style="text-align:right margin:10px 10px 0 0 ">
          <Button
            type="primary"
            icon="ios-checkmark-circle-outline"
            @click="handleSave"
            >保存</Button
          >
        </FormItem>
      </Form>
      <Modal title="查看大图" v-model="allShowimg" footer-hide>
        <img :src="currentImage" v-if="allShowimg" style="width: 100%" />
      </Modal>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import apiDoctor from "@/api/apiDoctor";
export default {
  data() {
    return {
      pcimgs: [],
      currentData: {
        type: [],
        status: -1,
        pcurl: "",
        wapurl: "",
        pcbanner: "",
        wapbanner: "",
        doctorId: 0
      },
      allShowimg: false,
      currentImage: "",
      wapimgs: [],
      loading: false
    };
  },
  props: {
    Id: Number,
    default: 0
  },
  created() {
    this.getData();
  },
  computed: {
    uploadUrl() {
      let baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      return `${baseUrl}upload/image?collectionId=4`;
    }
  },

  methods: {
    getData(id) {
      this.loading=true
      apiDoctor.GetDoctorHome(id).then(res => {
        if (res.data.code == 200) {
          this.loading=false
          if (res.data.data) {
            let j = res.data;
            this.currentData = j.data;

            this.currentData.status = j.data.status.toString();
            this.currentData.type = this.currentData.type.split(",");
            delete this.currentData.pcbanner;
            delete this.currentData.wapbanner;
            if (j.data.pcbanner) {
              this.pcimgs.push(j.data.pcbanner);
            }
            if (j.data.wapbanner) {
              this.wapimgs.push(j.data.wapbanner);
            }
          }
          else {
            this.currentData = {
              type: [],
              status: -1,
              pcurl: "",
              wapurl: "",
              pcbanner: "",
              wapbanner: "",
              doctorId: 0
            };
            this.currentImage = "";
            this.wapimgs = [];
            this.pcimgs = [];
          }
        }
      });
    },

    handlePCpic(res, file) {
      if (this.pcimgs.length >= 1) {
        this.$Message.warning("只能添加一张banner图片");
        return;
      }
      if (res.code === 200) {
        if(res.data[0]){
          this.pcimgs.push(res.data[0]);
        }else{
          this.$Message.error("图片上传失败")
        }
        
      }
      else{
        this.$Message.error("图片上传失败")
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传图片格式不正确",
        desc: "文件 " + file.name + " 非允许的图片格式，请上传jpg、png格式图片"
      });
    },
    handleWAPpic(res, file) {
      if (this.wapimgs.length >= 1) {
        this.$Message.warning("只能添加一张banner图片");
        return;
      }
      if (res.code === 200) {
        if(res.data[0]){
          this.wapimgs.push(res.data[0]);
        }else{
           this.$Message.error("添加图片失败")
        }
        
      }else{
        this.$Message.error("添加图片失败")
      }
    },
    // 查看全图
    handleView(url) {
      this.allShowimg = true;
      this.currentImage = url;
    },
    // 删除图片
    handleRemoveIdCardPic(url, num) {
      if (num === 1) {
        this.pcimgs.splice(0, 1);
      } else {
        this.wapimgs.splice(0, 1);
      }
    },

    // 保存
    handleSave() {
      this.loading = true;
      let str = this.currentData.type.join(",");
      this.currentData.type = str;
      if (this.pcimgs.length > 0) {
        this.currentData.pcbanner = this.pcimgs.join("");
      }
      if (this.wapimgs.length > 0) {
        this.currentData.wapbanner = this.wapimgs.join("");
      }
      this.currentData.doctorId = this.Id;
      apiDoctor.PostDoctorHome(this.currentData).then(res => {
        this.loading = false;
        if (res.data.code == 200) {
          this.$emit("close");
          this.$Message.success("保存成功");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.image-list {
  max-width: 372px;
  display: flex;
  flex-wrap: wrap;
}
.image-item {
  //float: left
  //display: inline-block
  width: 320px;
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
