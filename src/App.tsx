import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute2';
import ArticlePage from './pages/ArticlePage';
import FurnitureStore from './pages/FurnitureStore';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FurnitureStore />} />
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/articles/:id" element={<ArticlePage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;