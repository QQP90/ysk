<template>
  <div class="wrapper">
    <div class="model" v-show="model">
      <div class="model-show" @click="model = false">
        <img :src="modelSrc" alt="" @click="model = false">
      </div>
    </div>
    <div class="content">
      <div class="show-info">
        <div class="test test1">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :fixedBox="option.fixedBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :centerBox="option.centerBox"
            :high="option.high"
            :infoTrue="option.infoTrue"
            :maxImgSize="option.maxImgSize"
            @realTime="realTime"
            @imgLoad="imgLoad"
            @cropMoving="cropMoving"
            :enlarge="option.enlarge"
            :mode="option.mode"
          ></vueCropper>
        </div>
        <div class="test-button">
          <label class="btn" for="uploads">更换图片</label>
          <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
          <button @click="changeScale(1)" class="btn ">+</button>
          <button @click="changeScale(-1)" class="btn">-</button>
          <button @click="rotateLeft" class="btn">↺</button>
          <button @click="rotateRight" class="btn">↻</button>
          <a @click="down('blob')" class="btn">下载</a>
          <a :href="downImg" download="demo.png" ref="downloadDom"></a>
        </div>
      </div>
      <div class="pre">
        <section class="pre-item" title="zoom: (150 / previews.w)">
<!--          <p>预览</p>-->
          <div :style="previewStyle3">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </section>

      </div>
    </div>
    <div class="footer-control">
      <Button type="primary" @click="finish('blob')">确定</Button>
    </div>
  </div>
</template>

<script>
  import configData from '@/config';
  import axios from 'axios';

  export default {
    props:{
      clipUrl: {
        type: String,
        required: true,
        default:'',
      },
    },
    data: function() {
      return {
        model: false,
        modelSrc: "",
        crap: false,
        previews: {},
        option: {
          img: "", //图片路径
          size: 1,
          full: false, //是否输出原图比例的截图
          outputType: "jpeg", //图片输出格式jpg(需写成jpeg)、png、webp
          canMove: true, //能否拖动图片
          fixedBox: true, //截图框固定大小
          original: false, //上传图片是否显示原始宽高（针对大图 可以铺满）
          canMoveBox: false, //能否拖动截图框
          autoCrop: true,//是否自动生成截图框
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth:150,
          autoCropHeight: 150,
          centerBox: false, //截图框是否限制在图片里（只有在自动生成截图框时才能生效）
          high: false, //是否根据dpr生成适合屏幕的高清图片
          cropData: {},
          enlarge: 1,
          mode: 'contain', //图片默认渲染方式
          maxImgSize: 2000 ,//上传时图片最大大小（默认会压缩尺寸到这个大小）
        },
        downImg: "#",
        previewStyle3: {},
        preview3: '',
      };
    },
    methods: {
      //图片加载
      changeImg() {
        this.option.img=this.clipUrl;
      },

      changeScale(num) {
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      rotateLeft() {
        this.$refs.cropper.rotateLeft();
      },
      rotateRight() {
        this.$refs.cropper.rotateRight();
      },
      //提交图片到服务器
      finish(type) {
        let _this = this;
        let formData = new FormData();
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            // let img = window.URL.createObjectURL(data)
            // this.model = true;
            // this.modelSrc = img;
            let fileName=this.fileName?this.fileName:('d'+String(new Date().valueOf())+'.png');
            formData.append("file", data, fileName);
            _this.saveImg(formData);
            console.log('blob', data, fileName)
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            // this.model = true;
            // this.modelSrc = data;
          })
        }
      },
      saveImg:function(formData){
        let that=this;
        const loading = this.$Message.loading('提交中...', 0);
        let baseUrl = process.env.NODE_ENV === 'development' ? configData.baseUrl.dev : configData.baseUrl.pro;
        let uploadUrl=baseUrl+`upload/image?collectionId=4`;
        const instance=axios.create({ withCredentials: true})
        let config = { headers: { "Content-Type": "multipart/form-data" }};
        instance.post(uploadUrl,formData,config).then(res => {
          console.log('afterClipComplete',res,typeof(res))
          setTimeout(loading, 500);
          //后续其他操作
          if(res.data&&res.data.code==200){
            that.$emit("afterClipComplete",res.data.data[0]);
          }else if(res.data&&res.data.code==500){
            that.$Message.error("图片过大");
          } else{
            console.log('其他错误')
          }
        }).catch(err => { console.log(err)})
      },
      // 实时预览函数
      realTime(data) {
        var previews = data;
        var h = 0.5;
        var w = 0.2;
        this.previewStyle3 = {
          width: previews.w + "px",
          height: previews.h + "px",
          overflow: "hidden",
          margin: "0",
          zoom: (150 / previews.w)
        };
        this.previews = data;
      },

      down(type) {
        // event.preventDefault()
        // 输出
        if (type === "blob") {
          this.$refs.cropper.getCropBlob(data => {
            this.downImg = window.URL.createObjectURL(data);
            if (window.navigator.msSaveBlob) {
              var blobObject = new Blob([data]);
              window.navigator.msSaveBlob(blobObject, "demo.png");
            } else {
              this.$nextTick(() => {
                this.$refs.downloadDom.click();
              });
            }
          });
        } else {
          this.$refs.cropper.getCropData(data => {
            this.downImg = data;
            if (window.navigator.msSaveBlob) {
              var blobObject = new Blob([data]);
              window.navigator.msSaveBlob(blobObject, "demo.png");
            } else {
              this.$nextTick(() => {
                this.$refs.downloadDom.click();
              });
            }
          });
        }
      },

      uploadImg(e, num) {
        //上传图片
        // this.option.img
        var file = e.target.files[0];
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
          return false;
        }
        var reader = new FileReader();
        reader.onload = e => {
          let data;
          if (typeof e.target.result === "object") {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }
          if (num === 1) {
            this.option.img = data;
          } else if (num === 2) {
            this.example2.img = data;
          }
        };
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file);
      },
      imgLoad(msg) {
        console.log(msg);
      },

      cropMoving(data) {
        this.option.cropData = data;
      }
    },
    components: {
    },
    mounted() {
      this.changeImg();
    }
  };
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  .content {
    /*margin: auto;*/
    margin:20px 0 0 20px;
    max-width: 1200px;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: start;
    padding-bottom: 20px;
  }

  .test-button {
    display: flex;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 20px 10px 0px 0px;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all 0.2s ease;
    text-decoration: none;
    user-select: none;
  }

  .des {
    line-height: 30px;
  }



  .show-info {
    margin-bottom: 50px;
  }


  .show-info h2 {
    line-height: 50px;
  }

  /*.title {*/
  /*  display: block;*/
  /*  text-decoration: none;*/
  /*  text-align: center;*/
  /*  line-height: 1.5;*/
  /*  margin: 20px 0px;*/
  /*  background-image: -webkit-linear-gradient(*/
  /*    left,*/
  /*    #3498db,*/
  /*    #f47920 10%,*/
  /*    #d71345 20%,*/
  /*    #f7acbc 30%,*/
  /*    #ffd400 40%,*/
  /*    #3498db 50%,*/
  /*    #f47920 60%,*/
  /*    #d71345 70%,*/
  /*    #f7acbc 80%,*/
  /*    #ffd400 90%,*/
  /*    #3498db*/
  /*  );*/
  /*  color: transparent;*/
  /*  color: transparent;*/
  /*  -webkit-background-clip: text;*/
  /*  background-size: 200% 100%;*/
  /*  animation: slide 5s infinite linear;*/
  /*  font-size: 40px;*/
  /*}*/

  .test {
    height: 400px;
  }

  .model {
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
  }

  .model-show {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    text-align: center;
  }

  .model img {
    display: block;
    margin: auto;
    max-width: 80%;
    width: auto;
    user-select: none;
    background-position: 0px 0px, 10px 10px;
    background-size: 20px 20px;
    background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee 100%
    ),
    linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
  }

  .c-item {
    display: block;
    padding: 10px 0;
    user-select: none;
  }

  .pre {
    display: flex;
    margin-left:30px;
  }

  .pre-item {
    padding-right: 20px;
  }

  @keyframes slide {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -100% 0;
    }
  }

  @media screen and (max-width: 1000px) {
    .content {
      max-width: 90%;
      margin: auto;
    }

    .test {
      height: 400px;
    }
  }
  .footer-control {
    text-align: right;
    border-top: 1px solid #e8eaec;
    /*position: absolute;*/
    /*left: 0;*/
    /*bottom:0;*/
    width: 100%;
    height:60px;

  }
  .footer-control button{
    margin:12px 20px 0 0;
  }
  /*  鼠标移过按钮的效果*/
  .btn:hover{
    font-weight:bold;
  }

</style>
