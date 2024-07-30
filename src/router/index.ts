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
import SectionView from '@/views/main/section/index.vue';
import OwnerView from '@/views/owner/index.vue';
import LocationView from '@/views/location/index.vue';
import RulesView from '@/views/main/rule/index.vue';
import PaymentCallback from '@/views/payment/payment-callback.vue';

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
        {
          path: '/sections',
          component: SectionView
        },
        {
          path: '/owners',
          component: OwnerView
        },
        {
          path: '/locations',
          component: LocationView
        },
        {
          path: '/rules',
          component: RulesView
        },
        {
          path: '/payment-callback',
          component: PaymentCallback
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
