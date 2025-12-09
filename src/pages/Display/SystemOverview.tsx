import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Button } from 'antd';
import { Link } from '@umijs/max';
import { 
  MessageOutlined,
  FileTextOutlined,
  DollarOutlined,
  SettingOutlined,
  UserOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import styles from './index.less';

const { Title, Text } = Typography;

const SystemOverview: React.FC = () => {
  // Core metrics data - 从消息列表和持仓数据中获取实际数据（模拟）
  const [coreMetrics, setCoreMetrics] = useState({
    unreadMessages: 23,  // 未读消息数
    pendingReports: 8,   // 待审核报告数
    totalAssetValue: 1258000,  // 当前总资产估值
  });

  // Quick access modules
  const quickAccessModules = [
    { name: '消息列表', icon: <MessageOutlined />, path: '/display/message-list', color: '#1890ff' },
    { name: '持仓数据', icon: <DollarOutlined />, path: '/display/portfolio-data', color: '#faad14' },
    { name: '建议报告', icon: <FileTextOutlined />, path: '/display/advice-report', color: '#52c41a' },
    { name: '系统设置', icon: <SettingOutlined />, path: '/settings', color: '#722ed1' },
    { name: '用户管理', icon: <UserOutlined />, path: '/user/list', color: '#eb2f96' },
    { name: '数据分析', icon: <BarChartOutlined />, path: '/dashboard', color: '#13c2c2' },
  ];

  return (
    <div className={styles.container}>
      <h1>系统概览</h1>
      
      {/* Core Metrics Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col span={8}>
          <Card hoverable bordered={false}>
            <Statistic
              title="未读消息数"
              value={coreMetrics.unreadMessages}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
              extra={<Text type="secondary">点击查看详情</Text>}
            />
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Link to="/display/message-list">
                <Button type="primary" size="small">
                  查看消息
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable bordered={false}>
            <Statistic
              title="待审核报告数"
              value={coreMetrics.pendingReports}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
              extra={<Text type="secondary">点击处理</Text>}
            />
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Link to="/display/advice-report">
                <Button type="primary" size="small">
                  审核报告
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable bordered={false}>
            <Statistic
              title="当前总资产估值"
              value={coreMetrics.totalAssetValue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              formatter={value => `¥ ${value.toLocaleString()}`}
              extra={<Text type="secondary">实时更新</Text>}
            />
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Link to="/display/portfolio-data">
                <Button type="primary" size="small">
                  查看详情
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Access Modules */}
      <Card title="功能模块快速入口" bordered={false} style={{ marginBottom: '32px' }}>
        <Row gutter={[16, 16]}>
          {quickAccessModules.map((module, index) => (
            <Col key={index} span={8}>
              <Link to={module.path} style={{ textDecoration: 'none' }}>
                <Card hoverable bordered={false} style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: '32px', color: module.color, marginBottom: '12px' }}>
                    {module.icon}
                  </div>
                  <Text strong style={{ fontSize: '16px' }}>{module.name}</Text>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Card>

      {/* System Status Summary */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="系统运行状态" bordered={false}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ marginRight: '8px' }}>系统状态：</Text>
                <Text type="success">正常运行</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px' }}>系统版本：</Text>
                <Text>v2.1.0</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px' }}>最后更新：</Text>
                <Text>2023-06-15 14:30:25</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px' }}>数据更新频率：</Text>
                <Text>每5分钟</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="今日数据概览" bordered={false}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ marginRight: '8px' }}>新增消息：</Text>
                <Text>45条</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px' }}>生成报告：</Text>
                <Text>12份</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px' }}>资产变动：</Text>
                <Text type="success">+2.3%</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px' }}>活跃用户：</Text>
                <Text>15人</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SystemOverview;