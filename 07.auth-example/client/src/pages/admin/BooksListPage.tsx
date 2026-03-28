import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Card,
  Row,
  Col,
  Input,
  Select,
  Spin,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { genreService } from '../../services/genreService';
import type { Book, Genre } from '../../types';

export const BooksListPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [searchTitle, setSearchTitle] = useState('');
  const [filterGenre, setFilterGenre] = useState<string>('');
  const [totalBooks, setTotalBooks] = useState(0);

  // Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBooks({
        page: pagination.page,
        limit: pagination.limit,
        title: searchTitle || undefined,
        genre: filterGenre || undefined,
      });
      setBooks(response.data);
      setTotalBooks(response.total);
    } catch (error) {
      message.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  // Fetch genres
  const fetchGenres = async () => {
    try {
      const response = await genreService.getGenres();
      if (response.data) {
        setGenres(response.data);
      }
    } catch (error) {
      message.error('Failed to fetch genres');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [pagination.page, pagination.limit, searchTitle, filterGenre]);

  useEffect(() => {
    fetchGenres();
  }, []);

  // Delete book
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Book',
      content: 'Are you sure you want to delete this book?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await bookService.deleteBook(id);
          message.success('Book deleted successfully');
          fetchBooks();
        } catch (error) {
          message.error('Failed to delete book');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Genre',
      dataIndex: ['genre', 'name'],
      key: 'genre',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => discount ? `${discount}%` : '-',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Book) => (
        <Space size="small">
          <Link to={`/admin/books/${record._id}/edit`}>
            <Button type="primary" icon={<EditOutlined />} size="small">
              Edit
            </Button>
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Books Management" extra={<Link to="/admin/books/create"><Button type="primary" icon={<PlusOutlined />}>Create Book</Button></Link>}>
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={24} md={8}>
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
        <Col xs={24} sm={24} md={8}>
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
      </Row>

      <Spin spinning={loading}>
        <Table
          dataSource={books}
          columns={columns}
          rowKey="_id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: totalBooks,
            onChange: (page, pageSize) => {
              setPagination({ page, limit: pageSize });
            },
          }}
        />
      </Spin>
    </Card>
  );
};
