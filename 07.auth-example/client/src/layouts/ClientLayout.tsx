import { Layout, Menu, Row, Col } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

export const ClientLayout = () => {
  const menuItems = [
    {
      key: '/',
      label: <Link to="/">Home</Link>,
    },
    {
      key: '/books',
      label: <Link to="/books">Books</Link>,
    },
    {
      key: '/about',
      label: <Link to="/about">About</Link>,
    },
    {
      key: '/contact',
      label: <Link to="/contact">Contact</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingInline: '50px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>
          BookStore
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={menuItems}
          defaultSelectedKeys={['/']}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        />
      </Header>

      <Content style={{ padding: '24px 50px', minHeight: 'calc(100vh - 134px)' }}>
        <Outlet />
      </Content>

      <Footer
        style={{
          textAlign: 'center',
          background: '#f0f2f5',
          marginTop: 'auto',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8}>
            <h4>About Us</h4>
            <p>Your favorite online bookstore</p>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <h4>Quick Links</h4>
            <p>
              <Link to="/books">Browse Books</Link>
            </p>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <h4>Contact</h4>
            <p>Email: info@bookstore.com</p>
          </Col>
        </Row>
        <hr />
        <p>&copy; 2024 BookStore. All rights reserved.</p>
      </Footer>
    </Layout>
  );
};
