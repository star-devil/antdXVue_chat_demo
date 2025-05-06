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

VMdPreview.use(vuepressTheme, {
  Hljs: hljs
});

const app = createApp(App);
app.use(pinia).use(router).use(VMdPreview).mount('#app');
