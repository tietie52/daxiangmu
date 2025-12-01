import React from 'react';
import { Layout as AntLayout, Menu, Breadcrumb } from 'antd';
import { Outlet, useLocation } from '@umijs/max';
import { HomeOutlined, SettingOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Header, Content, Sider } = AntLayout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const BaseLayout: React.FC = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = React.useState(location.pathname);

  React.useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const menuItems: MenuItem[] = [
    { key: '1', icon: <HomeOutlined />, label: '首页', path: '/dashboard' },
    { key: '2', icon: <UserOutlined />, label: '用户管理', path: '/user' },
    { key: '3', icon: <FileTextOutlined />, label: '表单页面', path: '/form' },
    { key: '4', icon: <SettingOutlined />, label: '系统设置', path: '/settings' },
  ];

  const selectedKey = menuItems.find(item => currentPath.startsWith(item.path))?.key || '1';

  return (
    <AntLayout className={styles.container}>
      <Header className={styles.header}>
        <div className={styles.logo}>Ant Design Pro</div>
        <div className={styles.headerRight}>
          <span>欢迎使用管理系统</span>
        </div>
      </Header>
      <AntLayout>
        <Sider width={256} theme="light" className={styles.sider}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
          >
            {menuItems.map(item => (
              <Menu.Item key={item.key} icon={item.icon}>
                <a href={item.path}>{item.label}</a>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <AntLayout className={styles.contentWrapper}>
          <Content className={styles.content}>
            <Breadcrumb className={styles.breadcrumb}>
              {menuItems
                .filter(item => currentPath.startsWith(item.path))
                .map(item => (
                  <Breadcrumb.Item key={item.key}>{item.label}</Breadcrumb.Item>
                ))}
            </Breadcrumb>
            <div className={styles.mainContent}>
              <Outlet />
            </div>
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};

export default BaseLayout;