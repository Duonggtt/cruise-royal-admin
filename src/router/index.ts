import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue';
import HomeView from '../views/HomeView.vue';
import UsersView from '../views/user/index.vue';
import Login from '@/views/auth/Login.vue';
import Dashboard from '@/views/dashboard/index.vue';
import CruiseView from '@/views/main/cruise/index.vue';
import CabinView from '@/views/main/cabin/index.vue';
import TagView from '@/views/main/tag/index.vue';
import BookingView from '@/views/booking/index.vue';

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
        },
        {
          path: '/cruises',
          component: CruiseView
        },
        {
          path: '/cabins',
          component: CabinView
        },
        {
          path: '/tags',
          component: TagView
        },
        {
          path: '/bookings',
          component: BookingView
        },
      ]
    },
    {
      path: '/auth/login',
      component: Login
    }
  ]
})

export default router
