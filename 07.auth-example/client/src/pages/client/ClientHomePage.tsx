import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Spin,
  message,
  Pagination,
  Tag,
  Space,
  Empty,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { genreService } from '../../services/genreService';
import type { Book, Genre } from '../../types';

export const ClientHomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 12 });
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [filterGenre, setFilterGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [totalBooks, setTotalBooks] = useState(0);

  // Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBooks({
        page: pagination.page,
        limit: pagination.limit,
        title: searchTitle || undefined,
        author: searchAuthor || undefined,
        genre: filterGenre || undefined,
        sortBy: sortBy as 'price' | 'title' | 'createdAt',
        sortOrder,
      });
      setBooks(response.data);
      setTotalBooks(response.total);
    } catch (_error) {
      message.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await genreService.getGenres();
        if (response.data) {
          setGenres(response.data);
        }
        } catch (_error) {
        message.error('Failed to fetch genres');
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [pagination.page, pagination.limit, searchTitle, searchAuthor, filterGenre, sortBy, sortOrder]);

  const calculateFinalPrice = (book: Book) => {
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
      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <h2>Search & Filter</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={6}>
            <Input
              placeholder="Search by title..."
              prefix={<SearchOutlined />}
              value={searchTitle}
              onChange={(e) => {
                setSearchTitle(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
            />
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Input
              placeholder="Search by author..."
              prefix={<SearchOutlined />}
              value={searchAuthor}
              onChange={(e) => {
                setSearchAuthor(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
            />
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Select
              allowClear
              placeholder="Filter by Genre"
              value={filterGenre || undefined}
              onChange={(value) => {
                setFilterGenre(value || '');
                setPagination({ ...pagination, page: 1 });
              }}
              style={{ width: '100%' }}
            >
              {genres.map((genre) => (
                <Select.Option key={genre._id} value={genre._id}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Space style={{ width: '100%' }}>
              <Select value={sortBy} onChange={setSortBy} style={{ width: '120px' }}>
                <Select.Option value="createdAt">Newest</Select.Option>
                <Select.Option value="price">Price</Select.Option>
                <Select.Option value="title">Title</Select.Option>
              </Select>
              <Select value={sortOrder} onChange={setSortOrder} style={{ width: '80px' }}>
                <Select.Option value="asc">Ascending</Select.Option>
                <Select.Option value="desc">Descending</Select.Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Books Grid */}
      <Spin spinning={loading}>
        {books.length === 0 ? (
          <Empty description="No books found" />
        ) : (
          <Row gutter={[16, 16]}>
            {books.map((book) => (
              <Col key={book._id} xs={24} sm={24} md={12} lg={8}>
                <Link to={`/books/${book._id}`}>
                  <Card
                    hoverable
                    cover={
                      book.coverImageURL ? (
                        <img
                          alt={book.title}
                          src={book.coverImageURL}
                          style={{ height: '250px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ height: '250px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          No Image
                        </div>
                      )
                    }
                  >
                    <Card.Meta
                      title={<strong>{book.title}</strong>}
                      description={
                        <div>
                          <p style={{ fontSize: '12px', color: '#666' }}>by {book.author}</p>
                          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                            {typeof book.genre === 'object' ? book.genre.name : 'N/A'}
                          </p>
                          <div style={{ marginBottom: '8px' }}>
                            {book.discount && (
                              <Tag color="red" style={{ marginRight: '4px' }}>
                                -{book.discount}%
                              </Tag>
                            )}
                            {typeof book.genre === 'object' && book.genre.discount && (
                              <Tag color="blue">Genre -{book.genre.discount}%</Tag>
                            )}
                          </div>
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
                              ${calculateFinalPrice(book)}
                            </span>
                            {(book.discount || (typeof book.genre === 'object' && book.genre.discount)) && (
                              <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px', textDecoration: 'line-through' }}>
                                ${book.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </Spin>

      {/* Pagination */}
      {books.length > 0 && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={totalBooks}
            onChange={(page, pageSize) => {
              setPagination({ page, limit: pageSize });
            }}
          />
        </div>
      )}
    </div>
  );
};
