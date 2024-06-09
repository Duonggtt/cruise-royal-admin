import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue';
import HomeView from '../views/HomeView.vue';
import UsersView from '../views/user/index.vue';
import Login from '@/views/auth/Login.vue';
import Dashboard from '@/views/dashboard/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login' 
    },
    {
      path: '/home',
      component: AppLayout,
      children: [
        {
          path: '/home',
          component: HomeView
        },
        {
          path: '/dashboard',
          component: Dashboard
        },
        {
          path: '/users',
          component: UsersView
        }
      ]
    },
    {
      path: '/auth/login',
      component: Login
    }
  ]
})

export default router
