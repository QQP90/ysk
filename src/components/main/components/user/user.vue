<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <!--<Badge :dot="!!messageUnreadCount">-->
        <!--<Avatar :src="userAvator"/>-->
      <!--</Badge>-->
      <span class="user-name" v-if="userInfo&&userInfo.RealName">{{userInfo.RealName}}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!--<DropdownItem name="message">-->
          <!--消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
        <!--</DropdownItem>-->
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import Cookies from 'js-cookie'
import config from '@/config'
import {checkLogin,logout} from '@/api/user'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data(){
    return{
      userInfo:{},
    }
  },
  mounted(){
      var that=this;
      var userInfo=sessionStorage.getItem('ysk_userInfo');
      if(!userInfo){
        checkLogin().then(res => {
          if(res.data&&res.data.code===200){
            res.data.data=JSON.stringify(res.data.data)
            sessionStorage.setItem('ysk_userInfo',res.data.data);
            this.$set(that.userInfo,JSON.parse(res.data.data));
            that.userInfo=JSON.parse(res.data.data);
        }
      }).catch(err => {
          console.log(err)
        });
      }
      else{
        that.userInfo=JSON.parse(userInfo);
      }
  },
  methods: {
    clearAllCookie() {
				var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
				if(keys) {
					for(var i = keys.length; i--;)
						document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
				}
			},
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      //清除cookie
      this.clearAllCookie()
      Cookies.remove("uid");
      Cookies.remove("purl");
      Cookies.remove("uid_token");
      // 删除浏览器存储
      sessionStorage.removeItem('ysk_userInfo');
      logout().then(res=>{
        if(res.data.code==200){
          window.location=(process.env.NODE_ENV === 'development')?config.uidUrl.dev:config.uidUrl.pro;
        }
      })
      
//      this.handleLogOut().then(() => {
//        this.$router.push({
//          name: 'login'
//        })
//      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>
<style scoped>
  .user-name{
    font-size:18px;
    display: inline-block;
    margin-right:10px;
  }
</style>
