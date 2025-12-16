/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 */
export default [
  {
    path: '/',
    name: '首页',
    layout: false,
    component: './home/HomePage',
  },
  {
    path: '/dashboard',
    name: '仪表盘',
    component: './Dashboard',
  },
  {
    path: '/user',
    name: '用户管理',
    routes: [
      {
        path: '/user',
        redirect: '/user/list',
      },
      {
        path: '/user/list',
        name: '用户列表',
        component: './User/List',
      },
      {
        path: '/user/add',
        name: '添加用户',
        component: './User/Add',
      },
    ],
  },
  {
    path: '/form',
    name: '表单页面',
    routes: [
      // 暂时移除不存在的组件引用
    ],
  },
  // 暂时移除不存在的组件引用
  {
    path: '/demo',
    name: '演示',
    routes: [
      {
        name: '演示页面',
        path: '/demo/page1',
        component: './Demo/Page1',
      },
      {
        name: '演示页面2',
        path: '/demo/page2',
        component: './Demo/Page2',
      },
    ]
  },
  // 添加新的展示模块
  {
    path: '/display',
    name: '展示模块',
    routes: [
      {
        path: '/display',
        redirect: '/display/message-list',
      },
      {
        path: '/display/message-list',
        name: '消息列表',
        component: './Display/MessageList',
      },
      {
        path: '/display/portfolio-data',
        name: '持仓数据',
        component: './Display/PortfolioData',
      },
      {
        path: '/display/advice-report',
        name: '建议报告',
        component: './Display/AdviceReport',
      },
      {
        path: '/display/system-overview',
        name: '系统概览',
        component: './Display/SystemOverview',
      },
    ]
  },
  {
    path: '/user/login',
    layout: false,
    name: 'login',
    component: './User/Login',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
