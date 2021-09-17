import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录 组件
import Login from '../components/Login.vue'
// 导入home 组件
import Home from '../components/Home.vue'
// 导入 welcome 组件
import Welcome from '../components/Welcome.vue'
// 导入 user 组件
import Users from '../components/user/Users.vue'
// 导入 rightslist 组件
import Rightslist from '../components/rights/Rightslist.vue'
// 导入 roles 组件
import Roles from '../components/rights/Roles.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rightslist', component: Rightslist },
      { path: '/roleslist', component: Roles }      
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫（用来控制访问权限）  挂载路由导航守卫
// to from next()
router.beforeEach((to, from, next) => {
  // 如果用户访问的是登录页，直接放行
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token');
  // 没有 token   强制跳转到 '/login' 登录页
  if (!token) return next('/login')
  // 有 token 放行
  if (to.path === '/welcome') {
    window.sessionStorage.removeItem("activePath")
  }
  next()
})

export default router
