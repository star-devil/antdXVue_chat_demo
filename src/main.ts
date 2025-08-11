import { createApp } from 'vue';
import App from './App.vue';
import './tailwind.css';
import './scss/style.scss';
import pinia from './stores';
import router from './router/ index';
// md
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// highlightjs
import hljs from 'highlight.js/lib/core'; // 高亮代码块
// 监控
import heimdallr from '@heimdallr-sdk/browser';
import recordPlugin from '@heimdallr-sdk/record';
import vuePlugin from '@heimdallr-sdk/vue';

VMdPreview.use(vuepressTheme, {
  Hljs: hljs
});

const app = createApp(App);

// Heimdallr 配置
heimdallr({
  dsn: {
    host: 'http://localhost:7001', // 远程服务端地址
    init: '/project/init', // 初始化接口
    report: '/log/report' // 数据上报接口
  },
  app: {
    name: 'AntdX_Chat',
    leader: 'Egg',
    desc: '本地环境'
  },
  userIdentify: {
    name: 'egg_chat_demo',
    position: 'local' // 从 local 读取用户ID
  },
  plugins: [
    recordPlugin(),
    vuePlugin({
      vue: app
    })
  ]
});

app.use(pinia).use(router).use(VMdPreview).mount('#app');
