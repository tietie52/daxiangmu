import React from 'react';
import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import styles from './index.less';

const { Option } = Select;

const AddUser: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    
    // 准备要传递的新用户数据
    const newUserData = {
      name: values.username,
      age: values.age,
      gender: values.gender,
      address: values.address || '未填写', // 使用用户输入的地址，或默认值
      tags: ['新用户'],
      status: 'active'
    };
    
    // 显示成功消息
    message.success('用户添加成功！');
    
    // 将新用户数据转换为URL编码的JSON字符串
    const newUserStr = encodeURIComponent(JSON.stringify(newUserData));
    
    // 重定向回用户列表页面，并传递新用户数据
    history.push({ 
      pathname: '/user/list',
      search: `?newUser=${newUserStr}` 
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  // 返回按钮
  const handleBack = () => {
    history.push('/user/list');
  };

  return (
    <div className={styles.container} style={{ padding: 24 }}>
      <div className={styles.header}>
        <h1>添加用户</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        
        <Form.Item
          label="年龄"
          name="age"
          rules={[
            {
              required: true,
              message: '请输入年龄!',
            },
          ]}
        >
          <InputNumber min={0} max={150} placeholder="请输入年龄" />
        </Form.Item>
        
        <Form.Item
          label="性别"
          name="gender"
          rules={[
            {
              required: true,
              message: '请选择性别!',
            },
          ]}
        >
          <Select placeholder="请选择性别">
            <Option value="male">男</Option>
            <Option value="female">女</Option>
          </Select>
        </Form.Item>
        
        {/* 添加地址输入字段 */}
        <Form.Item
          label="地址"
          name="address"
          rules={[
            {
              required: false, // 地址为可选字段
            },
          ]}
        >
          <Input placeholder="请输入地址" />
        </Form.Item>
        
        <Form.Item>
          <div className={styles.buttonGroup}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              保存
            </Button>
            <Button onClick={onReset} icon={<UndoOutlined />} style={{ marginLeft: 16 }}>
              重置
            </Button>
            <Button onClick={handleBack} style={{ marginLeft: 16 }}>
              返回
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddUser;