import { RouteRecordRaw } from 'vue-router';

const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'ChatDemo',
    component: () => import('@/views/AIChat.vue'),
    meta: {
      title: 'Hello World',
      keepAlive: true
    }
  }
];

export default homeRoutes;
