import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Tag } from 'antd';
import { 
  UserOutlined, 
  DatabaseOutlined, 
  ServerOutlined, 
  BarChartOutlined, 
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined
} from '@ant-design/icons';
import styles from './index.less';

const SystemOverview: React.FC = () => {
  // 系统状态数据
  const systemStats = [
    {
      title: '在线用户',
      value: 128,
      icon: <UserOutlined />,
      color: '#1890ff'
    },
    {
      title: '数据总量',
      value: '28.5',
      suffix: 'GB',
      icon: <DatabaseOutlined />,
      color: '#52c41a'
    },
    {
      title: '服务器负载',
      value: 28,
      suffix: '%',
      icon: <ServerOutlined />,
      color: '#faad14'
    },
    {
      title: '数据更新率',
      value: 98.5,
      suffix: '%',
      icon: <BarChartOutlined />,
      color: '#722ed1'
    }
  ];

  // 系统组件状态
  const componentStatus = [
    {
      name: '数据库',
      status: 'normal',
      uptime: '45天',
      version: 'MySQL 8.0.28'
    },
    {
      name: 'API服务',
      status: 'normal',
      uptime: '12天',
      version: 'v2.3.5'
    },
    {
      name: '缓存服务',
      status: 'warning',
      uptime: '8天',
      version: 'Redis 6.2.6'
    },
    {
      name: '认证服务',
      status: 'normal',
      uptime: '30天',
      version: 'OAuth 2.0'
    }
  ];

  // 最近系统事件
  const recentEvents = [
    {
      time: '今天 09:30',
      event: '系统例行数据备份完成',
      level: 'info'
    },
    {
      time: '今天 08:15',
      event: '用户张三登录系统',
      level: 'info'
    },
    {
      time: '昨天 18:45',
      event: '缓存服务内存使用率超过80%，已自动扩容',
      level: 'warning'
    },
    {
      time: '昨天 12:30',
      event: 'API服务版本更新至v2.3.5',
      level: 'info'
    },
    {
      time: '昨天 10:00',
      event: '检测到异常登录尝试，已自动阻止',
      level: 'danger'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <AlertOutlined style={{ color: '#faad14' }} />;
      case 'danger':
        return <AlertOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return '#1890ff';
      case 'warning':
        return '#faad14';
      case 'danger':
        return '#ff4d4f';
      default:
        return '#8c8c8c';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'info':
        return '信息';
      case 'warning':
        return '警告';
      case 'danger':
        return '危险';
      default:
        return '其他';
    }
  };

  return (
    <div className={styles.container}>
      <h1>系统概览</h1>
      
      {/* 系统统计卡片 */}
      <Row gutter={[16, 16]}>
        {systemStats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={stat.title.includes('数据更新率') ? 1 : 0}
                valueStyle={{ color: stat.color }}
                prefix={stat.icon}
                suffix={stat.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* 系统组件状态和最近事件 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="系统组件状态">
            <div className={styles.componentStatusList}>
              {componentStatus.map((component, index) => (
                <div key={index} className={styles.componentItem}>
                  <div className={styles.componentHeader}>
                    <span>{component.name}</span>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(component.status)}
                      <span style={{ marginLeft: 4 }}>
                        {component.status === 'normal' ? '正常' : 
                         component.status === 'warning' ? '警告' : '异常'}
                      </span>
                    </span>
                  </div>
                  <div className={styles.componentInfo}>
                    <span>运行时间：{component.uptime}</span>
                    <span>版本：{component.version}</span>
                  </div>
                  <Progress 
                    percent={component.status === 'normal' ? 100 : 
                            component.status === 'warning' ? 70 : 30}
                    strokeColor={component.status === 'normal' ? '#52c41a' : 
                              component.status === 'warning' ? '#faad14' : '#ff4d4f'}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="最近系统事件">
            <List
              dataSource={recentEvents}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    description={
                      <div className={styles.eventItem}>
                        <span className={styles.eventTime}>{item.time}</span>
                        <span className={styles.eventText}>{item.event}</span>
                        <Tag color={getLevelColor(item.level)}>
                          {getLevelText(item.level)}
                        </Tag>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 安全信息 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="安全信息">
            <div className={styles.securityInfo}>
              <div className={styles.securityItem}>
                <LockOutlined />
                <span>上次安全审计时间：2024-01-10</span>
              </div>
              <div className={styles.securityItem}>
                <CheckCircleOutlined />
                <span>SSL证书有效期：2024-12-31</span>
              </div>
              <div className={styles.securityItem}>
                <AlertOutlined />
                <span>高危漏洞数量：0</span>
              </div>
              <div className={styles.securityItem}>
                <CheckCircleOutlined />
                <span>安全策略状态：正常</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SystemOverview;