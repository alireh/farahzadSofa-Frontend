import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import HeaderAdmin from './pages/admin/HeaderManagement';
import FurnitureStore from './pages/FurnitureStore';
import AdminPage from './pages/AdminPage';

// کامپوننت محافظت از مسیر
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحه لاگین - عمومی */}
        <Route path="/login" element={<LoginPage />} />

        {/* صفحه اصلی - موقتاً به لاگین هدایت کن */}
        <Route path="/" element={<FurnitureStore />} />

        {/* صفحات ادمین - نیاز به توکن */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }>
          <Route index element={<div>به پنل مدیریت خوش آمدید</div>} />
          <Route path="header" element={<HeaderAdmin />} />
        </Route>

        {/* مسیر نامعتبر */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;