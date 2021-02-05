<template>
  <div>
    <div class="box">
      <div class="form">
        <i-form>
          <Form-item label="名称:" :label-width="80">
            <i-input
              class="i-input"
              type="text"
              v-model="currentsystemLogoInfo.realName"
            >
            </i-input>
          </Form-item>
          <Form-item label="部门:" :label-width="80">
            <i-input
              class="i-input"
              type="text"
              v-model="currentsystemLogoInfo.department"
            >
            </i-input>
          </Form-item>
          <Form-item label="备注:" :label-width="80">
            <i-input
              class="i-input"
              type="text"
              v-model="currentsystemLogoInfo.petName"
            ></i-input>
          </Form-item>
        </i-form>
      </div>
      <div class="tree">
        <Tree
          :data="baseData"
          show-checkbox
          :render="renderContent"
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
import { seleteAdminUser, allRoleList, updateAdminUser } from "@/api/user";
export default {
  props: {
    currentsystemLogId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentsystemLogoInfo: {},
      baseData: [],
      roleIds: [],
      loading: false,
    };
  },
  methods: {
    getList() {
      seleteAdminUser(this.currentsystemLogId).then(res => {
        if (res.data.code == 200) {
          let j = res.data;
          this.currentsystemLogoInfo = j.data;
        }
      });
    },
    // 获取树形
    allResourceTree() {
    //   let ps = { userId: this.currentsystemLogId };
      allRoleList(this.currentsystemLogId).then(res => {
        this.baseData = res.data.data;
      });
    },
    renderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span',[
            h('Icon', {
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.name)
          ])
        ]);
      },
    handleCancel() {
      this.$emit("afterSaveSuccess");
    },
    selectItem(item) {
      this.roleIds = item.map(v => {
        return v.id;
      });
    },
    handleClickBtm() {
      this.loading = true;
      let ps = { ...this.currentsystemLogoInfo, roleIds: this.roleIds };
      updateAdminUser(ps).then(res => {
        if (res.data.code == 200) {
          this.loading = false;
          this.$Message.success("编辑成功");
          this.$emit("afterSaveSuccess");
        }
      });
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
