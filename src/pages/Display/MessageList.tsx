import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Space } from 'antd';
import { SearchOutlined, DeleteOutlined, MarkUnreadOutlined, MarkReadOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Search } = Input;

interface Message {
  key: string;
  title: string;
  content: string;
  type: string;
  time: string;
  isRead: boolean;
}

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      key: '1',
      title: '系统更新通知',
      content: '系统将于今晚23:00进行例行维护，请提前做好准备。',
      type: 'system',
      time: '2024-01-15 09:30:00',
      isRead: false,
    },
    {
      key: '2',
      title: '交易提醒',
      content: '您关注的股票已达到设定价格，请及时查看。',
      type: 'trade',
      time: '2024-01-15 08:15:00',
      isRead: true,
    },
    {
      key: '3',
      title: '风控预警',
      content: '您的账户风险等级已更新，请检查您的持仓情况。',
      type: 'risk',
      time: '2024-01-14 16:45:00',
      isRead: false,
    },
    {
      key: '4',
      title: '数据推送',
      content: '最新市场研报已生成，点击查看详情。',
      type: 'data',
      time: '2024-01-14 10:20:00',
      isRead: true,
    },
  ]);

  const [searchText, setSearchText] = useState('');

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleMarkRead = (key: string) => {
    setMessages(prev => 
      prev.map(item => 
        item.key === key ? { ...item, isRead: true } : item
      )
    );
  };

  const handleMarkUnread = (key: string) => {
    setMessages(prev => 
      prev.map(item => 
        item.key === key ? { ...item, isRead: false } : item
      )
    );
  };

  const handleDelete = (key: string) => {
    setMessages(prev => prev.filter(item => item.key !== key));
  };

  const filteredMessages = messages.filter(
    item => item.title.includes(searchText) || item.content.includes(searchText)
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return '#1890ff';
      case 'trade':
        return '#52c41a';
      case 'risk':
        return '#ff4d4f';
      case 'data':
        return '#faad14';
      default:
        return '#8c8c8c';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'system':
        return '系统';
      case 'trade':
        return '交易';
      case 'risk':
        return '风控';
      case 'data':
        return '数据';
      default:
        return '其他';
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Message) => (
        <span style={{ fontWeight: record.isRead ? 'normal' : 'bold' }}>{text}</span>
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 400,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Tag color={getTypeColor(text)}>{getTypeText(text)}</Tag>
      ),
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.isRead ? (
            <Button type="text" icon={<MarkUnreadOutlined />} onClick={() => handleMarkUnread(record.key)}>
              标记未读
            </Button>
          ) : (
            <Button type="text" icon={<MarkReadOutlined />} onClick={() => handleMarkRead(record.key)}>
              标记已读
            </Button>
          )}
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h1>消息列表</h1>
      <Card>
        <div className={styles.actions}>
          <Search
            placeholder="搜索消息"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
          />
          <Button type="primary">全部标记为已读</Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredMessages}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 16 }}
        />
      </Card>
    </div>
  );
};

export default MessageList;