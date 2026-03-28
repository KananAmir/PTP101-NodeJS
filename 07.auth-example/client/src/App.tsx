import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// Layouts
import { AdminLayout } from './layouts/AdminLayout';
import { ClientLayout } from './layouts/ClientLayout';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { BooksListPage } from './pages/admin/BooksListPage';
import { CreateEditBookPage } from './pages/admin/CreateEditBookPage';
import { GenresListPage } from './pages/admin/GenresListPage';

// Client Pages
import { ClientHomePage } from './pages/client/ClientHomePage';
import { BookDetailPage } from './pages/client/BookDetailPage';

import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="books" element={<BooksListPage />} />
            <Route path="books/create" element={<CreateEditBookPage />} />
            <Route path="books/:id/edit" element={<CreateEditBookPage />} />
            <Route path="genres" element={<GenresListPage />} />
          </Route>

          {/* Client Routes */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<ClientHomePage />} />
            <Route path="books" element={<ClientHomePage />} />
            <Route path="books/:id" element={<BookDetailPage />} />
            <Route path="about" element={<div style={{ padding: '24px' }}><h1>About Us</h1><p>Coming soon...</p></div>} />
            <Route path="contact" element={<div style={{ padding: '24px' }}><h1>Contact Us</h1><p>Coming soon...</p></div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
