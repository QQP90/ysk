<template>
    <div>
        <Form :model="doctorInfo" ref="doctorInfo" :label-width="100" :rules="ruleDoctorData">
            <Row>
                <Col :span="8">
                    <FormItem label="医生姓名" prop="name">
                        <Input type="text" v-model="doctorInfo.name"></Input>
                    </FormItem>
                </Col>
                <Col :span="8">
                    <FormItem label="性别：" prop="sex">
                         <Select v-model="doctorInfo.sex">
                            <Option :value="0">未知</Option>
                            <Option :value="1">男</Option>
                            <Option :value="2">女</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="8">
                    <FormItem  label="学位" style="padding-left:10px;" prop="degree">
                        <Input type="text" v-model="doctorInfo.degree"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="8">
                    <FormItem  label="擅长" prop="goodat">
                        <Input type="text" v-model="doctorInfo.goodat"></Input>
                    </FormItem>
                </Col>
                <Col :span="8">
                    <FormItem  label="创建时间" prop="createTime">
                        <DatePicker type="date" placeholder="Select date" v-model="doctorInfo.createTime" style="width:100%;"></DatePicker>
                    </FormItem>
                </Col>
               <Col :span="8">
                    <FormItem label="来源：" prop="source">
                         <Select v-model="doctorInfo.source">
                            <Option :value="0">医生库数据</Option>
                            <Option :value="1">就医助手</Option>
                            <Option :value="2">通行证</Option>
                            <Option :value="3">ASK</Option> 
                            <Option :value="4">医信中心</Option>
                              <Option :value="5">贵健康</Option>
                        </Select>
                    </FormItem>
               </Col>
            </Row>
            <Row>
               <Col :span="8">
                    <FormItem label="毕业学校：" prop="school">
                        <Input v-model="doctorInfo.school"></Input>
                    </FormItem>
               </Col>
               <Col :span="8">
                    <FormItem label="通行证ID："  prop="memberId">
                        <Input v-model="doctorInfo.memberId"></Input>
                    </FormItem>
               </Col>
               <Col :span="8">
                    <FormItem label="出诊备注："  prop="auditRemark">
                        <Input v-model="doctorInfo.auditRemark"></Input>
                    </FormItem>
               </Col>
            </Row>
            <Row>
               <Col :span="8">
                    <FormItem label="临床职称："  prop="clinicPosition">
                        <Select placeholder="请选择" v-model="doctorInfo.clinicPosition">
                            <Option v-for="item in allClinicPosition" :key="item.id" value="item.id">
                                {{item.name}}
                            </Option>
                        </Select>
                    </FormItem>
               </Col>
               <Col :span="8">
                    <FormItem label="社会任职：" prop="socialTitle">
                        <Input v-model="doctorInfo.socialTitle"></Input>
                    </FormItem>
               </Col>
               <Col :span="8">
                    <FormItem label="开始工作年份：" prop="startedWork">
                          <DatePicker type="date" placeholder="Select date" v-model="doctorInfo.startedWork" style="width:100%;"></DatePicker>
                    </FormItem>
               </Col>
            </Row>
            <Row>
               <Col :span="24">
                    <FormItem label="发表论文：" prop="paper">
                        <Input v-model="doctorInfo.paper" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                    </FormItem>
               </Col>
            </Row>
            <Row>
               <Col :span="24">
                    <FormItem label="荣誉成就：" prop="honor">
                        <Input v-model="doctorInfo.honor" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                    </FormItem>
               </Col>
            </Row>
            <Row>
               <Col :span="24">
                    <FormItem label="个人简介：" prop="introduceCn">
                        <Input v-model="doctorInfo.introduceCn" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                    </FormItem>
               </Col>
            </Row>
            <Row>
               <Col :span="12">
                    <FormItem label="医生头像：" prop="headPortrait">
                        <Upload action="//jsonplaceholder.typicode.com/posts/" v-model="doctorInfo.headPortrait">
                                <Button icon="ios-cloud-upload-outline">点击上传</Button>
                        </Upload>
                    </FormItem>
               </Col>
               <Col :span="12">
                    <FormItem label="标题图片：" prop="titlePic">
                        <Upload action="//jsonplaceholder.typicode.com/posts/" v-model="doctorInfo.titlePic">
                                <Button icon="ios-cloud-upload-outline">点击上传</Button>
                        </Upload>
                    </FormItem>
               </Col>
            </Row>
            <Row>
               <Col :span="12">
                    <FormItem label="证书照片：" prop="certificatePic">
                        <Upload action="//jsonplaceholder.typicode.com/posts/" v-model="doctorInfo.certificatePic">
                                <Button icon="ios-cloud-upload-outline">点击上传</Button>
                        </Upload>
                    </FormItem>
               </Col>
               <Col :span="12">
                    <FormItem label="工作照片：" prop="workPic">
                        <Upload action="//jsonplaceholder.typicode.com/posts/" v-model="doctorInfo.workPic">
                                <Button icon="ios-cloud-upload-outline">点击上传</Button>
                        </Upload>
                    </FormItem>
               </Col>
            </Row>
            <FormItem label="操作：">
                <Button type="primary" @click="submit">提交</Button>
                <!-- <Button style="margin-left: 8px" @click="goBack">取消</Button> -->
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { addDoctorInfo  } from '@/api/data'
import ConstData from '@/utils/constData'

