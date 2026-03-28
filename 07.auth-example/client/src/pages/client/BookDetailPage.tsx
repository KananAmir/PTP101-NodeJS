import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Spin, message, Tag, Space, Empty, Breadcrumb } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { bookService } from '../../services/bookService';
import type { Book } from '../../types';

export const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await bookService.getBookById(id);
        if (response.data) {
          setBook(response.data);
        }
      } catch (error) {
        message.error('Failed to fetch book details');
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  if (loading) {
    return <Spin />;
  }

  if (!book) {
    return <Empty description="Book not found" />;
  }

  const calculateFinalPrice = () => {
    let price = book.price;
    // Apply genre discount if available
    if (typeof book.genre === 'object' && book.genre.discount) {
      price = price * (1 - book.genre.discount / 100);
    }
    // Apply book discount
    if (book.discount) {
      price = price * (1 - book.discount / 100);
    }
    return price.toFixed(2);
  };

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Button type="link" onClick={() => navigate('/books')}>
            Books
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{book.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Card loading={loading}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={24} md={10}>
            {book.coverImageURL ? (
              <img
                alt={book.title}
                src={book.coverImageURL}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '400px',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                No Image
              </div>
            )}
          </Col>

          <Col xs={24} sm={24} md={14}>
            <h1 style={{ marginBottom: '8px' }}>{book.title}</h1>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>
              by <strong>{book.author}</strong>
            </p>

            <div style={{ marginBottom: '16px' }}>
              <Tag color="blue">
                {typeof book.genre === 'object' ? book.genre.name : 'Unknown Genre'}
              </Tag>
            </div>

            {book.description && (
              <div style={{ marginBottom: '24px' }}>
                <h3>Description</h3>
                <p style={{ color: '#666' }}>{book.description}</p>
              </div>
            )}

            {/* Price Section */}
            <div
              style={{
                padding: '16px',
                background: '#f5f5f5',
                borderRadius: '8px',
                marginBottom: '24px',
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  ${calculateFinalPrice()}
                </span>
                {(book.discount || (typeof book.genre === 'object' && book.genre.discount)) && (
                  <span style={{ fontSize: '16px', color: '#999', marginLeft: '12px', textDecoration: 'line-through' }}>
                    ${book.price.toFixed(2)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                {book.discount && (
                  <Tag color="red">Book Discount: -{book.discount}%</Tag>
                )}
                {typeof book.genre === 'object' && book.genre.discount && (
                  <Tag color="blue">Genre Discount: -{book.genre.discount}%</Tag>
                )}
              </div>
            </div>

            {/* Stock Info */}
            <div style={{ marginBottom: '24px' }}>
              <p>
                <strong>Stock:</strong> {book.stock ? `${book.stock} copies available` : 'Out of stock'}
              </p>
            </div>

            {/* Actions */}
            <Space>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                disabled={!book.stock || book.stock === 0}
              >
                Add to Cart
              </Button>
              <Button size="large" onClick={() => navigate('/books')}>
                Back to Books
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
