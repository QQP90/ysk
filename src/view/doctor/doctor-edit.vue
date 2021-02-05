<template>
    <div>
       <Form :model="DoctorData" ref="DoctorData" label-position="right" :rules="ruleDoctorData" :label-width="100" class="formData">
           <Row>
               <Col :span="8">
                    <FormItem label="医生姓名：" prop="name">
                         <Input v-model="DoctorData.name"></Input>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="性别：" prop="sex">
                         <Select v-model="DoctorData.sex">
                            <Option :value="0">未知</Option>
                            <Option :value="1">男</Option>
                            <Option :value="2">女</Option>
                        </Select>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="状态：" prop="status">
                         <Select v-model="DoctorData.status">
                            <Option :value="0">未审核</Option>
                            <Option :value="1">有效</Option>
                            <Option :value="2">删除</Option>
                            <Option :value="3">审核不通过</Option>
                        </Select>
                    </FormItem>
               </Col>
           </Row>
           <Row>
               <Col :span="8">
                    <FormItem label="毕业学校：" prop="school">
                        <Input v-model="DoctorData.school"></Input>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="社会任职：" prop="socialTitle">
                        <Input v-model="DoctorData.socialTitle"></Input>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="创建时间：" prop="createTime">
                          <DatePicker type="date" placeholder="Select date" v-model="DoctorData.createTime" style="width:100%;"></DatePicker>
                    </FormItem>
               </Col>
           </Row>
           <Row>
               <Col :span="8">
                    <FormItem label="开始工作年份："  prop="startedWork">
                        <Input v-model="DoctorData.startedWork"></Input>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="行政职称：" prop="teachPosition">
                         <Input v-model="DoctorData.teachPosition"></Input>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="来源：" prop="source">
                         <Select v-model="DoctorData.source">
                            <Option :value="0">医生库数据</Option>
                            <Option :value="1">就医助手</Option>
                            <Option :value="2">通行证</Option>
                            <Option :value="3">ASK</Option>
                              <Option :value="4">医信中心</Option>
                        </Select>
                    </FormItem>
               </Col>
           </Row>
           <Row>
               <Col :span="8">
                    <FormItem label="出诊备注：" prop="auditRemark">
                        <Input v-model="DoctorData.auditRemark"></Input>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="临床职称：" prop="clinicPosition">
                        <Input v-model="DoctorData.clinicPosition"></Input>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="学位：" prop="degree">
                        <Input v-model="DoctorData.degree"></Input>
                    </FormItem>
               </Col>
           </Row>
           <Row>
               <Col :span="8">
                    <FormItem label="擅长：" prop="goodat" >
                        <Input v-model="DoctorData.goodat"></Input>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="标题照片：" prop="titlePic">
                        <Upload action="//jsonplaceholder.typicode.com/posts/" v-model="DoctorData.titlePic">
                                <Button icon="ios-cloud-upload-outline">点击上传</Button>
                        </Upload>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="工作照片：" prop="workPic">
                        <Upload action="//jsonplaceholder.typicode.com/posts/" v-model="DoctorData.workPic">
                                <Button icon="ios-cloud-upload-outline">点击上传</Button>
                        </Upload>
                    </FormItem>
               </Col>
           </Row>
           <Row>
               <Col :span="8">
                    <FormItem label="修正后的头像：" prop="headPortraitCorrect">
                        <Upload action="//jsonplaceholder.typicode.com/posts/" v-model="DoctorData.headPortraitCorrect">
                                <Button icon="ios-cloud-upload-outline">点击上传</Button>
                        </Upload>
                    </FormItem>
               </Col>
               <Col :span="6">
                    <FormItem label="XX头像：" prop="certificatePic">
                        <Upload action="//jsonplaceholder.typicode.com/posts/" v-model="DoctorData.certificatePic">
                                <Button icon="ios-cloud-upload-outline">点击上传</Button>
                        </Upload>
                    </FormItem>
               </Col>
           </Row>
           <Row>
               <Col :span="8">
                    <FormItem label="头像：" prop="headPortrait">
                        <img width="100" :src="imgSrc">
                        <Upload action="//jsonplaceholder.typicode.com/posts/" v-model="DoctorData.headPortrait">
                                <Button icon="ios-cloud-upload-outline">点击上传</Button>
                        </Upload>
                    </FormItem>
               </Col>
               <Col :span="12">
                    <FormItem label="个人简介：" prop="introduceCn">
                        <Input v-model="DoctorData.introduceCn" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                    </FormItem>
               </Col>
           </Row>
           <Row>
               <Col :span="20">
                <FormItem label="操作：">
                    <Button type="primary" @click="submit">提交</Button>
                    <Button style="margin-left: 8px" @click="goBack">取消</Button>
                </FormItem>
               </Col>
           </Row>
    </Form>
    </div>
