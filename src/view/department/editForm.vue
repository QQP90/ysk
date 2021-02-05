<template>
    <div>
        <Form :model="departmentInfo" ref="departmentEditForm" :rules="ruleDepartment" :label-width="50">
            <FormItem label="类型" prop="name">
                <Select v-model="departmentInfo.labTypeId" filterable>
                    <Option v-for="(option, index) in allDepartmentTypes" :value="option.id" :key="index">{{option.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="名称" prop="name">
                <Input v-model="departmentInfo.name" placeholder="标签名称请控制在10字内" />
            </FormItem>
            <FormItem label="简介" prop="intro">
                <Input v-model="departmentInfo.intro" type="textarea" :rows="6" />
            </FormItem>
            <FormItem label="电话" prop="phone">
                <Input v-model="departmentInfo.phone" placeholder="标签名称请控制在10字内" />
            </FormItem>
            <FormItem label="地址" prop="address">
                <Input v-model="departmentInfo.address" placeholder="标签名称请控制在10字内" />
            </FormItem>
            <FormItem label="状态">
                <i-switch v-model="departmentInfo.status" :true-value="1" :false-value="2" size="large" @on-change="switchChange">
                    <span slot="open">正常</span>
                    <span slot="close">删除</span>
                </i-switch>
            </FormItem>
            <FormItem style="text-align:right;margin:10px 10px 0 0;">
                <Button type="primary" icon="ios-checkmark-circle-outline" @click="handleSave">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import apiDepartment from '@/api/apiDepartment'

export default {

    model: {
        event: 'afterSaveSuccess'
    },
    props: {
        departmentInfo: Object,
        departmentId: Number,
        hospitalId:Number,
    },
    data() {
        return {
            allDepartmentTypes: [], // 所有所有科室类型，供Select用
            loadingType: false, // 是否正在加载allDepartmentTypes
            currentDepartment: {}, // 当前科室
            ruleDepartment: {
                name: [{ required: true, message: '科室名称不能为空', trigger: 'blur' }]
            }
        };
    },
    mounted() {
        this.loadAllDepartmentType();
        this.switchChange();
    },
    methods: {
        // 加载科室类型
        loadAllDepartmentType(keyword) {
            apiDepartment.getTypeList({
                name: keyword,
                pageNum: 1,
                pageSize: 1000
            }).then(res => {
                let j = res.data;
                if (j.code === 200) {
                    this.allDepartmentTypes = j.data.list;
                }
            });
        },
        //switch状态改变
      switchChange(status){
          if(typeof (status)=='undefined'){
            this.departmentInfo=Object.assign(this.departmentInfo,{'status':1})
          }
      },
        // 保存表单
        handleSave() {
            this.$refs.departmentEditForm.validate((valid) => {
                if (valid) {
                    apiDepartment.save({
                        id: this.departmentInfo.id,
                        name: this.departmentInfo.name,
                        intro: this.departmentInfo.intro,
                        phone: this.departmentInfo.phone,
                        address: this.departmentInfo.address,
                        status: this.departmentInfo.status?this.departmentInfo.status:1,
                        labTypeId: this.departmentInfo.labTypeId,
                        hospitalId:this.hospitalId,
                    }).then(res => {
                        console.log(res);
                        if (res.data.code === 200) {
                            this.$Message.success("保存成功");
                            // 触发自定义事件
                            this.$emit('afterSaveSuccess', res.data.data)
                        } else {
                            this.$Message.error(res.data.message);
                        }
                    });
                }
            });
        }
    }
}
</script>
<style lang="less" scoped>

</style>
