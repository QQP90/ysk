<template>
    <div>
        <div style="width: 500px;height: auto;">
            <baidu-map class="baidumap" :center="{lng: coordinate.longitude, lat: coordinate.latitude }" :zoom="15" :sroll-wheel-zoom="true" :mapStyle="{styleJson: mapStyle}" mapType="BMAP_NORMAL_MAP">
                <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-marker :position="{lng: coordinate.longitude, lat: coordinate.latitude}" :dragging="true" @dragend="handleDrag">
                </bm-marker>
                <!-- <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation> -->
                <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation> -->
            </baidu-map>
            <div style="color: #999;text-align:center;">（可拖动红点选择定位）</div>
        </div>
        
    </div>
</template>
<script>

export default {
    props: {
        coordinate: {
            type: Object,
            required: true,
            default: 0
        }
    },
    data() {
        return {
            mapStyle: [],
            ruleValidate: {
                street:  [{ required: true, message: '街道', trigger: 'blur' }],
                province: [{ required: true, message: '省份不能为空', trigger: 'change' }],
                city: [{ required: true, message: '城市不能为空', trigger: 'change' }],
                area: [{ required: true, message: '县区不能为空', trigger: 'change' }],
                areaId: [{ required: true, message: '地区编码不能为空', trigger: 'blur' }],
                latitude: [{ required: true, message: '经度', trigger: 'blur' }],
                longitude: [{ required: true, message: '纬度', trigger: 'blur' }],
                areaId: [{ required: true, message: '纬度', trigger: 'blur' }]
            }
        };
    },
    mounted() {
        
    },
    methods: {
        handleDrag(e) {
            this.currentData.latitude = e.point.lat;
            this.currentData.longitude = e.point.lng;
        }
    }
}
</script>
<style lang="less" scoped>
.baidumap {
    width: auto;
    height: 500px;
}
</style>
