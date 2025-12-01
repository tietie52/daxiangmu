import React, { useState } from 'react';
import { Card, Table, Tag, Select, DatePicker, Row, Col, Statistic } from 'antd';
import { AreaChartOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface PortfolioItem {
  key: string;
  code: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  profit: number;
  profitRate: number;
  marketValue: number;
  holdingDays: number;
}

const PortfolioData: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any[]>([]);

  const portfolioData: PortfolioItem[] = [
    {
      key: '1',
      code: '000001',
      name: '平安银行',
      quantity: 1000,
      buyPrice: 12.50,
      currentPrice: 13.80,
      profit: 1300,
      profitRate: 10.4,
      marketValue: 13800,
      holdingDays: 45,
    },
    {
      key: '2',
      code: '600036',
      name: '招商银行',
      quantity: 500,
      buyPrice: 35.20,
      currentPrice: 33.80,
      profit: -700,
      profitRate: -4.0,
      marketValue: 16900,
      holdingDays: 60,
    },
    {
      key: '3',
      code: '002415',
      name: '海康威视',
      quantity: 300,
      buyPrice: 48.50,
      currentPrice: 52.30,
      profit: 1140,
      profitRate: 7.8,
      marketValue: 15690,
      holdingDays: 30,
    },
    {
      key: '4',
      code: '000858',
      name: '五粮液',
      quantity: 100,
      buyPrice: 168.00,
      currentPrice: 182.50,
      profit: 1450,
      profitRate: 8.6,
      marketValue: 18250,
      holdingDays: 90,
    },
    {
      key: '5',
      code: '000333',
      name: '美的集团',
      quantity: 200,
      buyPrice: 55.60,
      currentPrice: 53.20,
      profit: -480,
      profitRate: -4.3,
      marketValue: 10640,
      holdingDays: 20,
    },
  ];

  // 计算总市值和总盈亏
  const totalMarketValue = portfolioData.reduce((sum, item) => sum + item.marketValue, 0);
  const totalProfit = portfolioData.reduce((sum, item) => sum + item.profit, 0);
  const totalInvestment = totalMarketValue - totalProfit;
  const totalProfitRate = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

  const renderProfit = (value: number) => {
    const color = value >= 0 ? '#52c41a' : '#ff4d4f';
    const icon = value >= 0 ? <RiseOutlined /> : <FallOutlined />;
    return (
      <span style={{ color }}>
        {icon} {value.toFixed(2)}
      </span>
    );
  };

  const renderProfitRate = (value: number) => {
    const color = value >= 0 ? '#52c41a' : '#ff4d4f';
    return <span style={{ color }}>{value.toFixed(2)}%</span>;
  };

  const columns = [
    {
      title: '股票代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '持仓数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '买入均价',
      dataIndex: 'buyPrice',
      key: 'buyPrice',
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '当前价格',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '盈亏',
      dataIndex: 'profit',
      key: 'profit',
      render: renderProfit,
    },
    {
      title: '盈亏率',
      dataIndex: 'profitRate',
      key: 'profitRate',
      render: renderProfitRate,
    },
    {
      title: '市值',
      dataIndex: 'marketValue',
      key: 'marketValue',
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '持股天数',
      dataIndex: 'holdingDays',
      key: 'holdingDays',
      render: (value: number) => `${value}天`,
    },
  ];

  return (
    <div className={styles.container}>
      <h1>持仓数据</h1>
      <Card>
        <div className={styles.filterBar}>
          <Select defaultValue="all" style={{ width: 120 }} onChange={setTimeRange}>
            <Option value="all">全部</Option>
            <Option value="week">本周</Option>
            <Option value="month">本月</Option>
            <Option value="quarter">本季度</Option>
          </Select>
          <RangePicker style={{ marginLeft: 16 }} onChange={setDateRange} />
        </div>
        
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总市值"
                value={totalMarketValue}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix="¥"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总盈亏"
                value={totalProfit}
                precision={2}
                valueStyle={{ color: totalProfit >= 0 ? '#52c41a' : '#ff4d4f' }}
                prefix="¥"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总盈亏率"
                value={totalProfitRate}
                precision={2}
                valueStyle={{ color: totalProfitRate >= 0 ? '#52c41a' : '#ff4d4f' }}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="持有股票数"
                value={portfolioData.length}
                precision={0}
                valueStyle={{ color: '#1890ff' }}
                prefix={AreaChartOutlined}
              />
            </Card>
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={portfolioData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 24 }}
        />
      </Card>
    </div>
  );
};

export default PortfolioData;