import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { 
  Card, Table, Tag, Button, Input, Select, Modal, Space, DatePicker, Form, message 
} from 'antd';
import { 
  SearchOutlined, EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined 
} from '@ant-design/icons';
import styles from './index.less';

// 解构必须在所有导入语句之后
const { Option } = Select;
const { RangePicker } = DatePicker;

// 定义消息接口
interface Message {
  id: string;
  title: string;
  content: string;
  cryptoType: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  date: string;
  source: string;
}

// 模拟消息数据
const mockMessages: Message[] = [
  {
    id: '1',
    title: '比特币突破70000美元整数关口',
    content: '比特币价格今日突破70000美元整数关口，创历史新高。分析师认为，机构投资者的持续入场是推动价格上涨的主要原因。',
    cryptoType: 'BTC',
    sentiment: 'positive',
    date: '2024-06-20 14:30:00',
    source: 'CoinDesk'
  },
  {
    id: '2',
    title: '以太坊伦敦硬分叉成功部署',
    content: '以太坊网络已成功部署伦敦硬分叉，EIP-1559提案正式生效，这将改变以太坊的交易费机制。',
    cryptoType: 'ETH',
    sentiment: 'neutral',
    date: '2024-06-19 10:15:00',
    source: 'Ethereum Foundation'
  },
  {
    id: '3',
    title: '监管机构加强对加密货币交易所的审查',
    content: '多个国家的监管机构宣布将加强对加密货币交易所的审查力度，以防止洗钱和其他非法活动。',
    cryptoType: 'ALL',
    sentiment: 'negative',
    date: '2024-06-18 16:45:00',
    source: 'Financial Times'
  },
  {
    id: '4',
    title: '狗狗币社区推出重大技术升级计划',
    content: '狗狗币社区宣布将推出重大技术升级计划，包括提高交易速度和降低手续费。',
    cryptoType: 'DOGE',
    sentiment: 'positive',
    date: '2024-06-17 09:30:00',
    source: 'Dogecoin Foundation'
  },
  {
    id: '5',
    title: 'Solana网络遭遇短暂中断',
    content: 'Solana网络今日遭遇短暂中断，持续约30分钟后恢复正常。团队正在调查中断原因。',
    cryptoType: 'SOL',
    sentiment: 'negative',
    date: '2024-06-16 13:20:00',
    source: 'Solana Status'
  },
  {
    id: '6',
    title: 'Cardano智能合约平台正式上线',
    content: 'Cardano智能合约平台正式上线，标志着Cardano从单纯的加密货币向完整的区块链平台转型。',
    cryptoType: 'ADA',
    sentiment: 'positive',
    date: '2024-06-15 11:00:00',
    source: 'Cardano Foundation'
  }
];

