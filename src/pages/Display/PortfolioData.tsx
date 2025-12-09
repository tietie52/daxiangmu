import React, { useState } from 'react';
import { Card, Table, Tag, Select, DatePicker, Row, Col, Statistic, Button } from 'antd';
import { AreaChartOutlined, RiseOutlined, FallOutlined, DownloadOutlined } from '@ant-design/icons';
import { Pie, Line } from '@ant-design/plots';
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

  // 持仓数据
  const portfolioData: PortfolioItem[] = [
    {
      key: '1',
      code: 'BTC',
      name: '比特币',
      quantity: 0.5,
      buyPrice: 40000,
      currentPrice: 45000,
      profit: 2500,
      profitRate: 12.5,
      marketValue: 22500,
      holdingDays: 45,
    },
    {
      key: '2',
      code: 'ETH',
      name: '以太坊',
      quantity: 5,
      buyPrice: 2800,
      currentPrice: 3200,
      profit: 2000,
      profitRate: 14.3,
      marketValue: 16000,
      holdingDays: 60,
    },
    {
      key: '3',
      code: 'SOL',
      name: 'Solana',
      quantity: 100,
      buyPrice: 90,
      currentPrice: 110,
      profit: 2000,
      profitRate: 22.2,
      marketValue: 11000,
      holdingDays: 30,
    },
    {
      key: '4',
      code: 'USDT',
      name: '泰达币',
      quantity: 10000,
      buyPrice: 1,
      currentPrice: 1,
      profit: 0,
      profitRate: 0,
      marketValue: 10000,
      holdingDays: 90,
    },
    {
      key: '5',
      code: 'DOT',
      name: '波卡',
      quantity: 500,
      buyPrice: 5,
      currentPrice: 6,
      profit: 500,
      profitRate: 20,
      marketValue: 3000,
      holdingDays: 20,
    },
  ];

  // 图表配置 - 资产占比饼图
  const pieConfig = {
    data: portfolioData.map(item => ({
      type: item.code,
      value: item.marketValue
    })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      { type: 'element-active' },
    ],
  };

  // 图表配置 - 近7日持仓变化折线图
  const lineConfig = {
    data: [
      { date: '6-10', value: 48500 },
      { date: '6-11', value: 50200 },
      { date: '6-12', value: 49800 },
      { date: '6-13', value: 51500 },
      { date: '6-14', value: 52800 },
      { date: '6-15', value: 54500 },
      { date: '6-16', value: 55000 },
    ],
    xField: 'date',
    yField: 'value',
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond',
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
  };

  // 导出Excel函数
  const handleExport = () => {
    // 简单模拟导出功能
    alert('Excel导出功能已触发');
    // 实际项目中可以使用xlsx库实现真正的导出功能
  };

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
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            style={{ marginLeft: 'auto' }} 
            onClick={handleExport}
          >
            导出Excel
          </Button>
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
                title="持有资产数"
                value={portfolioData.length}
                precision={0}
                valueStyle={{ color: '#1890ff' }}
                prefix={<AreaChartOutlined />}
              />
            </Card>
          </Col>
        </Row>
        

        
        {/* 图表展示区域 */}
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {/* 资产占比饼图 */}
          <Col span={12}>
            <Card title="资产占比">
              <Pie
                {...pieConfig}
                style={{ height: 300 }}
              />
            </Card>
          </Col>
          {/* 近7日持仓变化折线图 */}
          <Col span={12}>
            <Card title="近7日持仓变化">
              <Line
                {...lineConfig}
                style={{ height: 300 }}
              />
            </Card>
          </Col>
        </Row>
        
        {/* 持仓列表 */}
        <Card title="持仓详情" style={{ marginTop: 24 }}>
          <Table
            columns={columns}
            dataSource={portfolioData}
            rowKey="key"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </Card>
    </div>
  );
};

export default PortfolioData;