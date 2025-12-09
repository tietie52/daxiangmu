import React, { useState } from 'react';
import { Card, List, Tag, Select, DatePicker, Button, Row, Col, Divider, Radio } from 'antd';
import { FileTextOutlined, DownloadOutlined, StarOutlined, StarFilled, ShareAltOutlined, MessageOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { RadioGroup } = Radio;

interface OriginalMessage {
  id: string;
  title: string;
  content: string;
  sentiment: '利好' | '利空' | '中性';
  source: string;
  publishTime: string;
}

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  summary: string;
  coreAdvice: string;
  isFavorite: boolean;
  importance: 'high' | 'medium' | 'low';
  author: string;
  status: '已审核' | '待审核' | '已驳回';
  originalMessages: OriginalMessage[];
}

const AdviceReport: React.FC = () => {
  const [reportType, setReportType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [importance, setImportance] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: '比特币价格趋势分析及投资建议',
      type: 'crypto',
      date: '2024-01-15',
      summary: '比特币近期突破45000美元关口，市场情绪积极，建议投资者把握机会。',
      coreAdvice: '建议在45000-47000美元区间适量买入，目标价位55000美元，止损价位42000美元。根据技术面分析，比特币目前处于上升通道，RSI指标显示超买但仍有上涨空间。关注美联储降息预期和机构资金流向，若跌破42000美元支撑位，应及时止损。',
      isFavorite: true,
      importance: 'high',
      author: 'AI分析师',
      status: '待审核',
      originalMessages: [
        {
          id: 'msg1',
          title: '比特币突破44000美元整数关口',
          content: '受美联储降息预期影响，比特币价格今日突破44000美元整数关口，24小时涨幅达5.2%。',
          sentiment: '利好',
          source: 'CoinDesk',
          publishTime: '2024-01-15 08:30:00'
        },
        {
          id: 'msg2',
          title: '机构投资者增加比特币持仓',
          content: '最新数据显示，灰度比特币信托持仓增加1.2万枚，为连续第三周增持。',
          sentiment: '利好',
          source: '彭博社',
          publishTime: '2024-01-15 09:15:00'
        }
      ]
    },
    {
      id: '2',
      title: '以太坊DApp生态系统发展报告',
      type: 'crypto',
      date: '2024-01-14',
      summary: '以太坊网络活跃地址数创6个月新高，DeFi生态持续繁荣。',
      coreAdvice: '建议长期持有以太坊，关注Layer2扩容解决方案进展。以太坊网络活跃地址数持续增长，DeFi锁仓量稳步回升，生态系统健康发展。Layer2技术的普及将进一步降低交易成本，提升用户体验，预计将吸引更多开发者和用户加入生态。',
      isFavorite: false,
      importance: 'medium',
      author: 'AI分析师',
      status: '已审核',
      originalMessages: [
        {
          id: 'msg3',
          title: '以太坊活跃地址数创6个月新高',
          content: '数据显示，以太坊活跃地址数达到120万，为6个月以来最高水平。',
          sentiment: '利好',
          source: 'Glassnode',
          publishTime: '2024-01-14 10:20:00'
        }
      ]
    },
    {
      id: '3',
      title: 'Solana网络性能优化分析',
      type: 'crypto',
      date: '2024-01-13',
      summary: 'Solana网络频繁出现短暂中断，虽然性能提升但稳定性仍需观察。',
      coreAdvice: '建议观望为主，等待网络性能稳定后再考虑入场。Solana网络近期频繁出现短暂中断，虽然性能有所提升，但稳定性仍需观察。开发团队已发布性能优化更新，建议关注更新后的网络运行情况，若连续两周无重大中断，可考虑少量配置。',
      isFavorite: true,
      importance: 'high',
      author: 'AI分析师',
      status: '待审核',
      originalMessages: [
        {
          id: 'msg4',
          title: 'Solana网络再次出现短暂中断',
          content: 'Solana网络今日出现15分钟短暂中断，验证节点同步延迟。',
          sentiment: '利空',
          source: 'Solana Status',
          publishTime: '2024-01-13 08:10:00'
        },
        {
          id: 'msg5',
          title: 'Solana团队发布性能优化更新',
          content: 'Solana开发团队发布1.18.5版本更新，旨在提升网络稳定性和吞吐量。',
          sentiment: '利好',
          source: 'GitHub',
          publishTime: '2024-01-13 09:30:00'
        }
      ]
    },
    {
      id: '4',
      title: '2024年加密货币市场宏观展望',
      type: 'macro',
      date: '2024-01-12',
      summary: '美联储货币政策转向将成为影响加密货币市场的关键因素。',
      coreAdvice: '整体来看，2024年加密货币市场将受益于美联储降息周期的开启。建议投资者构建多元化投资组合，以比特币和以太坊为核心配置，辅以少量高增长潜力的新兴币种。关注监管政策变化和机构资金流向，及时调整投资策略。',
      isFavorite: false,
      importance: 'medium',
      author: 'AI分析师',
      status: '已审核',
      originalMessages: [
        {
          id: 'msg6',
          title: '美联储暗示2024年可能降息3次',
          content: '美联储12月会议纪要显示，多数官员预计2024年将降息3次，每次25个基点。',
          sentiment: '利好',
          source: '美联储',
          publishTime: '2024-01-10 02:00:00'
        }
      ]
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
      case 'crypto':
        return '加密货币';
      case 'macro':
        return '宏观经济';
      case 'market':
        return '市场展望';
      case 'industry':
        return '行业分析';
      case 'stock':
        return '个股推荐';
      default:
        return '其他';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'crypto':
        return '#1890ff';
      case 'macro':
        return '#722ed1';
      case 'market':
        return '#1890ff';
      case 'industry':
        return '#52c41a';
      case 'stock':
        return '#faad14';
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

  // 审核操作
  const handleApprove = () => {
    if (selectedReport) {
      // 这里可以添加审核逻辑
      console.log('审核通过报告:', selectedReport.id);
      // 更新报告状态
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === selectedReport.id ? { ...report, status: '已审核' } : report
        )
      );
      // 更新选中报告状态
      setSelectedReport(prev => prev ? { ...prev, status: '已审核' } : null);
    }
  };

  const handleReject = () => {
    if (selectedReport) {
      // 这里可以添加拒绝逻辑
      console.log('拒绝报告:', selectedReport.id);
      // 更新报告状态
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === selectedReport.id ? { ...report, status: '已驳回' } : report
        )
      );
      // 更新选中报告状态
      setSelectedReport(prev => prev ? { ...prev, status: '已驳回' } : null);
    }
  };

  return (
    <div className={styles.container}>
      <h1>建议报告</h1>
      <Card>
        <div className={styles.filterBar}>
          <Select defaultValue="all" style={{ width: 120 }} onChange={setReportType}>
            <Option value="all">全部类型</Option>
            <Option value="crypto">加密货币</Option>
            <Option value="macro">宏观经济</Option>
            <Option value="market">市场展望</Option>
            <Option value="industry">行业分析</Option>
            <Option value="stock">个股推荐</Option>
          </Select>
          
          <Select defaultValue="all" style={{ width: 120, marginLeft: 16 }} onChange={setImportance}>
            <Option value="all">全部重要性</Option>
            <Option value="high">重要</Option>
            <Option value="medium">一般</Option>
            <Option value="low">参考</Option>
          </Select>
          
          <RangePicker style={{ marginLeft: 16 }} onChange={setDateRange} />
        </div>
        
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {/* 报告列表 */}
          <Col span={8}>
            <Card title="报告列表" style={{ height: '100%' }}>
              <div>
                {filteredReports.slice(0, 8).map(report => (
                  <Card 
                    key={report.id}
                    size="small"
                    onClick={() => setSelectedReport(report)}
                    style={{
                      cursor: 'pointer',
                      marginBottom: 16,
                      backgroundColor: selectedReport?.id === report.id ? '#e6f7ff' : 'transparent',
                    }}
                  >
                    <div className={styles.reportTitle}>
                      <span>{report.title}</span>
                      <Tag color={getImportanceColor(report.importance)}>
                        {getImportanceText(report.importance)}
                      </Tag>
                    </div>
                    <div className={styles.reportMeta} style={{ marginTop: 8 }}>
                      <Tag color={getTypeColor(report.type)}>
                        {getTypeText(report.type)}
                      </Tag>
                      <Tag color={report.status === '已审核' ? 'green' : report.status === '待审核' ? 'orange' : 'red'}>
                        {report.status}
                      </Tag>
                    </div>
                    <p style={{ marginTop: 4, marginBottom: 0 }}>{report.date}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </Col>
          
          {/* 报告详情 */}
          <Col span={16}>
            <Card title={selectedReport ? selectedReport.title : '报告详情'}>
              {selectedReport ? (
                <div>
                  {/* 核心建议 */}
                  <div className={styles.coreAdvice}>
                    <h3>AI核心建议</h3>
                    <div style={{ padding: '16px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
                      <p>{selectedReport.coreAdvice}</p>
                    </div>
                  </div>
                  
                  <Divider />
                  
                  {/* 关联原始消息 */}
                  <div>
                    <h3>关联原始消息 <MessageOutlined /> </h3>
                    <div style={{ marginTop: 16 }}>
                      {selectedReport.originalMessages.map((message) => (
                        <Card key={message.id} style={{ marginBottom: 16 }} size="small">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <strong>{message.title}</strong>
                            <Tag color={message.sentiment === '利好' ? 'green' : message.sentiment === '利空' ? 'red' : 'gray'}>
                              {message.sentiment}
                            </Tag>
                          </div>
                          <p style={{ fontSize: '14px', marginBottom: 8 }}>{message.content}</p>
                          <p style={{ fontSize: '12px', color: '#999' }}>
                            来源: {message.source} | 发布时间: {message.publishTime}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  {/* 审核按钮 */}
                  <div style={{ marginTop: '24px', textAlign: 'right', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <Button 
                      type="primary" 
                      icon={<CheckOutlined />} 
                      onClick={handleApprove}
                      disabled={selectedReport.status !== '待审核'}
                      style={{ marginRight: 16 }}
                    >
                      审核通过
                    </Button>
                    <Button 
                      danger 
                      icon={<CloseOutlined />} 
                      onClick={handleReject}
                      disabled={selectedReport.status !== '待审核'}
                    >
                      审核驳回
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
                  请选择一个报告查看详情
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AdviceReport;