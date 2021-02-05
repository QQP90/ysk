import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/',
    name: 'base_info',
    meta: {
      icon: 'logo-buffer',
      title: '基础数据管理'
    },
    component: Main,
    children: [{
        path: 'hospital',
        name: 'hospital',
        meta: {
          icon: 'ios-infinite',
          font: 'icon-my_3 icon-menu',
          title: '医院管理',
          notCache: false,
        },
        component: () => import('@/view/hospital/index.vue')
      },
      {
        path: 'hospital/audit',
        name: 'hospital_audit',
        meta: {
          icon: 'ios-infinite',
          font: 'icon-yishengguanli icon-menu',
          title: '医院资料审核'
        },
        component: () => import('@/view/hospital/auditList.vue')
      },
      {
        path: 'doctor',
        name: 'doctor_index',
        meta: {
          icon: 'ios-infinite',
          font: 'icon-yisheng2 icon-menu',
          title: '医生管理'
        },
        component: () => import('@/view/doctor/index.vue')
      },
      {
        path: 'doctor/audit',
        name: 'doctor_audit',
        meta: {
          icon: 'ios-infinite',
          font: 'icon-yishengguanli icon-menu',
          title: '医生资料审核'
        },
        component: () => import('@/view/doctor/auditList.vue')
      },
      {
        path: 'doctor/label',
        name: 'doctor_label_index',
        meta: {
          icon: 'ios-infinite',
          font: 'icon-yishengbiaoqianguanli icon-menu',
          title: '医生标签管理'
        },
        component: () => import('@/view/doc-label/index.vue')
      },
      {
        path: '/department/type',
        name: 'department_type',
        meta: {
          icon: 'ios-infinite',
          font: 'icon-keshibiaoqian icon-menu',
          title: '科室类型管理'
        },
        component: () => import('@/view/department/type.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'system',
    meta: {
      icon: 'logo-buffer',
      title: '系统操作管理'
    },
    component: Main,
    children: [
        {
        path: 'system/log',
        name: 'system_log',
        meta: {
          icon: 'ios-infinite',
          font: 'icon-caijian icon-menu',
          title: '系统日志',
          notCache: false,
        },
        component: () => import('@/view/system/systemLogList.vue')
      },
      {
        path: 'user/mange',
        name: 'user_mange',
        meta: {
          icon: 'ios-infinite',
          font: 'icon-my_3 icon-menu',
          title: '用户管理',
          notCache: false,
        },
        component: () => import('@/view/userMange/userMangeList.vue')
      },
      {
        path: 'role/mange',
        name: 'role_mange',
        meta: {
          icon: 'icon-jiaose',
          font: 'icon-yisheng icon-menu',
          title: '角色管理',
          notCache: false,
        },
        component: () => import('@/view/roleMange/roleMangeList.vue')
      },
      {
        path: 'resource/mange',
        name: 'resource_mange',
        meta: {
          icon: 'ios-infinite',
          font: 'icon-yishengguanli icon-menu',
          title: '资源管理',
          notCache: false,
        },
        component: () => import('@/view/resourceMange/resourceList.vue')
      },
    ]
  },
 
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
 
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
