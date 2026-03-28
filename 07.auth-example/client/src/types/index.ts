// Genre types
export interface Genre {
  _id: string;
  name: string;
  description?: string;
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Book types
export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  genre: Genre | string;
  price: number;
  discount?: number;
  image?: string;
  coverImageURL?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  skip?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Filter types
export interface BookFilterParams extends PaginationParams {
  title?: string;
  author?: string;
  genre?: string;
  sortBy?: 'price' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Create/Update types
export interface CreateBookPayload {
  title: string;
  author: string;
  description?: string;
  genre: string;
  price: number;
  discount?: number;
  stock?: number;
}

export interface UpdateBookPayload extends Partial<CreateBookPayload> {}

export interface CreateGenrePayload {
  name: string;
  description?: string;
  discount?: number;
}

export interface UpdateGenrePayload extends Partial<CreateGenrePayload> {}

// Form types
export interface BookFormValues {
  title: string;
  author: string;
  description?: string;
  genre: string;
  price: number;
  discount?: number;
  stock?: number;
  image?: File | null;
}

export interface GenreFormValues {
  name: string;
  description?: string;
  discount?: number;
}
