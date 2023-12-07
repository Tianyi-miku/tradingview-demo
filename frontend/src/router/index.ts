import { createRouter, createWebHistory } from 'vue-router'
import TradingView from "../views/TradingView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TradingView',
      component: TradingView
    },
  ]
})

export default router
