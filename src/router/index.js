import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: "首页"
    }
  },
  {
    path: '/SimpleExample',
    name: 'SimpleExample',
    component: () => import('../views/SimpleExampleView.vue'),
    meta: {
      title: "简单示例"
    }
  },
  {
    path: '/EffectComposerView',
    name: 'EffectComposerView',
    component: () => import('../views/EffectComposerView.vue'),
    meta: {
      title: "后期处理"
    }
  },
  {
    path: '/UVAnimation',
    name: 'UVAnimation',
    component: () => import('../views/UVAnimationView.vue'),
    meta: {
      title: "UV动画"
    }
  },
  {
    path: '/Test',
    name: 'Test',
    component: () => import('../views/TestView.vue'),
    meta: {
      title: "测试"
    }
  },
  {
    path: '/BackUpsViewOne',
    name: 'BackUpsViewOne',
    component: () => import('../views/BackUpsViewOne.vue'),
    meta: {
      title: "备份1"
    }
  },
  {
    path: '/BackUpsViewTwo',
    name: 'BackUpsViewTwo',
    component: () => import('../views/BackUpsViewTwo.vue'),
    meta: {
      title: "备份2"
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
