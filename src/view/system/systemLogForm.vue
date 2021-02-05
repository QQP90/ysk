<template>
  <div class="box">
        <div class="item">ID:{{currentsystemLogoInfo.id}}</div>
        <div class="item">用户:{{currentsystemLogoInfo.createName}}</div>  
        <div class="item">内容:{{currentsystemLogoInfo.description}}</div>  
        <div class="item">时间:{{currentsystemLogoInfo.createTime}}</div>
        <Button @click="handleClickBtm" type='primary'>确定</Button>
  </div>
</template>

<script>
import apiSystem from "@/api/apiSystem";
export default {
    props:{
        currentsystemLogId:{
            type:Number,
            default:0
        }
    },
    data(){
        return{
            currentsystemLogoInfo:{}
        }
    },
    methods:{
        getList(){
            apiSystem.AdminOperaLogId(this.currentsystemLogId).then(res=>{
              if(res.data.code==200){
                  let j=res.data
                  this.currentsystemLogoInfo=j.data
              }
            })
        },
        handleClickBtm(){
            console.log(123)
            this.$emit('afterSaveSuccess')
        },
    },
}
</script>

<style scoped lang='less'>
.box{
    padding: 30px;
    .item{
         margin-bottom: 30px;  
         font-size:16px; 
    }
}

</style>