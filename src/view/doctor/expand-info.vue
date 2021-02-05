<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
    .dl, .dl dt, .dl dd {
        clear:left;
    }
    dt {
        font-weight: bold;
    }
</style>
<template>
    <div class="expand-row">
        <dl class="dl">
            <dt>简介：</dt>
            <dd v-html="row.introduceCn"></dd>
            <dt>擅长：</dt>
            <dd v-html="row.goodat"></dd>
            <dt>荣誉：</dt>
            <dd v-html="row.honor"></dd>
        </dl>
    </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
}
</script>
