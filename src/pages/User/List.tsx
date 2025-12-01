import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { history, useLocation } from '@umijs/max';

const { Search } = Input;

// 用户类型定义
interface User {
  key: string;
  name: string;
  age: number;
  address?: string;
  tags?: string[];
  status?: string;
}

const UserList: React.FC = () => {
  // 使用useState管理用户数据，使其可变
  const [users, setUsers] = useState<User[]>([
    { key: '1', name: '张三', age: 32, address: '北京市朝阳区', tags: ['管理员'], status: 'active' },
    { key: '2', name: '李四', age: 42, address: '上海市浦东新区', tags: ['普通用户'], status: 'active' },
  ]);
  
  const location = useLocation();

  // 监听URL参数，检查是否有新添加的用户数据
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newUserStr = params.get('newUser');
    
    if (newUserStr) {
      try {
        const newUser: Omit<User, 'key'> = JSON.parse(newUserStr);
        // 生成唯一ID并添加新用户
        const newUserWithKey: User = {
          ...newUser,
          key: String(Date.now()), // 使用时间戳作为唯一标识
          address: newUser.address || '未填写',
          tags: newUser.tags || ['新用户'],
          status: newUser.status || 'active'
        };
        
        // 更新用户列表
        setUsers(prevUsers => [...prevUsers, newUserWithKey]);
        
        // 清除URL参数，避免重复添加
        history.replace({
          search: ''
        });
      } catch (e) {
        console.error('解析新用户数据失败:', e);
      }
    }
  }, [location.search, history]);

  // 表格列配置
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    { title: '操作', key: 'action', render: () => (
      <Space size="middle">
        <Button type="text" icon={<EditOutlined />}>编辑</Button>
        <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
      </Space>
    )},
  ];

  // 添加用户函数
  const handleAddUser = () => {
    history.push('/user/add');
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>用户列表</h1>
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
            添加用户
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={users} />
    </div>
  );
};

export default UserList;