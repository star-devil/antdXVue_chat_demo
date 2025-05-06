import viteImagemin from 'vite-plugin-imagemin';
import svgLoader from 'vite-svg-loader';

export default function setupStaticPerf() {
  return [
    viteImagemin({
      verbose: false,
      optipng: {
        // 优化级别：
        optimizationLevel: 7
      },
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      mozjpeg: {
        quality: 20
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    }),
    svgLoader()
  ];
}
