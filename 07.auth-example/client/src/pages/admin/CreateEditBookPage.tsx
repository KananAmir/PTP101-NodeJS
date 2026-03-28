import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Select, Upload, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { bookService } from '../../services/bookService';
import { genreService } from '../../services/genreService';
import type { Genre, CreateBookPayload, UpdateBookPayload } from '../../types';

export const CreateEditBookPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEdit = !!id;

  // Fetch genres
  useEffect(() => {
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
    fetchGenres();
  }, []);

  // Fetch book if editing
  useEffect(() => {
    if (isEdit) {
      const fetchBook = async () => {
        try {
          setLoading(true);
          const response = await bookService.getBookById(id);
          if (response.data) {
            const book = response.data;
            form.setFieldsValue({
              title: book.title,
              author: book.author,
              description: book.description,
              genre: typeof book.genre === 'string' ? book.genre : book.genre._id,
              price: book.price,
              discount: book.discount,
              stock: book.stock,
            });
          }
        } catch (error) {
          message.error('Failed to fetch book');
        } finally {
          setLoading(false);
        }
      };
      fetchBook();
    }
  }, [id, isEdit, form]);

  const handleSubmit = async (values: CreateBookPayload) => {
    try {
      setLoading(true);
      if (isEdit) {
        const payload: UpdateBookPayload = {
          title: values.title,
          author: values.author,
          description: values.description,
          genre: values.genre,
          price: values.price,
          discount: values.discount,
          stock: values.stock,
        };
        await bookService.updateBook(id, payload, imageFile || undefined);
        message.success('Book updated successfully');
      } else {
        await bookService.createBook(values, imageFile || undefined);
        message.success('Book created successfully');
      }
      navigate('/admin/books');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info: any) => {
    if (info.file.originFileObj) {
      setImageFile(info.file.originFileObj);
    }
  };

  return (
    <Card title={isEdit ? 'Edit Book' : 'Create New Book'} style={{ maxWidth: '600px' }}>
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="title"
            label="Book Title"
            rules={[
              { required: true, message: 'Please enter book title' },
              { min: 2, message: 'Title must be at least 2 characters' },
            ]}
          >
            <Input placeholder="Enter book title" />
          </Form.Item>

          <Form.Item
            name="author"
            label="Author"
            rules={[
              { required: true, message: 'Please enter author name' },
              { min: 2, message: 'Author name must be at least 2 characters' },
            ]}
          >
            <Input placeholder="Enter author name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ min: 5, message: 'Description must be at least 5 characters' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter book description" />
          </Form.Item>

          <Form.Item
            name="genre"
            label="Genre"
            rules={[{ required: true, message: 'Please select a genre' }]}
          >
            <Select placeholder="Select genre">
              {genres.map((genre) => (
                <Select.Option key={genre._id} value={genre._id}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price ($)"
            rules={[
              { required: true, message: 'Please enter price' },
              { type: 'number', min: 0, message: 'Price must be positive' },
            ]}
          >
            <InputNumber placeholder="0.00" step={0.01} />
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

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ type: 'number', min: 0, message: 'Stock must be positive' }]}
          >
            <InputNumber placeholder="0" step={1} />
          </Form.Item>

          <Form.Item label="Book Image">
            <Upload
              maxCount={1}
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              <Button icon={<PlusOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {isEdit ? 'Update Book' : 'Create Book'}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};
