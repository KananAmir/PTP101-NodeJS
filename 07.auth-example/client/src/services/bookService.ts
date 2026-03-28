import apiClient from './api';
import type {
  Book,
  CreateBookPayload,
  UpdateBookPayload,
  BookFilterParams,
  PaginatedResponse,
  ApiResponse,
} from '../types';

export const bookService = {
  // Get all books with filters
  getBooks: async (params?: BookFilterParams): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get('/books', { params });
    return response.data;
  },

  // Get single book
  getBookById: async (id: string): Promise<ApiResponse<Book>> => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },

  // Create book
  createBook: async (payload: CreateBookPayload, imageFile?: File): Promise<ApiResponse<Book>> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('author', payload.author);
    if (payload.description) formData.append('description', payload.description);
    formData.append('genre', payload.genre);
    formData.append('price', payload.price.toString());
    if (payload.discount) formData.append('discount', payload.discount.toString());
    if (payload.stock) formData.append('stock', payload.stock.toString());
    if (imageFile) formData.append('image', imageFile);

    const response = await apiClient.post('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update book
  updateBook: async (id: string, payload: UpdateBookPayload, imageFile?: File): Promise<ApiResponse<Book>> => {
    const formData = new FormData();
    if (payload.title) formData.append('title', payload.title);
    if (payload.author) formData.append('author', payload.author);
    if (payload.description) formData.append('description', payload.description);
    if (payload.genre) formData.append('genre', payload.genre);
    if (payload.price) formData.append('price', payload.price.toString());
    if (payload.discount) formData.append('discount', payload.discount.toString());
    if (payload.stock) formData.append('stock', payload.stock.toString());
    if (imageFile) formData.append('image', imageFile);

    const response = await apiClient.put(`/books/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete book
  deleteBook: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  },

  // Get books by genre
  getBooksByGenre: async (genreId: string, params?: Omit<BookFilterParams, 'genre'>): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get(`/books/genre/${genreId}`, { params });
    return response.data;
  },
};