export default {
    props:{
        doctorInfo:{
            type:Object,
            required:false
        }
    },
    data () {
        return {
            allClinicPosition: ConstData.arrayClinicPosition,
            loading: false,
            dataCount: 0,
            pageSize: 20,
            pageIndex: 1,
            // doctorInfo: {

            // },
            ruleDoctorData: {
              name: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
              clinicPosition: [{ required: true, message: '临床职称不能为空', trigger: 'blur' }],
              goodat: [{ required: true, message: '擅长项目不能为空', trigger: 'blur' }],
              headPortrait: [{ required: true, message: '医生头像不能为空', trigger: 'blur' }],
              introduceCn: [{ required: true, message: '个人简介不能为空', trigger: 'blur' }]
            }
        }
    },
    methods: {
        submit(){
          console.log(this.$refs.doctorInfo)
                    this.$refs.doctorInfo.validate((valid) => {
                        console.log('valid' , valid)
                        if(valid){
                            let params = {
                                "auditRemark": this.doctorInfo.auditRemark,
                                "certificatePic": this.doctorInfo.certificatePic,
                                "clinicPosition": this.doctorInfo.clinicPosition,
                                "createTime": this.doctorInfo.createTime ,
                                "degree": this.doctorInfo.degree,
                                "goodat": this.doctorInfo.goodat,
                                "headPortrait": this.doctorInfo.headPortrait,
                                "honor": this.doctorInfo.honor ,
                                "id": this.doctorInfo.id,
                                "memberId": this.doctorInfo.memberId,
                                "name": this.doctorInfo.name ,
                                "paper": this.doctorInfo.paper,
                                "school": this.doctorInfo.school,
                                "sex": this.doctorInfo.sex,
                                "socialTitle": this.doctorInfo.socialTitle ,
                                "source": this.doctorInfo.source,
                                "startedWork": this.doctorInfo.startedWork,
                                "status": 1 ,
                                "teachPosition": this.doctorInfo.teachPosition ,
                                "titlePic": this.doctorInfo.titlePic,
                                "workPic": this.doctorInfo.workPic,
                                "headPortraitCorrect":this.doctorInfo.headPortraitCorrect
                            }
                            console.log('params', params)
                            addDoctorInfo('/doctorInfo', params).then(res =>{
                                console.log(res)
                                this.$parent.showDoctor.num = -1
                                this.$Message.info('提交成功！');
                            }).catch(err => {
                            })
                        }
                    })
        },
        changePage (value) {
            this.pageIndex = value
            this.getHospitalTable()
        },
        changePageSize (value) {
            this.pageSize = value
            this.getHospitalTable()
        },
        clickModalCancel () {
            this.$parent.showDoctor.num = -1
        },
        clickOk () {
            this.$parent.showDoctor.num = -1
        }
    }

}
</script>

<style scoped>
.box-footer {
    width: 100%;
    padding: 20px 0;
    position: relative;

}
.pageing {
    float: right;
    padding-right: 20px;
}
</style>
