import { Footer, Question, SelectLang, AvatarDropdown, AvatarName, Home } from '@/components';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { clearSessionToken, getAccessToken, getRefreshToken, getTokenExpireTime } from './access';
// 修改导入语句，移除不存在的setRemoteMenu函数
import { getRemoteMenu, getRoutersInfo, getUserInfo, patchRouteWithRemoteMenus } from './services/session';
import { PageEnum } from './enums/pagesEnums';
// 导入正确路径的routes配置
import routes from '../config/routes';


const isDev = process.env.NODE_ENV === 'development';



/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo({
        skipErrorHandler: true,
      });
      if (response.user.avatar === '') {
        response.user.avatar =
          'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      }
      return {
        ...(response?.user || {}),
        permissions: response.permissions,
        roles: response.roles,
      } as API.CurrentUser;
    } catch (error) {
      console.log(error);
      history.push(PageEnum.LOGIN);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== PageEnum.LOGIN) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<Home key="home" />,<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu={true}>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      // content: initialState?.currentUser?.nickName,
    },
    // 修改 layout.menu.request 配置
    menu: {
    locale: false,
    // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
    params: {
      userId: initialState?.currentUser?.userId,
    },
    request: async () => {
      if (!initialState?.currentUser?.userId) {
        return [];
      }
      
      // 获取远程菜单
      const remoteMenus = getRemoteMenu();
      
      // 如果远程菜单为null，使用本地routes配置作为菜单
      if (remoteMenus === null) {
        console.log('使用本地路由配置作为菜单');
        // 将routes转换为ProLayout需要的菜单格式
        return routes.map(route => ({
          path: route.path,
          name: route.name,
          icon: route.icon,
          routes: route.routes || []
        })).filter(menu => menu.path !== '*'); // 过滤掉404路由
      }
      
      return remoteMenus;
    },
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== PageEnum.LOGIN) {
        history.push(PageEnum.LOGIN);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
        <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

interface OnRouteChangeParams {
  clientRoutes: any[]; 
  location: Location;
}
// 优化 onRouteChange 函数，移除不必要的整页刷新
export async function onRouteChange({ clientRoutes, location }:OnRouteChangeParams ) {
  // 移除对远程菜单为null的检查
  // const menus = getRemoteMenu();
  // if(menus === null && location.pathname !== PageEnum.LOGIN) {
  //   console.log('远程菜单未加载，但不再强制刷新页面');
  // }
  
  // 保留模型切换逻辑，但移除整页刷新
  const curModel = localStorage.getItem('curModel');
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const firstPathName = pathSegments.length > 0 ? pathSegments[0] : '';
  
  if (firstPathName.length>0 && firstPathName !== curModel) {
    localStorage.setItem('curModel', firstPathName);
    console.log('模型切换为:', firstPathName);
  }
}


// 修改 patchClientRoutes 函数，要么移除它，要么正确返回路由
// 方案1：完全移除该函数（推荐，让UmiJS使用默认路由配置）

// 方案2：如果需要保留该函数，至少要返回原始路由
// export async function patchClientRoutes({ routes }:any) {
//   console.log('使用 UmiJS 默认路由配置');
//   return routes; // 重要：必须返回路由配置
// }

// 简化 render 函数
export function render(oldRender: () => void) {
// 直接调用 oldRender，让 UmiJS 使用默认的路由配置
oldRender();
}

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
const checkRegion = 5 * 60 * 1000;

export const request = {
  ...errorConfig,
  requestInterceptors: [
    (url: any, options: { headers: any }) => {
      const headers = options.headers ? options.headers : [];
      const authHeader = headers['Authorization'];
      const isToken = headers['isToken'];
      if (!authHeader && isToken !== false) {
        const expireTime = getTokenExpireTime();
        if (expireTime) {
          const left = Number(expireTime) - new Date().getTime();
          const refreshToken = getRefreshToken();
          if (left < checkRegion && refreshToken) {
            if (left < 0) {
              clearSessionToken();
            }
          } else {
            const accessToken = getAccessToken();
            if (accessToken) {
              headers['Authorization'] = `Bearer ${accessToken}`;
            }
          }
        } else {
          clearSessionToken();
        }
      }
      return { url, options };
    },
  ],
  responseInterceptors: [
    // (response) =>
    // {
    //   // // 不再需要异步处理读取返回体内容，可直接在data中读出，部分字段可在 config 中找到
    //   // const { data = {} as any, config } = response;
    //   // // do something
    //   // console.log('data: ', data)
    //   // console.log('config: ', config)
    //   return response
    // },
  ],
};
