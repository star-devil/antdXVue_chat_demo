import loadPlugins from './plugins';
import loadViteResolve from './resolve';
import loadViteServer from './server';
import loadViteBuild from './build';
import loadViteCss from './css';

const loadInitLog = () => {
  const colors = {
    reset: '\x1b[0m',
    fg: '\x1b[35m',
    bg: '\x1b[43m'
  };
  const LINK = 'https://juejin.cn/post/7493086074686062607';
  console.log(
    `${colors.fg} 😊教程说明在这里==>:🔗${colors.bg}${LINK}${colors.reset}，有问题欢迎评论。`
  );
};
export default {
  loadPlugins,
  loadViteResolve,
  loadViteServer,
  loadViteBuild,
  loadViteCss,
  loadInitLog
};
