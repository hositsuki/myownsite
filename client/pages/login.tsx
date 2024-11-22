import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { Button, Form, Input, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from '@/styles/auth.module.css';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [form] = Form.useForm<LoginFormData>();

  // 处理表单提交
  const handleSubmit = async (values: LoginFormData) => {
    try {
      await login({ email: values.email, password: values.password, remember: values.remember });
      message.success('登录成功！');
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message || '登录失败，请重试');
      } else {
        message.error('登录失败，请重试');
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>登录</h1>
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          initialValues={{ remember: true }}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="邮箱"
              autoComplete="email"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item>
            <div className={styles.formActions}>
              <Link href="/forgot-password">
                忘记密码？
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>

          <Form.Item>
            <div className={styles.registerLink}>
              还没有账号？{' '}
              <Link href="/register">
                立即注册
              </Link>
            </div>
          </Form.Item>
        </Form>

        <Divider>或者</Divider>

        <div className={styles.oauthButtons}>
          <Button
            icon={<GithubOutlined />}
            loading={loading}
            block
          >
            使用 GitHub 登录
          </Button>
          <Button
            icon={<GoogleOutlined />}
            loading={loading}
            block
          >
            使用 Google 登录
          </Button>
        </div>
      </div>
    </div>
  );
}
