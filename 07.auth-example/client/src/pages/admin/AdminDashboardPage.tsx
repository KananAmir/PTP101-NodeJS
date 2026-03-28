import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, message } from 'antd';
import { BookOutlined, TagsOutlined } from '@ant-design/icons';
import { bookService } from '../../services/bookService';
import { genreService } from '../../services/genreService';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalGenres: 0,
    discountedBooks: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [booksRes, genresRes] = await Promise.all([
          bookService.getBooks({ page: 1, limit: 1 }),
          genreService.getGenres(),
        ]);

        setStats({
          totalBooks: booksRes.total,
          totalGenres: genresRes.data?.length || 0,
          discountedBooks: booksRes.data.filter((b) => b.discount).length,
        });
        } catch (_error) {
        message.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8}>
            <Card>
              <Statistic
                title="Total Books"
                value={stats.totalBooks}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card>
              <Statistic
                title="Total Genres"
                value={stats.totalGenres}
                prefix={<TagsOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card>
              <Statistic
                title="Books with Discount"
                value={stats.discountedBooks}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};
