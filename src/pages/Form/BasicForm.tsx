import React from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber } from 'antd';
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const BasicForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    // 这里可以处理表单提交逻辑
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className={styles.container}>
      <h1>基础表单</h1>
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
            <Option value="other">其他</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          label="出生日期"
          name="birthDate"
          rules={[
            {
              required: true,
              message: '请选择出生日期!',
            },
          ]}
        >
          <DatePicker style={{ width: '100%' }} placeholder="请选择出生日期" />
        </Form.Item>
        
        <Form.Item
          label="备注"
          name="remark"
        >
          <TextArea rows={4} placeholder="请输入备注" />
        </Form.Item>
        
        <Form.Item>
          <div className={styles.buttonGroup}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              提交
            </Button>
            <Button onClick={onReset} icon={<UndoOutlined />} style={{ marginLeft: 16 }}>
              重置
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BasicForm;