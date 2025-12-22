import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { request } from '@umijs/max';
import { getAccessToken } from '@/access';
// 移除未使用的 API 类型导入，避免“找不到模块”报错
import {
  Card, Table, Tag, Button, Input, Select, Modal, Space, DatePicker, Form, message, ConfigProvider,
  TableColumnType, TableColumnGroupType
} from 'antd';
import {
  SearchOutlined, EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined
} from '@ant-design/icons';
import styles from './index.less';

// 核心修改：适配后端的/crypto-news接口路径
const BASE_API = '/api';
const NEWS_API = `${BASE_API}/crypto-news`; // 后端接口根路径

// 使用项目提供的request工具，自动继承全局拦截器配置
const api = {
  get: (url: string, options?: any) => request(url, { method: 'GET', ...options }),
  post: (url: string, data?: any, options?: any) => request(url, { method: 'POST', data, ...options }),
  put: (url: string, data?: any, options?: any) => request(url, { method: 'PUT', data, ...options }),
  delete: (url: string, options?: any) => request(url, { method: 'DELETE', ...options }),
};

// 解构必须在所有导入语句之后
const { Option } = Select;
const { RangePicker } = DatePicker;

// 定义消息接口（适配后端字段：emotion/publishTime → 前端sentiment/date）
interface Message {
  id: string;
  title: string;
  content: string;
  cryptoType: string;
  emotion: string; // 后端字段
  sentiment: 'positive' | 'negative' | 'neutral'; // 前端展示字段
  publishTime: string; // 后端字段
  date: string; // 前端展示字段
  source: string;
}

const MessageList: React.FC = () => {
  // 用户角色类型定义
  type UserRole = 'viewer' | 'admin';

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
  // 使用AntD v5推荐的useMessage hook替代静态message方法
  const [messageApi, contextHolder] = message.useMessage();
  const [userRole, setUserRole] = useState<UserRole>('admin'); 
  const [loading, setLoading] = useState<boolean>(false); // 加载状态
  // 分页状态管理
  const [currentPage, setCurrentPage] = useState<number>(1); // 当前页码
  const [pageSize, setPageSize] = useState<number>(10); // 每页条数
  const [total, setTotal] = useState<number>(0); // 总数据量

  // 时间格式化工具函数（适配后端LocalDateTime）
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '';
    // 兼容LocalDateTime格式（2025-12-19T10:00:00）和普通格式
    return moment(dateStr).format('YYYY-MM-DD HH:mm:ss');
  };

  // 同步Dify资讯方法
  const handleSyncDifyNews = async () => {
    try {
      setLoading(true);
      // 发送POST请求到同步接口
      const response = await api.post(`${NEWS_API}/syncFromDify`);
      
      // 请求成功
      setLoading(false);
      // 显示后端返回的成功消息
      const responseData = response as any;
      messageApi.success(responseData?.msg || '同步成功');
      // 自动刷新列表
      fetchMessageList();
    } catch (error: any) {
      console.error('同步Dify资讯失败:', error);
      setLoading(false);
      
      // 处理不同类型的错误
      if (error?.response?.data?.msg) {
        // 后端返回的错误信息
        messageApi.error(error.response.data.msg);
      } else if (error?.message) {
        // axios错误信息
        messageApi.error(`同步失败：${error.message}`);
      } else {
        // 未知错误
        messageApi.error('同步失败：网络异常，请稍后重试');
      }
    }
  };

  // 从后端获取消息列表（适配若依分页接口）
  const fetchMessageList = async () => {
    try {
      setLoading(true);
      // 调用后端分页查询接口：GET /crypto-news/list
      // 传递当前分页参数
      const pageQuery = {
        pageNum: currentPage,
        pageSize: pageSize
      };
      const response = await api.get(`${NEWS_API}/list`, {
        params: pageQuery
      });
      
      // 关键调试信息：打印完整的后端返回数据
      console.log('后端返回的完整响应:', response);
      
      // 核心修复：正确解析后端返回的数据结构
      // 后端返回格式：{total: 3, rows: [...], code: 200, msg: "查询成功"}
      // 数据直接在response对象中，而不是在response.data中
      const messageList = response?.rows || [];
      const totalCount = response?.total || 0;
      
      console.log('解析到的原始rows数据:', messageList);
      console.log('解析到的total数据:', totalCount);
      
      // 字段映射：后端 → 前端
      const formattedList = messageList.map((item: any) => ({
        id: item.id?.toString() || '', // 后端Long转前端string
        title: item.title || '',
        content: item.content || '',
        cryptoType: item.cryptoType || '',
        emotion: item.emotion || '', // 后端原始字段
        // 映射情绪字段：后端"正面/负面/中性" → 前端"positive/negative/neutral"
        sentiment: item.emotion === '正面' ? 'positive' : 
                   item.emotion === '负面' ? 'negative' : 'neutral',
        publishTime: item.publishTime || '', // 后端原始字段
        date: formatDateTime(item.publishTime), // 前端展示格式
        source: item.source || ''
      }));

      // 按时间倒序排序
      const sortedMessages = [...formattedList].sort((a: Message, b: Message) => {
        return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
      });
      
      setMessages(sortedMessages);
      setFilteredMessages(sortedMessages);
      setTotal(totalCount); // 设置总数据量
      
      // 无数据时提示
      if (sortedMessages.length === 0) {
        messageApi.info('暂无消息数据');
      }
    } catch (error) {
      console.error('获取消息列表失败:', error);
      // 失败时回退到空数组，避免页面报错
      setMessages([]);
      setFilteredMessages([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据：从后端加载，监听分页状态变化
  useEffect(() => {
    fetchMessageList();
  }, [currentPage, pageSize]);

  // 筛选功能
  useEffect(() => {
    console.log('筛选前的完整messages:', messages);
    let result = [...messages];

    // 按数字货币类型筛选
    if (selectedCrypto) {
      console.log('按数字货币类型筛选:', selectedCrypto);
      result = result.filter(msg => msg.cryptoType === selectedCrypto || msg.cryptoType === 'ALL');
    }

    // 按利好/利空筛选
    if (selectedSentiment) {
      console.log('按情绪筛选:', selectedSentiment);
      result = result.filter(msg => msg.sentiment === selectedSentiment);
    }

    // 按搜索文本筛选（忽略大小写）
    if (searchText) {
      console.log('按搜索文本筛选:', searchText);
      const lowerText = searchText.toLowerCase();
      result = result.filter(msg => 
        msg.title.toLowerCase().includes(lowerText) || 
        msg.content.toLowerCase().includes(lowerText)
      );
    }

    console.log('筛选后的filteredMessages:', result);
    setFilteredMessages(result);
  }, [selectedCrypto, selectedSentiment, searchText, messages]);

  // 表格列配置
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string) => (
        <span className={styles.messageTitle}>{text || '-'}</span>
      )
    },
    {
      title: '数字货币类型',
      dataIndex: 'cryptoType',
      key: 'cryptoType',
      width: 120,
      render: (text: string) => (
        <Tag color={text === 'ALL' ? 'default' : 'blue'}>{text || '-'}</Tag>
      )
    },
    {
      title: '情绪',
      dataIndex: 'sentiment',
      key: 'sentiment',
      width: 100,
      render: (text: string) => {
        let color = 'default';
        const textMap: Record<string, string> = { 
          positive: '利好', 
          negative: '利空', 
          neutral: '中性' 
        };
        const showText = textMap[text] || '未知';
        
        if (text === 'positive') color = 'green';
        if (text === 'negative') color = 'red';
        
        return <Tag color={color}>{showText}</Tag>;
      }
    },
    {
      title: '发布时间',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      sorter: (a: Message, b: Message) => {
        return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
      },
      sortOrder: 'descend',
      render: (text: string) => text || '-'
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      render: (text: string) => text || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Message) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {userRole === 'admin' && (
            <>
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
            </>
          )}
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
    // 重置输入框
    const input = document.querySelector('input[placeholder="搜索标题或内容"]') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  // 打开添加模态框
  const handleAddModalOpen = () => {
    setEditingMessage(null);
    setAddModalVisible(true);
  };

  // 关闭添加/编辑模态框
  const handleAddModalClose = () => {
    setAddModalVisible(false);
    setEditModalVisible(false);
    setEditingMessage(null);
  };

  // 监听添加/编辑模态框关闭状态，当关闭时重置表单
  useEffect(() => {
    if (!addModalVisible && !editModalVisible) {
      form.resetFields();
    }
  }, [addModalVisible, editModalVisible, form]);

  // 打开编辑模态框
  const handleEditModalOpen = (record: Message) => {
    setEditingMessage(record);
    setEditModalVisible(true);
  };

  // 监听编辑模态框显示状态，当显示时设置表单初始值
  useEffect(() => {
    if (editModalVisible && editingMessage) {
      // 兼容时间格式，避免赋值失败（使用后端的publishTime字段）
      const formatDate = editingMessage.publishTime ? moment(editingMessage.publishTime) : moment();
      form.setFieldsValue({
        title: editingMessage.title,
        content: editingMessage.content,
        cryptoType: editingMessage.cryptoType,
        sentiment: editingMessage.sentiment,
        date: formatDate,
        source: editingMessage.source
      });
    }
  }, [editModalVisible, editingMessage, form]);

  // 删除消息（适配后端批量删除接口：/crypto-news/{ids}）
  const handleDeleteMessage = (id: string) => {
    if (!id) {
      messageApi.warning('消息ID为空，无法删除');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条消息吗？删除后无法恢复',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          // 调用后端删除接口：DELETE /crypto-news/{ids}（支持单个ID）
          await api.delete(`${NEWS_API}/${id}`);
          messageApi.success('删除成功');
          // 重新获取列表，更新前端数据
          fetchMessageList();
        } catch (error) {
          console.error('删除消息失败:', error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 表单提交处理（新增/编辑，适配后端字段）
  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 格式化提交数据（映射前端字段→后端字段）
      const submitData = {
        title: values.title,
        content: values.content,
        cryptoType: values.cryptoType,
        // 前端sentiment → 后端emotion
        emotion: values.sentiment === 'positive' ? '正面' : 
                 values.sentiment === 'negative' ? '负面' : '中性',
        // 前端date → 后端publishTime
        publishTime: values.date.format('YYYY-MM-DD HH:mm:ss'),
        source: values.source
      };

      if (editingMessage) {
        // 编辑现有消息：PUT /crypto-news（需要传递ID）
        await api.put(NEWS_API, {
          ...submitData,
          id: Number(editingMessage.id) // 转Long类型适配后端
        });
        messageApi.success('编辑成功');
      } else {
        // 添加新消息：POST /crypto-news
        await api.post(NEWS_API, submitData);
        messageApi.success('添加成功');
      }
      
      handleAddModalClose();
      // 重新获取列表，同步最新数据
      fetchMessageList();
    } catch (error) {
      console.log('表单提交失败:', error);
      console.log('错误详情:', JSON.stringify(error, null, 2));
      // 验证失败时不提示重复的错误信息
      if (!error?.toString().includes('ValidateError')) {
        // 根据不同错误类型显示更具体的错误信息
        if (error && typeof error === 'object' && 'response' in error && (error as any).response?.status === 401) {
          messageApi.error('认证失败，请重新登录');
        } else if (error && typeof error === 'object' && 'response' in error && (error as any).response?.status === 403) {
          messageApi.error('权限不足，无法操作');
        } else if ((error as any)?.response?.status === 400) {
          messageApi.error('请求参数错误，请检查表单内容');
        } else {
          messageApi.error('操作失败，请检查表单内容');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider> {/* 修复message静态方法警告 */}
      {contextHolder}
      <div className={styles.container}>
        <Card 
          title="消息列表" 
          className={styles.messageCard}
          extra={
            userRole === 'admin' && (
              <Space>
                {/* 同步Dify资讯按钮 */}
                <Button 
                  type="primary" 
                  icon={<SyncOutlined />} 
                  onClick={handleSyncDifyNews}
                  loading={loading}
                  size="middle"
                  shape="round"
                  style={{ 
                    background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  同步Dify资讯
                </Button>
                {/* 添加消息按钮 */}
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAddModalOpen}
                  size="middle"
                  shape="round"
                  style={{ 
                    background: 'linear-gradient(135deg, #52c41a 0%, #13c2c2 100%)',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  添加消息
                </Button>
              </Space>
            )
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
                allowClear // 新增：清空按钮
              />
              
              <Select
                placeholder="选择数字货币类型"
                style={{ width: 150 }}
                value={selectedCrypto}
                onChange={handleCryptoChange}
                allowClear
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
                allowClear
              >
                <Option value="">全部</Option>
                <Option value="positive">利好</Option>
                <Option value="negative">利空</Option>
                <Option value="neutral">中性</Option>
              </Select>
              
              <Button onClick={handleResetFilters}>重置筛选</Button>
              
              <Select
                placeholder="切换角色"
                style={{ width: 120 }}
                value={userRole}
                onChange={(value) => setUserRole(value as UserRole)}
              >
                <Option value="viewer">普通查看员</Option>
                <Option value="admin">管理员</Option>
              </Select>
            </Space>
          </div>

          {/* 总数据量显示 */}
          <div style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}>
            共 <strong>{total}</strong> 条数据
          </div>

          {/* 消息表格 */}
          <Table
            columns={columns as (TableColumnGroupType<Message> | TableColumnType<Message>)[]}
            dataSource={filteredMessages}
            rowKey="id"
            pagination={{ 
              current: currentPage, 
              pageSize: pageSize, 
              total: total, 
              showSizeChanger: true, 
              pageSizeOptions: ['5', '10', '20'],
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
                fetchMessageList();
              },
              onShowSizeChange: (current, size) => {
                setPageSize(size);
                setCurrentPage(1);
                fetchMessageList();
              }
            }}
            className={styles.messageTable}
            scroll={{ x: 1000 }}
            loading={loading}
            // 无数据时显示提示
            locale={{ emptyText: loading ? '加载中...' : '暂无匹配的消息数据' }}
          />
        </Card>

        {/* 消息详情弹窗 */}
        <Modal
          title="消息详情"
          open={detailModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
          destroyOnClose // 关闭时销毁内容，避免缓存
        >
          {selectedMessage ? (
            <div className={styles.detailContainer}>
              <h2 className={styles.detailTitle}>{selectedMessage.title || '-'}</h2>
              <div className={styles.detailMeta}>
                <Tag color={selectedMessage.cryptoType === 'ALL' ? 'default' : 'blue'}>
                  {selectedMessage.cryptoType || '-'}
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
                <span className={styles.detailDate}>{selectedMessage.date || '-'}</span>
                <span className={styles.detailSource}>来源：{selectedMessage.source || '-'}</span>
              </div>
              <div className={styles.detailContent}>
                {selectedMessage.content || '无内容'}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40 }}>暂无详情数据</div>
          )}
        </Modal>

        {/* 添加/编辑消息弹窗 */}
        <Modal
          title={editingMessage ? "编辑消息" : "添加消息"}
          open={addModalVisible || editModalVisible}
          onCancel={handleAddModalClose}
          onOk={handleFormSubmit}
          width={600}
          destroyOnClose
          // 防止重复提交
          okButtonProps={{ loading: loading }}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              date: moment(),
              cryptoType: 'ALL',
              sentiment: 'neutral'
            }}
            validateMessages={{
              required: '${label}为必填项',
            }}
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, max: 100, message: '标题不能为空且长度不超过100字' }]}
            >
              <Input placeholder="请输入消息标题" maxLength={100} />
            </Form.Item>

            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <Input.TextArea rows={4} placeholder="请输入消息内容" maxLength={1000} showCount />
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
              rules={[{ required: true, max: 50, message: '来源不能为空且长度不超过50字' }]}
            >
              <Input placeholder="请输入消息来源" maxLength={50} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default MessageList;