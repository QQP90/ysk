// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/fonts/style.css'  //新旧合并后的字体图标
import '@/assets/fonts/font2/iconfont.css'  //新旧合并后的字体图标
import TreeTable from 'tree-table-vue'
import BaiduMap from 'vue-baidu-map'
import Cookies from "js-cookie";
import VueCropper from "vue-cropper"; //图片裁剪插件


// 实际打包时应该不引入mock
/* eslint-disable */
//vue-cropper使用 注意： 需要关掉本地的mock服务， 不然图片转化会报错
// if (process.env.NODE_ENV !== 'production') require('@/mock')
// 0r0UpnjEq62XZr0dkhI1KCS8c2hKe5drlmkNMj6+IZ1r/9o1YLn9ufUqHf2DHwWZRY9rYWtyso+PQYOt2hD2fw==
if (process.env.NODE_ENV === 'development') {
  // Cookies.set('uid', "0r0UpnjEq61LKUY3C7W4yyS8c2hKe5drlmkNMj6+IZ3g7c773X2xudg+6BpjdjFceefb4OHvsCXBiSav26Mgkg==", 30);
  Cookies.set('purl', 'http://localhost:8080/', 7);
}else {
  Cookies.set('purl', 'http://admin.ysk.39.net', 1);
}



Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
// 使用百度地图
Vue.use(BaiduMap, {
  ak: ''
})

//图片裁剪
Vue.use(VueCropper)

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
