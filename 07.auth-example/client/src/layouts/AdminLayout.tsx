import { Layout, Menu, Dropdown, Avatar, Button, Space } from 'antd';
import {
  HomeOutlined,
  BarsOutlined,
  TagsOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/layouts.css';

const { Header, Sider, Content } = Layout;

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <HomeOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: '/admin/books',
      icon: <BarsOutlined />,
      label: 'Books',
      children: [
        {
          key: '/admin/books',
          label: <Link to="/admin/books">Books List</Link>,
        },
        {
          key: '/admin/books/create',
          label: <Link to="/admin/books/create">Create Book</Link>,
        },
      ],
    },
    {
      key: '/admin/genres',
      icon: <TagsOutlined />,
      label: 'Genres',
      children: [
        {
          key: '/admin/genres',
          label: <Link to="/admin/genres">Genres List</Link>,
        },
        {
          key: '/admin/genres/create',
          label: <Link to="/admin/genres/create">Create Genre</Link>,
        },
      ],
    },
  ];

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={200}>
        <div style={{ padding: '16px', color: 'white', textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>Admin Panel</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          defaultSelectedKeys={[window.location.pathname]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />

          <Space>
            <Dropdown menu={{ items: userMenu.items as any }} trigger={['click']}>
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
