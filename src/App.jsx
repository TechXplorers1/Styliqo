import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AddProductPage from './pages/AddProductPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage'; // NEW IMPORT
import AuthGuard from './components/auth/AuthGuard'; // NEW IMPORT
import AuthProvider from './context/AuthContext'; // NEW IMPORT (assuming AuthProvider is a context provider)
import useAuthStore from './store/useAuthStore';

const App = () => { // Changed from function App()
  const initializeAuth = useAuthStore(state => state.initialize);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  return (
    <Router>
      <AuthProvider> {/* NEW WRAPPER */}
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="category/:category" element={<ProductListingPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} /> {/* Path changed */}
            <Route
              path="/checkout" // Path changed
              element={
                <AuthGuard>
                  <CheckoutPage />
                </AuthGuard>
              }
            />
            <Route
              path="/profile" // Path changed
              element={
                <AuthGuard>
                  <ProfilePage />
                </AuthGuard>
              }
            />
            <Route // NEW ROUTE
              path="/orders"
              element={
                <AuthGuard>
                  <OrdersPage />
                </AuthGuard>
              }
            />
            {/* Add more routes here later */}
            <Route path="*" element={<div className="p-10 text-center">404: Page Not Found</div>} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="add-product" element={<AddProductPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
