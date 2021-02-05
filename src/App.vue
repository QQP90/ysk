<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
  min-width:1000px;
}
.ivu-modal-body{
  position:relative!important;
  min-height: 200px;
}

 .ivu-table-cell{
    padding-left:15px!important;
    padding-right:15px!important;
 }

//水平排列，整体居中
.r-row{
  display:flex;
  flex-direction:row;
  flex-wrap:nowrap;
  justify-content:center;
  align-items:center;
}
//垂直排列，整体居中
.r-column{
  display:flex;
  flex-direction:column;
  flex-wrap:nowrap;
  justify-content:center;
  align-items:center;
}

.avatar-box {
  text-align: center;
  width:64px;
  height:80px;
  overflow:hidden;
  margin:10px auto;
  border-radius: 5px;
  img {
    width:100%;
    border-radius: 5px;
    cursor:pointer;
  }
}
.doctor-avatar{
  width:80px!important;
}

.hospital-logo{
  width:80px;
  height:80px;
  overflow:hidden;
  margin: 10px 0;
  border-radius:5px;
  img {
    width:100%;
    border-radius: 5px;
    cursor:pointer;
  }
}
.textarea{
  text-align:left!important;
}

/*审核对比弹框----start*/
.audit-box .ivu-input{
  text-align:center;
}
.audit-box .diff {
  color: red!important;
  font-weight: bold!important;
  img, .avatar {
    border: 2px solid red;
  }
  input ,  span {
    color:red!important;
  }
}
/*审核对比弹框----end*/


.ivu-modal-wrap{
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
}
.ivu-modal{
  top:0!important;
}

.form-box , .wrapper-c , .audit-box{
  max-height:900px;
  overflow:hidden;
}
.form-box , .wrapper-c{overflow:hidden;}
@media screen  and (max-height:1200px) {
  @media (max-height:1000px){
    .form-box , .wrapper-c , .audit-box {
      max-height:700px;
    }
  }
  @media (max-height:900px){
    .form-box , .wrapper-c , .audit-box{
      max-height:600px;
    }
  }
  @media (max-height:800px){
    .form-box , .wrapper-c , .audit-box{
      max-height:500px;
    }
  }

  @media (max-height:700px){
    .form-box , .wrapper-c , .audit-box{
      max-height:450px;
    }
  }
  @media (max-height:600px){
    .form-box , .wrapper-c , .audit-box{
      max-height:400px;
    }
  }
  @media (max-height:550px){
    .form-box , .wrapper-c, .audit-box{
      max-height:300px;
    }
  }
  @media (max-height:500px){
    .form-box , .wrapper-c, .audit-box{
      max-height:250px;
    }
  }
}

/*******************字体图标**********************/
.font-icon{
  cursor:pointer!important;
  display:inline-block!important;
  margin-right:8px;
}
.icon-keshijianjie {font-size:20px!important;color:#19be6b!important;}
.icon-keshijianjie:hover{font-size:25px!important;color:#058860!important;}
.icon-bianji {font-size:17px!important;color:#2D8cF0;}
.doctor-icon{width:24px;height:24px;cursor:pointer;}
.doctor-icon:hover{
  transform: scale(1.3);
  -ms-transform:scale(1.3);     /* IE 9 */
  -moz-transform:scale(1.3);     /* Firefox */
  -webkit-transform:scale(1.3); /* Safari 和 Chrome */
  -o-transform:scale(1.3);
}
.icon-shenhe{font-size:20px;color:#ff9900;}

.icon-shanchu1{font-size:21px;color:#DFDFDF;}
.icon-shanchu1:hover{font-size:25px;color:#999;}
.icon-shenhe:hover{font-size:22px!important;color:#FF6347;}
.icon-bianji:hover{font-size:20px!important;}
.icon-chakan , .icon-shanchu , .icon-xiugaizhuangtai {font-size:20px;}
.icon-xiugaizhuangtai{color:#19be6b;}
.icon-chakan{color:#A9B0CB;}
.icon-shanchu{color:#999;}
.icon-chakan:hover , .icon-shanchu:hover ,.icon-xiugaizhuangtai:hover {font-size:24px;}
.icon-chakan:hover , .icon-shanchu:hover{color:#000;cursor:pointer!important;}
.icon-xuanzhongshangcheng {
  color: #999;
}
.icon-xuanzhongshangcheng:hover {
  color: #000;
   font-size:24px;
}

/*******************字体图标**********************/

/*******审核页省市区--修改前*******/
.old-areas  .ivu-icon-ios-arrow-down:before{content:''!important;}
.old-areas .ivu-input[disabled], fieldset[disabled] .ivu-input{background:#f8f8f9!important;color:#515a6e!important;}
.read-areas .ivu-input[disabled], fieldset[disabled] .ivu-input{background:#fff!important;color:#515a6e!important;}
.old-areas .ivu-input{border:none!important;}
/*******审核页省市区--修改前*******/
</style>