</template>

<script>
import { editDoctorInfo  } from '@/api/data'
export default {
    name: 'doctor_info',
    mounted () {
        console.log(this.$route.params)
        this.DoctorData = this.$route.params.Ddata;
        this.imgSrc = this.DoctorData.headPortrait
    },
    data() {
    return{
        DoctorData: {
          auditRemark: '',
          certificatePic:  '',
          clinicPosition:  '',
          createTime: '',
          degree:  '',
          goodat:  '',
          headPortrait:  '',
          headPortraitCorrect:  '',
          honor:  '',
          id:  '',
          introduceCn:  '',
          memberId:  '',
          modifyTime:  '',
          modifyUser:  '',
          name:  '',
          paper:  '',
          school:  '',
          sex:  '',
          socialTitle:  '',
          source:  '',
          startedWork:  '',
          status:  '',
          teachPosition:  '',
          titlePic:  '',
          workPic:  ''
        },
        ruleDoctorData: {
          name: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
          clinicPosition: [{ required: true, message: '临床职称不能为空', trigger: 'blur' }],
          goodat: [{ required: true, message: '擅长项目不能为空', trigger: 'blur' }],
          headPortrait: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
          introduceCn: [{ required: true, message: '个人简介不能为空', trigger: 'blur' }]
        }

    }
},
methods:{
    submit(){
                    this.$refs.DoctorData.validate((valid) => {
                        console.log('valid' , valid)
                        if(valid){
                            let params = {
                                "auditRemark": this.DoctorData.auditRemark,
                                "certificatePic": this.DoctorData.certificatePic,
                                "clinicPosition": this.DoctorData.clinicPosition,
                                "createTime": this.DoctorData.createTime ,
                                "degree": this.DoctorData.degree,
                                "goodat": this.DoctorData.goodat,
                                "headPortrait": this.DoctorData.headPortrait,
                                "honor": this.DoctorData.honor ,
                                "id": this.DoctorData.id,
                                "memberId": this.DoctorData.memberId,
                                "name": this.DoctorData.name ,
                                "paper": this.DoctorData.paper,
                                "school": this.DoctorData.school,
                                "sex": this.DoctorData.sex,
                                "socialTitle": this.DoctorData.socialTitle ,
                                "source": this.DoctorData.source,
                                "startedWork": this.DoctorData.startedWork,
                                "status": this.DoctorData.status ,
                                "teachPosition": this.DoctorData.teachPosition ,
                                "titlePic": this.DoctorData.titlePic,
                                "workPic": this.DoctorData.workPic,
                                "headPortraitCorrect":this.DoctorData.headPortraitCorrect
                            }
                            console.log('params', params)
                            editDoctorInfo('/doctorInfo', params).then(res =>{
                                console.log(res)
                                this.$Message.info('成功提交修改！');
                                this.$router.go(-1)
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    })
    },
    goBack(){
      this.$router.go(-1)
    }
}

}
</script>

<style>

</style>
