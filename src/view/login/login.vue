<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="医生库管理后台-请登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">请输入正确的用户名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { getUserInfo  } from '@/api/user'
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  data(){
    return{
      wrong : false
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        console.log('res', userName, 'psw',password)
        let params = {
            "userName": userName,
            "password": password,
        }

        getUserInfo('/login', params).then(res =>{
            // console.log('loginData', res)
            if(res.data.code == 200){
              this.$Message.success('登录成功！')
              this.$router.push({
                name: this.$config.homeName
              })
            }else{
                this.$Message.error({
                    content: '用户名或密码错误！',
                    duration: 3
                })
            }
        }).catch(err => {
            console.log(err)
        })
      })
    }
  }
}

</script>

<style>

</style>
