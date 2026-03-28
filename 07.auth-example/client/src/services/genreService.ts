import apiClient from './api';
import type {
  Genre,
  CreateGenrePayload,
  UpdateGenrePayload,
  ApiResponse,
} from '../types';

export const genreService = {
  // Get all genres
  getGenres: async (): Promise<ApiResponse<Genre[]>> => {
    const response = await apiClient.get('/genres');
    return response.data;
  },

  // Get single genre
  getGenreById: async (id: string): Promise<ApiResponse<Genre>> => {
    const response = await apiClient.get(`/genres/${id}`);
    return response.data;
  },

  // Create genre
  createGenre: async (payload: CreateGenrePayload): Promise<ApiResponse<Genre>> => {
    const response = await apiClient.post('/genres', payload);
    return response.data;
  },

  // Update genre
  updateGenre: async (id: string, payload: UpdateGenrePayload): Promise<ApiResponse<Genre>> => {
    const response = await apiClient.put(`/genres/${id}`, payload);
    return response.data;
  },

  // Delete genre
  deleteGenre: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/genres/${id}`);
    return response.data;
  },

  // Apply discount to genre
  applyDiscount: async (id: string, discount: number): Promise<ApiResponse<Genre>> => {
    const response = await apiClient.put(`/genres/${id}`, { discount });
    return response.data;
  },
};
