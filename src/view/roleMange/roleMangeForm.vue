<template>
  <div>
    <div class="box">
      <div class="form">
        <i-form>
          <Form-item v-if="currentReloId > 0" label="ID:" :label-width="80">
            <i-input
              class="i-input"
              type="text"
              v-model="currentsystemLogoInfo.id"
            >
            </i-input>
          </Form-item>
          <Form-item label="名称:" :label-width="80">
            <i-input
              class="i-input"
              type="text"
              v-model="currentsystemLogoInfo.name"
            >
            </i-input>
          </Form-item>
          <Form-item label="描述:" :label-width="80">
            <i-input
              class="i-input"
              type="text"
              v-model="currentsystemLogoInfo.description"
            >
            </i-input>
          </Form-item>
        </i-form>
      </div>
      <div class="tree">
        <Tree
          :data="baseData"
          show-checkbox
          @on-check-change="selectItem"
        ></Tree>
      </div>
    </div>
    <div class="bottom">
      <Button @click="handleCancel">取消</Button>
      <Button @click="handleClickBtm" type="primary">确定</Button>
    </div>
  </div>
</template>

<script>
import apiSystem from "@/api/apiSystem";
export default {
  props: {
    currentReloId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      id: this.currentReloId,
      currentsystemLogoInfo: {},
      baseData: [],
      resourceIds: [],
      loading: false
    };
  },
  watch: {
    currentReloId(val) {
      console.log(val);
      if (val == 0) {
        console.log(val);
        this.currentsystemLogoInfo = {};
        this.baseData = [];
        this.resourceIds = [];
      }
    }
  },
  methods: {
    getList() {
      apiSystem.AdminReloListiD(this.currentReloId).then(res => {
        if (res.data.code == 200) {
          let j = res.data;
          this.currentsystemLogoInfo = j.data;
        }
      });
    },
    // 获取树形
    allResourceTree() {
      let ps = { roleId: this.currentReloId };
      if (this.currentReloId > 0) {
        apiSystem.allResourceTree(ps).then(res => {
          this.baseData = res.data.data;
        });
      } else {
        apiSystem.allResourceTree({ roleId: 0 }).then(res => {
          this.baseData = res.data.data;
          for (var i = 0; i < this.baseData.length; i++) {
            if (this.baseData[i].id) {
              this.resourceIds.push(this.baseData[i].id);
              this.baseData[i].checked = true;
            }
            if (this.baseData[i].children) {
              for (var j = 0; j < this.baseData[i].children.length; j++) {
                if (this.baseData[i].children[j].id) {
                  this.baseData[i].children[j].checked = true;
                  this.resourceIds.push(this.baseData[i].children[j].id);
                }
                if (this.baseData[i].children[j].children) {
                  for (
                    var k = 0;
                    k < this.baseData[i].children[j].children.length;
                    k++
                  ) {
                    if (this.baseData[i].children[j].children[k].id) {
                      this.baseData[i].children[j].checked = true;
                      this.resourceIds.push(
                        this.baseData[i].children[j].children[k].id
                      );
                    }
                  }
                }
              }
            }
          }
        });
      }
    },
    handleCancel() {
      this.$emit("afterSaveSuccess");
    },
    selectItem(item) {
      this.resourceIds = item.map(v => {
        return v.id;
      });
    },
    handleClickBtm() {
      this.loading = true;
      let ps = { ...this.currentsystemLogoInfo, resourceIds: this.resourceIds };
      if (this.currentReloId > 0) {
        apiSystem.updateRole(ps).then(res => {
          if (res.data.code == 200) {
            this.loading = false;
            this.$Message.success("编辑成功");
            this.$emit("afterSaveSuccess");
          }
        });
      } else {
        //  delete ps['id']
        apiSystem.addRole(ps).then(res => {
          if (res.data.code == 200) {
            this.loading = false;
            this.$Message.success("添加成功");
            this.$emit("afterSaveSuccess");
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
  display: flex;
  .item {
    margin-bottom: 30px;
    font-size: 16px;
  }
}
.tree {
  margin-left: 50px;
}
.i-input {
  width: 200px;
}
.bottom {
  display: flex;
  justify-content: space-between;
}
</style>
