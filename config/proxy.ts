/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  dev: {
    // localhost:8000/api/** -> http://localhost:8080/**
    '/api/**': {
      // 要代理的地址
      target: 'http://localhost:8081',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      // 重写路径：移除/api前缀
      pathRewrite: { '^/api': '' },
      // 支持所有以/api开头的路径
      secure: false,
      ws: true,
      // 确保所有/api请求都被代理
      bypass: function(req: any, res: any, proxyOptions: any) {
        // 不代理静态资源请求
        if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
          return '/index.html';
        }
      }
    },
    '/profile/avatar/': {
      target: 'http://localhost:8081',
      changeOrigin: true,
    }
  },

  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
