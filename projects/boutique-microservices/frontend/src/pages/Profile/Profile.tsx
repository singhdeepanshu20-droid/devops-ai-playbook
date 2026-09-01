import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Please log in to view your profile</h2>
        <Link to="/login" style={{ padding: '0.5rem 1rem', backgroundColor: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '2rem' }}>My Profile</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#fff', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#d4af37',
            color: '#1a1a1a',
            fontSize: '2rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{user.firstName} {user.lastName}</h2>
          <p style={{ color: '#666', margin: '0 0 1.5rem 0' }}>{user.email}</p>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid #d32f2f',
              color: '#d32f2f',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#fff' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Account Information</h3>
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;