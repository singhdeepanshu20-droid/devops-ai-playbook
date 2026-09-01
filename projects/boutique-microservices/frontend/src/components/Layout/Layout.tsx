import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Layout: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fafafa' }}>
      <header style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Playfair Display, serif' }}>
          <Link to="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Luxury Boutique</Link>
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          <Link to="/products" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}>Products</Link>
          {isAuthenticated && (
            <>
              <Link to="/orders" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}>Orders</Link>
              <Link to="/profile" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}>Profile</Link>
            </>
          )}
          <button
            onClick={() => navigate('/cart')}
            style={{
              backgroundColor: '#d4af37',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cart ({itemCount})
          </button>
          {isAuthenticated ? (
            <button
              onClick={logout}
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #ffffff',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                backgroundColor: '#ffffff',
                color: '#1a1a1a',
                textDecoration: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontWeight: 600
              }}
            >
              Login
            </Link>
          )}
        </nav>
      </header>
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
      <footer style={{ backgroundColor: '#1a1a1a', color: '#888888', textAlign: 'center', padding: '1.5rem', marginTop: 'auto' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Luxury Boutique. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;