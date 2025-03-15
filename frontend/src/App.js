import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Loans from './pages/Loans';
import { useAuth } from './contexts/AuthContext';  // Tambahkan import ini
import Users from './pages/Users';  // bukan './pages/users'

// Tambahkan import AuthProvider yang hilang
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

const ProtectedRoutes = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/members" element={<Members />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/profile" element={<Profile />} />
        {user.role === 'ADMIN' && (
          <Route path="/users" element={<Users />} />
        )}
        {(user.role === 'ADMIN' || user.role === 'LIBRARIAN') && (
          <Route path="/reports" element={<Reports />} />
        )}
      </Routes>
    </Layout>
  );
};

export default App;
