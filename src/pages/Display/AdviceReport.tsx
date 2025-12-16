import React, { useState } from 'react';
import { Card, List, Tag, Select, DatePicker, Button, Row, Col, Divider, Radio, Typography, Modal, Form, Input, message } from 'antd';
import { FileTextOutlined, DownloadOutlined, StarOutlined, StarFilled, ShareAltOutlined, MessageOutlined, CheckOutlined, CloseOutlined, LinkOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { RadioGroup } = Radio;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface OriginalMessage {
  id: string;
  title: string;
  content: string;
  sentiment: '利好' | '利空' | '中性';
  source: string;
  publishTime: string;
  url: string; // 原始消息链接
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
  fullContent: string; // 完整报告内容
  rejectionReason?: string; // 驳回原因
}

const AdviceReport: React.FC = () => {
  const [reportType, setReportType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [importance, setImportance] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [form] = Form.useForm();
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: '比特币价格趋势分析及投资建议',
      type: 'crypto',
      date: '2024-01-15',
      summary: '比特币近期突破45000美元关口，市场情绪积极，建议投资者把握机会。',
      coreAdvice: '建议在45000-47000美元区间适量买入，目标价位55000美元，止损价位42000美元。根据技术面分析，比特币目前处于上升通道，RSI指标显示超买但仍有上涨空间。关注美联储降息预期和机构资金流向，若跌破42000美元支撑位，应及时止损。',
      fullContent: `## 比特币价格趋势分析及投资建议

### 一、市场概况
比特币近期突破45000美元整数关口，24小时涨幅达5.2%，创近6个月新高。受美联储降息预期影响，市场情绪持续乐观，机构资金流入明显增加。

### 二、技术面分析
从技术图表看，比特币目前处于上升通道中，MACD指标形成金叉，RSI指标虽显示超买(75)但尚未出现背离信号。支撑位在42000美元，阻力位在50000美元。

### 三、基本面分析
1. 机构持仓：灰度比特币信托持仓增加1.2万枚，为连续第三周增持
2. 矿工行为：矿工抛售压力减弱，显示长期持有信心
3. 监管环境：多国监管机构对加密货币的态度逐渐明朗，有助于市场稳定

### 四、投资建议
- 短期：在45000-47000美元区间适量买入
- 长期：持有为主，关注机构资金流向
- 风险提示：美联储政策变化、监管风险、市场波动性`,
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
          publishTime: '2024-01-15 08:30:00',
          url: 'https://www.coindesk.com/tech/2024/01/15/bitcoin-breaks-44000-level/'
        },
        {
          id: 'msg2',
          title: '机构投资者增加比特币持仓',
          content: '最新数据显示，灰度比特币信托持仓增加1.2万枚，为连续第三周增持。',
          sentiment: '利好',
          source: '彭博社',
          publishTime: '2024-01-15 09:15:00',
          url: 'https://www.bloomberg.com/news/articles/2024-01-15/bitcoin-institutional-holdings-rise-for-third-consecutive-week'
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
      fullContent: `## 以太坊DApp生态系统发展报告

### 一、网络数据
- 活跃地址数：120万（6个月新高）
- 交易数量：日均150万笔
- 燃气费：平均15 Gwei，处于较低水平

### 二、DeFi生态
- 总锁仓量：850亿美元（环比增长12%）
- 活跃协议：Uniswap、Aave、Compound等头部协议活跃度提升
- 创新趋势：跨链DeFi和Real World Assets (RWA) 成为新增长点

### 三、NFT市场
- 交易量：环比增长8%，显示市场逐步复苏
- 热点赛道：游戏NFT和实用型NFT表现突出

### 四、Layer2发展
- Arbitrum：总锁仓量突破40亿美元
- Optimism：用户增长迅速，日活突破5万
- zkSync：技术进展顺利，吸引大量开发者关注

### 五、投资建议
- 长期持有以太坊
- 关注Layer2生态项目
- 分散投资DeFi和NFT赛道优质项目`,
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
          publishTime: '2024-01-14 10:20:00',
          url: 'https://glassnode.com/blog/ethereum-active-addresses-6-month-high'
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
      fullContent: `## Solana网络性能优化分析

### 一、网络现状
Solana网络近期频繁出现短暂中断，平均每周1-2次，每次持续5-15分钟。这些中断主要由于网络负载过高和验证节点同步问题导致。

### 二、性能优化措施
1. 版本更新：开发团队发布1.18.5版本，修复了多个性能瓶颈
2. 节点优化：推荐节点升级硬件配置，提升处理能力
3. 负载均衡：引入动态费率机制，平滑网络峰值负载

### 三、性能数据对比
- TPS：优化前3000-4000，优化后可稳定在5000+ 
- 确认时间：保持在400ms左右
- 稳定性：仍需观察，目前尚未达到预期的99.9%可用性

### 四、风险评估
- 技术风险：网络稳定性问题尚未完全解决
- 竞争风险：Aptos、Sui等新一代公链快速发展
- 市场风险：网络中断导致用户信心下降

### 五、投资建议
- 短期：观望为主，等待网络稳定
- 中期：关注1.19版本更新效果
- 长期：若稳定性问题解决，Solana仍具有竞争力`,
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
          publishTime: '2024-01-13 08:10:00',
          url: 'https://status.solana.com/incidents/2024-01-13-network-outage'
        },
        {
          id: 'msg5',
          title: 'Solana团队发布性能优化更新',
          content: 'Solana开发团队发布1.18.5版本更新，旨在提升网络稳定性和吞吐量。',
          sentiment: '利好',
          source: 'GitHub',
          publishTime: '2024-01-13 09:30:00',
          url: 'https://github.com/solana-labs/solana/releases/tag/v1.18.5'
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
      fullContent: `## 2024年加密货币市场宏观展望

### 一、全球宏观经济环境
1. 美联储政策：预计2024年降息3次，每次25个基点，流动性将逐步宽松
2. 全球通胀：有望回落至2-3%的目标区间
3. 经济增长：全球经济增长预计在2.5-3%之间，呈温和复苏态势

### 二、加密货币市场趋势
1. 机构参与：传统金融机构将加速进入加密货币市场
2. 监管发展：全球监管框架将更加清晰，有助于市场长期健康发展
3. 技术创新：Layer2、AI+Web3、RWA等领域将出现重大突破

### 三、主要币种展望
- 比特币：有望突破10万美元，成为数字黄金的定位更加巩固
- 以太坊：受益于生态系统发展和机构采用，目标价8000美元
- 新兴公链：Solana、Aptos等有望在特定领域取得突破

### 四、投资策略
1. 资产配置：比特币40%、以太坊30%、其他加密资产30%
2. 风险管理：设置止损位，定期重新平衡投资组合
3. 长期视角：加密货币仍处于早期发展阶段，建议长期持有

### 五、风险提示
- 监管政策变化
- 技术风险
- 市场波动性
- 地缘政治风险`,
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
          publishTime: '2024-01-10 02:00:00',
          url: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20240110a.htm'
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

  // 打开驳回模态框
  const showRejectModal = () => {
    setRejectModalVisible(true);
  };

  // 关闭驳回模态框
  const handleRejectModalCancel = () => {
    setRejectModalVisible(false);
    form.resetFields();
    setRejectReason('');
  };

  // 提交驳回原因
  const handleRejectSubmit = (values: { reason: string }) => {
    if (selectedReport) {
      const reason = values.reason;
      // 这里可以添加审核逻辑
      console.log('拒绝报告:', selectedReport.id, '原因:', reason);
      // 更新报告状态
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === selectedReport.id ? { ...report, status: '已驳回', rejectionReason: reason } : report
        )
      );
      // 更新选中报告状态
      setSelectedReport(prev => prev ? { ...prev, status: '已驳回', rejectionReason: reason } : null);
      // 关闭模态框
      setRejectModalVisible(false);
      form.resetFields();
      setRejectReason('');
      // 显示成功消息
      message.success('报告已成功驳回');
    }
  };

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
      // 显示成功消息
      message.success('报告已成功通过审核');
    }
  };

  const handleReject = () => {
    if (selectedReport) {
      // 打开驳回模态框
      showRejectModal();
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
                  
                  {/* 完整报告内容 */}
                  <div className={styles.fullReport}>
                    <h3>完整报告内容</h3>
                    <Card bordered={true} style={{ marginTop: 16 }}>
                      <div dangerouslySetInnerHTML={{ 
                        __html: selectedReport.fullContent
                          .replace(/^## (.*$)/gm, '<h2 style="margin-top: 24px; margin-bottom: 16px;">$1</h2>')
                          .replace(/^### (.*$)/gm, '<h3 style="margin-top: 20px; margin-bottom: 12px;">$1</h3>')
                          .replace(/^- (.*$)/gm, '<p style="margin-left: 24px; margin-bottom: 8px;">• $1</p>')
                          .replace(/^(?!<h|<p|<ul|<li).*$/gm, '<p style="margin-bottom: 8px;">$&</p>')
                      }} />
                    </Card>
                  </div>
                  
                  <Divider />
                  
                  {/* 关联原始消息 */}
                  <div>
                    <h3>关联原始消息 <MessageOutlined /> </h3>
                    <div style={{ marginTop: 16 }}>
                      {selectedReport.originalMessages.map((message) => (
                        <Card key={message.id} style={{ marginBottom: 16 }} size="small">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <a 
                              href={message.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ color: '#1890ff', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                            >
                              {message.title} <LinkOutlined style={{ marginLeft: 4 }} />
                            </a>
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
                  
                  {/* 驳回原因展示（如果有） */}
                  {selectedReport.status === '已驳回' && selectedReport.rejectionReason && (
                    <div style={{ marginTop: 24 }}>
                      <h3 style={{ color: '#ff4d4f' }}>驳回原因</h3>
                      <Card bordered={true} style={{ borderColor: '#ffccc7', backgroundColor: '#fff2f0' }}>
                        <p>{selectedReport.rejectionReason}</p>
                      </Card>
                    </div>
                  )}
                  
                  <Divider />
                  
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
      
      {/* 驳回原因输入模态框 */}
      <Modal
        title="驳回原因"
        visible={rejectModalVisible}
        onCancel={handleRejectModalCancel}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRejectSubmit}
        >
          <Form.Item
            name="reason"
            label="驳回原因"
            rules={[{ required: true, message: '请输入驳回原因' }, { min: 5, message: '驳回原因不能少于5个字符' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入驳回原因（至少5个字符）"
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <Button onClick={handleRejectModalCancel} style={{ marginRight: 16 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              确认驳回
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdviceReport;