import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Card,
  Form,
  Input,
  InputNumber,
  Drawer,
  Spin,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { genreService } from '../../services/genreService';
import type { Genre, CreateGenrePayload } from '../../types';

export const GenresListPage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [form] = Form.useForm();

  // Fetch genres
  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await genreService.getGenres();
      if (response.data) {
        setGenres(response.data);
      }
      } catch (_error) {
      message.error('Failed to fetch genres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  // Open edit drawer
  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre);
    form.setFieldsValue({
      name: genre.name,
      description: genre.description,
      discount: genre.discount,
    });
    setIsDrawerOpen(true);
  };

  // Delete genre
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Genre',
      content: 'Are you sure you want to delete this genre?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await genreService.deleteGenre(id);
          message.success('Genre deleted successfully');
          fetchGenres();
          } catch (_error) {
          message.error('Failed to delete genre');
        }
      },
    });
  };

  // Handle form submit
  const handleFormSubmit = async (values: CreateGenrePayload) => {
    try {
      setLoading(true);
      if (editingGenre) {
        await genreService.updateGenre(editingGenre._id, values);
        message.success('Genre updated successfully');
      } else {
        await genreService.createGenre(values);
        message.success('Genre created successfully');
      }
      setIsDrawerOpen(false);
      form.resetFields();
      setEditingGenre(null);
      fetchGenres();
    } catch (error) {
      const err = error as any;
      message.error(err.response?.data?.message || 'Failed to save genre');
    } finally {
      setLoading(false);
    }
  };

  const openCreateDrawer = () => {
    setEditingGenre(null);
    form.resetFields();
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => discount ? `${discount}%` : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Genre) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
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
    <>
      <Card title="Genres Management" extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreateDrawer}>Create Genre</Button>}>
        <Spin spinning={loading}>
          <Table
            dataSource={genres}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </Spin>
      </Card>

      <Drawer
        title={editingGenre ? 'Edit Genre' : 'Create Genre'}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Genre Name"
            rules={[
              { required: true, message: 'Please enter genre name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input placeholder="Enter genre name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ min: 5, message: 'Description must be at least 5 characters' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter genre description" />
          </Form.Item>

          <Form.Item
            name="discount"
            label="Discount (%)"
            rules={[
              { type: 'number', min: 0, max: 100, message: 'Discount must be between 0 and 100' },
            ]}
          >
            <InputNumber placeholder="0" step={1} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {editingGenre ? 'Update Genre' : 'Create Genre'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
