import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import iView from 'iview'
import {setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config
import { checkLogin } from '@/api/user';

Vue.use(Router)
const router = new Router({
    routes//,
  // mode: 'history'
})
// const LOGIN_PAGE_NAME = 'login'

const getUserInfo = function(){
  var ysk_userInfo=sessionStorage.getItem("ysk_userInfo");
  if(!ysk_userInfo){
    checkLogin().then(res => {
      if(res.data&&res.data.code==200){
        let data = JSON.stringify(res.data.data)
        sessionStorage.setItem("ysk_userInfo",data)
      }
    }).catch(err => {
      console.log('err')
    });
  }
}
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    getUserInfo();
    if(to.path=='/'){
      next({
        name:homeName // è·³è½¬åˆ°homeNameé¡µ
      })
    }else{
        next();
    }
})

router.afterEach(to => {
    // setTitle(to, router.app)
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

export default router
