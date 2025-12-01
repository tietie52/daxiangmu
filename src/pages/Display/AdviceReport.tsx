import React, { useState } from 'react';
import { Card, List, Tag, Select, DatePicker, Radio, Button } from 'antd';
import { FileTextOutlined, DownloadOutlined, StarOutlined, StarFilled, ShareAltOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { RadioGroup } = Radio; // 修复：只解构出 RadioGroup，因为 Radio 已经在导入中可用

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  summary: string;
  isFavorite: boolean;
  importance: 'high' | 'medium' | 'low';
  author: string;
}

const AdviceReport: React.FC = () => {
  const [reportType, setReportType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [importance, setImportance] = useState<string>('all');
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: '2024年第一季度市场展望',
      type: 'market',
      date: '2024-01-10',
      summary: '本季度市场预计将保持震荡上行趋势，重点关注科技、消费和医疗板块的投资机会。建议投资者适当配置优质蓝筹股，控制仓位，防范风险。',
      isFavorite: true,
      importance: 'high',
      author: '研究院',
    },
    {
      id: '2',
      title: '半导体行业深度分析',
      type: 'industry',
      date: '2024-01-08',
      summary: '全球半导体行业正处于新一轮上升周期，受益于AI、汽车电子等领域的需求增长。国内企业在设备国产化和先进制程方面取得突破，建议关注相关龙头企业。',
      isFavorite: false,
      importance: 'medium',
      author: '行业分析师',
    },
    {
      id: '3',
      title: '个股投资建议：海康威视',
      type: 'stock',
      date: '2024-01-05',
      summary: '海康威视作为安防领域龙头，在AI技术应用和国际化布局方面具有优势。近期股价调整提供了较好的买入机会，建议投资者逢低布局。',
      isFavorite: true,
      importance: 'high',
      author: '投资顾问',
    },
    {
      id: '4',
      title: '宏观经济月度报告',
      type: 'macro',
      date: '2024-01-02',
      summary: '2024年经济增长预期温和回升，货币政策将保持稳健偏宽松。通胀压力总体可控，就业形势逐步改善。建议关注政策红利带来的投资机会。',
      isFavorite: false,
      importance: 'medium',
      author: '宏观分析师',
    },
  ]);

  const toggleFavorite = (id: string) => {
    setReports(prev => 
      prev.map(report => 
        report.id === id ? { ...report, isFavorite: !report.isFavorite } : report
      )
    );
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'market':
        return '市场展望';
      case 'industry':
        return '行业分析';
      case 'stock':
        return '个股推荐';
      case 'macro':
        return '宏观经济';
      default:
        return '其他';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'market':
        return '#1890ff';
      case 'industry':
        return '#52c41a';
      case 'stock':
        return '#faad14';
      case 'macro':
        return '#722ed1';
      default:
        return '#8c8c8c';
    }
  };

  const getImportanceColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return '#ff4d4f';
      case 'medium':
        return '#faad14';
      case 'low':
        return '#52c41a';
    }
  };

  const getImportanceText = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return '重要';
      case 'medium':
        return '一般';
      case 'low':
        return '参考';
    }
  };

  const filteredReports = reports.filter(report => {
    const typeMatch = reportType === 'all' || report.type === reportType;
    const importanceMatch = importance === 'all' || report.importance === importance;
    return typeMatch && importanceMatch;
  });

  return (
    <div className={styles.container}>
      <h1>建议报告</h1>
      <Card>
        <div className={styles.filterBar}>
          <Select defaultValue="all" style={{ width: 120 }} onChange={setReportType}>
            <Option value="all">全部类型</Option>
            <Option value="market">市场展望</Option>
            <Option value="industry">行业分析</Option>
            <Option value="stock">个股推荐</Option>
            <Option value="macro">宏观经济</Option>
          </Select>
          
          <Select defaultValue="all" style={{ width: 120, marginLeft: 16 }} onChange={setImportance}>
            <Option value="all">全部重要性</Option>
            <Option value="high">重要</Option>
            <Option value="medium">一般</Option>
            <Option value="low">参考</Option>
          </Select>
          
          <RangePicker style={{ marginLeft: 16 }} onChange={setDateRange} />
        </div>
        
        <List
          itemLayout="vertical"
          size="large"
          pagination={{ pageSize: 5 }}
          dataSource={filteredReports}
          renderItem={report => (
            <List.Item
              key={report.id}
              extra={
                <div className={styles.reportActions}>
                  <Button 
                    type="text" 
                    icon={report.isFavorite ? <StarFilled /> : <StarOutlined />}
                    onClick={() => toggleFavorite(report.id)}
                    style={{ color: report.isFavorite ? '#faad14' : undefined }}
                  />
                  <Button type="text" icon={<DownloadOutlined />}>
                    下载
                  </Button>
                  <Button type="text" icon={<ShareAltOutlined />}>
                    分享
                  </Button>
                </div>
              }
            >
              <List.Item.Meta
                title={
                  <div className={styles.reportTitle}>
                    <span>{report.title}</span>
                    <Tag color={getImportanceColor(report.importance)}>
                      {getImportanceText(report.importance)}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.reportMeta}>
                      <Tag color={getTypeColor(report.type)}>
                        {getTypeText(report.type)}
                      </Tag>
                      <span style={{ marginLeft: 16 }}>发布日期：{report.date}</span>
                      <span style={{ marginLeft: 16 }}>作者：{report.author}</span>
                    </div>
                    <p style={{ marginTop: 8 }}>{report.summary}</p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AdviceReport;