<template>
    <div>
        <Table border stripe  :columns="columns" :data="dataList"  :loading="loading"></Table>
        <div style="margin-top: 20px;">
            <Button type="primary" size="large" @click="handleNew">添加新地址</Button>
        </div>
        <Modal v-model="isShowEditForm" width="600">
            <p slot="header" style="text-align:left">
                <span v-if="currentData.id > 0">编辑地址</span>
                <span>新增地址</span>
            </p>
            <addressForm></addressForm>
            <div slot="footer">
                <Button type="warning" size="large">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import apiHospital from '@/api/apiHospital';
import addressForm from './addressForm'

export default {
    components: { addressForm },
    props:{
        hospitalId:{
            type: Number,
            required: true,
            default: 0
        }
    },
    data () {
        return {
            isShowEditForm: false, // 是否显示编辑弹窗
            dataList: [],
            currentData: {}, // 当前操作的数据
            columns: this.buildColumns(),
            loading: false,
            myProvince: [],
            myCity: [],
            myArea: [],
            isRequiredCity: true,
            ruleValidate: {
                street:  [{ required: true, message: '街道', trigger: 'blur' }],
                province: [{ required: true, message: '省份不能为空', trigger: 'change' }],
                city: [{ required: true, message: '城市不能为空', trigger: 'change' }],
                area: [{ required: true, message: '县区不能为空', trigger: 'change' }],
                areaId: [{ required: true, message: '地区编码不能为空', trigger: 'blur' }],
                latitude: [{ required: true, message: '经度', trigger: 'blur' }],
                longitude: [{ required: true, message: '纬度', trigger: 'blur' }],
                areaId: [{ required: true, message: '纬度', trigger: 'blur' }],
                id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }]
            }
        }
    },
    watch: {
        hospitalId() {
            console.log('watch hospitalId', this.hospitalId);
            this.loadData();
        }
    },
    mounted () {
        console.log(this.hospitalId)
    },
    methods: {
        buildColumns() {
            return [
                {
                    title: '医院ID',
                    key: 'id',
                    minWidth: 70,
                },{
                    title: '地区编码',
                    key: 'areaId',
                    minWidth: 80,
                },{
                    title: '街道',
                    key: 'street',
                    minWidth: 80,
                },{
                    title: '区',
                    key: 'area',
                    minWidth: 60,
                },
                {
                    title: '市',
                    key: 'city',
                    minWidth: 80,
                },{
                    title: '省份',
                    key: 'province',
                    minWidth: 80,
                },{
                    title: '国家',
                    key: 'country',
                    minWidth: 60,
                },{
                    title: '经度',
                    key: 'latitude',
                    minWidth: 100,
                },{
                    title: '纬度',
                    key: 'longitude',
                    minWidth: 100,
                },{
                    title: '公交',
                    key: 'bus',
                    minWidth: 80,
                },{
                    title: '地铁',
                    key: 'metro',
                    minWidth: 80,
                },{
                    title: '邮编',
                    key: 'postcode',
                    minWidth: 70,
                },
                {
                    title: 'Action',
                    key: 'action',
                    width: 130,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.openAdd(1)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                }
                            }, '删除')
                        ])
                    }
                }

            ];
        },
        loadData() {
            if (this.hospitalId > 0) {
                apiHospital.getAddresses(this.hospitalId).then(res => {
                    let j = res.data;
                    console.log('加载地址列表',j);
                    if (j.code === 200) {
                        this.dataList = j.data.list;
                    } else {
                        this.$Message.error(`加载失败，${j.message}`);
                    }
                });
            }
        },
        handleNew() {
            this.isShowEditForm = true;
            this.currentData = { id: 0 };
        },
        GetInitArea () {
            initCityList('/areaInfos?parentId=0').then(res => {
                if(res.status == 200) {
                    this.myProvince = res.data.data
                }
            }).catch(err => {

            })
        },
        selectCity (value) {
            this.myCity = []
            this.formData.city = ''
            this.myArea = []
            this.formData.area = ''
            initCityList(`/areaInfos?parentId=${value}`).then(res => {
                console.log('res', res)
                if(res.status == 200) {
                    if(res.data.data[0].id.length == 6){
                        this.myArea = res.data.data
                        this.isRequiredCity = false
                    }else{
                        this.myCity = res.data.data
                        this.isRequiredCity = true
                    }
                }
            }).catch(err => {

            })

        },
        selectArea (value) {
            if(value == "市辖区") {
                return false
            }
            this.myArea = []
            this.formData.area = ''
            initCityList(`/areaInfos?parentId=${value}`).then(res => {
                if(res.status && res.status == 200) {
                    this.myArea = res.data.data
                }
            }).catch(err => {

            })
        },
        submitAddressOk () {
            this.$refs.formData.validate((valid) => {
                console.log('valid' , valid)
                if(valid){
                    let params = {
                        "id": this.formData.id,
                        "province": this.formData.province,
                        "city": this.formData.city || '市辖区',
                        "area": this.formData.area || undefined,
                        "longitude": this.formData.longitude,
                        "latitude": this.formData.latitude,
                        "street": this.formData.street,
                        "postcode": this.formData.postcode || undefined,
                        "metro": this.formData.metro || undefined,
                        "areaId": this.formData.area,
                        "bus": this.formData.bus || undefined
                    }
                    console.log('params', params)
                    submitAddress('/hospitalAddress', params).then(res =>{
                        console.log(res)

                    }).catch(err => {

                    })

                }


            })
        },
        cancelSite () {
            // 关闭添加地址模板
            this.addAddress = false
            // 关闭form 校验
            this.$refs.formData.resetFields()
        }
    }
}
</script>

<style>

</style>
