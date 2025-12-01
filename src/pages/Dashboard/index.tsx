import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons';
import styles from './index.less';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>仪表盘</h1>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={1000}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<UserOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新增"
              value={128}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="表单数量"
              value={56}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="数据统计"
              value={98}
              precision={1}
              valueStyle={{ color: '#faad14' }}
              prefix={<BarChartOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="最近活动" bordered={false}>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>用户小明登录系统</div>
              <div className={styles.activityItem}>用户小红提交了表单</div>
              <div className={styles.activityItem}>系统数据已更新</div>
              <div className={styles.activityItem}>新用户注册成功</div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统状态" bordered={false}>
            <div className={styles.statusInfo}>
              <p>系统运行正常</p>
              <p>服务器负载: 1.2%</p>
              <p>数据库连接: 正常</p>
              <p>最近备份: 2024-01-01 00:00:00</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;