const MessageList: React.FC = () => {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  // 初始化数据
  useEffect(() => {
    // 按时间倒序排序
    const sortedMessages = [...mockMessages].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setMessages(sortedMessages);
    setFilteredMessages(sortedMessages);
  }, []);

  // 筛选功能
  useEffect(() => {
    let result = [...messages];

    // 按数字货币类型筛选
    if (selectedCrypto) {
      result = result.filter(msg => msg.cryptoType === selectedCrypto || msg.cryptoType === 'ALL');
    }

    // 按利好/利空筛选
    if (selectedSentiment) {
      result = result.filter(msg => msg.sentiment === selectedSentiment);
    }

    // 按搜索文本筛选
    if (searchText) {
      result = result.filter(msg => 
        msg.title.includes(searchText) || msg.content.includes(searchText)
      );
    }

    setFilteredMessages(result);
  }, [selectedCrypto, selectedSentiment, searchText, messages]);

  // 表格列配置
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: Message) => (
        <span className={styles.messageTitle}>{text}</span>
      )
    },
    {
      title: '数字货币类型',
      dataIndex: 'cryptoType',
      key: 'cryptoType',
      width: 120,
      render: (text: string) => (
        <Tag color={text === 'ALL' ? 'default' : 'blue'}>{text}</Tag>
      )
    },
    {
      title: '情绪',
      dataIndex: 'sentiment',
      key: 'sentiment',
      width: 100,
      render: (text: string) => {
        let color = 'default';
        let textMap = { positive: '利好', negative: '利空', neutral: '中性' };
        
        if (text === 'positive') color = 'green';
        if (text === 'negative') color = 'red';
        
        return <Tag color={color}>{textMap[text as keyof typeof textMap]}</Tag>;
      }
    },
    {
      title: '发布时间',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      sorter: (a: Message, b: Message) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      },
      sortOrder: 'descend'
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: Message) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditModalOpen(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDeleteMessage(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 查看详情
  const handleViewDetail = (message: Message) => {
    setSelectedMessage(message);
    setDetailModalVisible(true);
  };

  // 关闭详情弹窗
  const handleCloseModal = () => {
    setDetailModalVisible(false);
    setSelectedMessage(null);
  };

  // 搜索输入变化
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // 数字货币类型变化
  const handleCryptoChange = (value: string) => {
    setSelectedCrypto(value);
  };

  // 情绪变化
  const handleSentimentChange = (value: string) => {
    setSelectedSentiment(value);
  };

  // 重置筛选条件
  const handleResetFilters = () => {
    setSelectedCrypto('');
    setSelectedSentiment('');
    setSearchText('');
  };

  // 打开添加模态框
  const handleAddModalOpen = () => {
    form.resetFields();
    setEditingMessage(null);
    setAddModalVisible(true);
  };

  // 关闭添加/编辑模态框
  const handleAddModalClose = () => {
    setAddModalVisible(false);
    setEditModalVisible(false);
    form.resetFields();
    setEditingMessage(null);
  };

  // 打开编辑模态框
  const handleEditModalOpen = (record: Message) => {
    setEditingMessage(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      cryptoType: record.cryptoType,
      sentiment: record.sentiment,
      date: moment(record.date, 'YYYY-MM-DD HH:mm:ss'),
      source: record.source
    });
    setEditModalVisible(true);
  };

  // 删除消息
  const handleDeleteMessage = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条消息吗？',
      onOk: () => {
        const updatedMessages = messages.filter(message => message.id !== id);
        setMessages(updatedMessages);
        message.success('删除成功');
      }
    });
  };

  // 表单提交处理
  const handleFormSubmit = () => {
    form.validateFields().then(values => {
      let newMessage: Message;
      
      if (editingMessage) {
        // 编辑现有消息
        newMessage = {
          ...editingMessage,
          ...values,
          date: values.date.format('YYYY-MM-DD HH:mm:ss')
        };
        const updatedMessages = messages.map(message => 
          message.id === editingMessage.id ? newMessage : message
        );
        setMessages(updatedMessages);
        message.success('编辑成功');
      } else {
        // 添加新消息
        newMessage = {
          ...values,
          id: Date.now().toString(),
          date: values.date.format('YYYY-MM-DD HH:mm:ss')
        };
        const updatedMessages = [newMessage, ...messages];
        setMessages(updatedMessages);
        message.success('添加成功');
      }
      
      handleAddModalClose();
    }).catch(errorInfo => {
      console.log('表单验证失败:', errorInfo);
    });
  };

  return (
    <div className={styles.container}>
      <Card 
        title="消息列表" 
        className={styles.messageCard}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setAddModalVisible(true)}
          >
            添加消息
          </Button>
        }
      >
        {/* 筛选栏 */}
        <div className={styles.filterBar}>
          <Space wrap size="middle">
            <Input
              placeholder="搜索标题或内容"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 300 }}
            />
            
            <Select
              placeholder="选择数字货币类型"
              style={{ width: 150 }}
              value={selectedCrypto}
              onChange={handleCryptoChange}
            >
              <Option value="">全部</Option>
              <Option value="BTC">比特币(BTC)</Option>
              <Option value="ETH">以太坊(ETH)</Option>
              <Option value="DOGE">狗狗币(DOGE)</Option>
              <Option value="SOL">Solana(SOL)</Option>
              <Option value="ADA">Cardano(ADA)</Option>
            </Select>
            
            <Select
              placeholder="选择情绪"
              style={{ width: 120 }}
              value={selectedSentiment}
              onChange={handleSentimentChange}
            >
              <Option value="">全部</Option>
              <Option value="positive">利好</Option>
              <Option value="negative">利空</Option>
              <Option value="neutral">中性</Option>
            </Select>
            
            <Button onClick={handleResetFilters}>重置筛选</Button>
          </Space>
        </div>

        {/* 消息表格 */}
        <Table
          columns={columns}
          dataSource={filteredMessages}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className={styles.messageTable}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 消息详情弹窗 */}
      <Modal
        title="消息详情"
        open={detailModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        {selectedMessage && (
          <div className={styles.detailContainer}>
            <h2 className={styles.detailTitle}>{selectedMessage.title}</h2>
            <div className={styles.detailMeta}>
              <Tag color={selectedMessage.cryptoType === 'ALL' ? 'default' : 'blue'}>
                {selectedMessage.cryptoType}
              </Tag>
              <Tag 
                color={
                  selectedMessage.sentiment === 'positive' ? 'green' : 
                  selectedMessage.sentiment === 'negative' ? 'red' : 'default'
                }
              >
                {selectedMessage.sentiment === 'positive' ? '利好' : 
                 selectedMessage.sentiment === 'negative' ? '利空' : '中性'}
              </Tag>
              <span className={styles.detailDate}>{selectedMessage.date}</span>
              <span className={styles.detailSource}>来源：{selectedMessage.source}</span>
            </div>
            <div className={styles.detailContent}>
              {selectedMessage.content}
            </div>
          </div>
        )}
      </Modal>

      {/* 添加/编辑消息弹窗 */}
      <Modal
        title={editingMessage ? "编辑消息" : "添加消息"}
        open={addModalVisible || editModalVisible}
        onCancel={handleAddModalClose}
        onOk={handleFormSubmit}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            date: moment()
          }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入消息标题" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入消息内容" />
          </Form.Item>

          <Form.Item
            name="cryptoType"
            label="数字货币类型"
            rules={[{ required: true, message: '请选择数字货币类型' }]}
          >
            <Select placeholder="请选择数字货币类型">
              <Option value="ALL">全部</Option>
              <Option value="BTC">比特币(BTC)</Option>
              <Option value="ETH">以太坊(ETH)</Option>
              <Option value="DOGE">狗狗币(DOGE)</Option>
              <Option value="SOL">Solana(SOL)</Option>
              <Option value="ADA">Cardano(ADA)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="sentiment"
            label="情绪"
            rules={[{ required: true, message: '请选择情绪' }]}
          >
            <Select placeholder="请选择情绪">
              <Option value="positive">利好</Option>
              <Option value="negative">利空</Option>
              <Option value="neutral">中性</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="发布时间"
            rules={[{ required: true, message: '请选择发布时间' }]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm:ss" 
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="source"
            label="来源"
            rules={[{ required: true, message: '请输入来源' }]}
          >
            <Input placeholder="请输入消息来源" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MessageList;