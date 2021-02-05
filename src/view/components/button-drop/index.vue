<template>
  <span>
    <Button :type="type" @click="$emit('click')" :size="size" :icon="icon" class="btnLeft">
      <slot></slot>
    </Button>
    <Dropdown @on-click="command" :trigger="trigger">
      <Button :type="type" icon="ios-arrow-down" :size="size" class="btnDown"></Button>
      <template slot="list">
        <slot name="list"></slot>
      </template>
    </Dropdown>
  </span>
</template>

<script>
export default {
  props: {
    /**
     * @description 按钮类型，可选值为 default、primary、dashed、text、info、success、warning、error
     */
    type: {
      type: String,
      default: "primary"
    },
    /**
     * @description 按钮大小，可选值为large、small、default或者不设置
     */
    size: String,
    /**
     * @description 触发方式，可选值为 hover（悬停）click（点击）contextMenu（右键），默认是hover
     */
    trigger: String,
    /**
     * @description 设置按钮的图标类型
     */
    icon: String
  },
  methods: {
    command: function(key) {
      this.$emit("command", key);
    }
  }
};
</script>
<style>
.btnDown {
  margin-left: 0 !important;
  padding-left: 5px !important;
  padding-right: 5px !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.btnLeft {
  margin-right: 0 !important;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
