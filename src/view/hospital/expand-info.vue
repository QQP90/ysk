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
            <dt>医院简介：</dt>
            <dd v-html="row.intro"></dd>
            <dt>医院荣誉：</dt>
            <dd v-html="row.honor"></dd>
            <dt>医院设备：</dt>
            <dd v-html="row.equipment"></dd>
        </dl>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>