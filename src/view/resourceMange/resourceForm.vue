<template>
  <div class="box">
    <i-form :label-width="80">
      <Row>
        <i-col :span="12"
          ><Form-item label="名称">
            <i-input type="text" v-model="resourceFormInfo.name">
            </i-input> </Form-item
        ></i-col>
        <i-col :span="12">
          <Form-item label="跳转url">
            <i-input type="text" v-model="resourceFormInfo.path"> </i-input>
          </Form-item>
        </i-col>
      </Row>
      <Row>
        <i-col :span="12">
          <Form-item label="类别">
            <i-select v-model="resourceFormInfo.type" style="width:150px;">
              <i-option
                v-for="(item, index) in list"
                :value="item.value"
                :key="index"
                >{{ item.label }}</i-option
              >
            </i-select>
          </Form-item>
        </i-col>
      </Row>
      <div class="switch">
        <div class="switch-item">
          <Form-item label="状态">
            <i-switch
              @on-change="statusChange"
              v-model="resourceFormInfo.status"
              size="large"
            >
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </Form-item>
        </div>
        <div class="switch-item">
          <Form-item label="是否显示">
            <i-switch
              @on-change="isShowChange"
              v-model="resourceFormInfo.isShow"
              size="large"
            >
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </Form-item>
        </div>
      </div>
    </i-form>
    <div class="btn_footer">
      <Button @click="handleCencal">取消</Button>
      <Button class="ml" type="primary" @click="handleSave">保存</Button>
    </div>
  </div>
</template>

<script>
import apiResource from "@/api/apiResource";
export default {
  props: {
    resourceFormId: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      id: this.resourceFormId,
      resourceFormInfo: {},
      loading: false,
      list: [
        {
          value: 1,
          label: "菜单"
        },
        {
          value: 2,
          label: "功能"
        },
        {
          value: 3,
          label: "模块"
        }
      ]
    };
  },
  watch: {
    resourceFormId(val) {
      if (val == 0) {
        this.resourceFormInfo = {};
      }
    }
  },
  methods: {
    getList(id) {
      apiResource.seleteAdminResource(id).then(res => {
        if (res.data.code == 200) {
          let j = res.data;
          this.resourceFormInfo = j.data;
          if (this.resourceFormInfo.status == 1) {
            this.resourceFormInfo.status = true;
          } else {
            this.resourceFormInfo.status = false;
          }
          if (this.resourceFormInfo.isShow == 1) {
            this.resourceFormInfo.isShow = true;
          } else {
            this.resourceFormInfo.isShow = false;
          }
        }
      });
    },
    handleCencal() {
      this.$emit("afterSaveSuccess");
    },
    statusChange(value) {
      if (value) {
        this.resourceFormInfo.status = 1;
      } else {
        this.resourceFormInfo.status = 0;
      }
    },
    isShowChange(value) {
      if (value) {
        this.resourceFormInfo.isShow = 1;
      } else {
        this.resourceFormInfo.isShow = 0;
      }
    },
    handleSave() {
      if (this.resourceFormId > 0) {
        apiResource.updateAdminResource(this.resourceFormInfo).then(res => {
          if (res.data.code == 200) {
            this.$Message.success("更新成功");
            this.$emit("afterSaveSuccess");
            this.resourceFormInfo = {};
          }
        });
      } else {
        apiResource.addResource(this.resourceFormInfo).then(res => {
          if (res.data.code == 200) {
            this.$Message.success("添加成功");
            this.$emit("afterSaveSuccess");
            this.resourceFormInfo = {};
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.box {
  padding: 30px;
  .item {
    margin-bottom: 30px;
    font-size: 16px;
  }
}
.btn_footer {
  display: flex;
  justify-content: center;
}
.switch {
  display: flex;
  .switch-item {
    width: 50%;
  }
}
.ml {
  margin-left: 30px;
}
</style>
