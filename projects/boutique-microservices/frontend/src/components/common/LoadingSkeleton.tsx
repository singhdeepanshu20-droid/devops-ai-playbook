import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'product' | 'list' | 'detail';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', padding: '1rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem', backgroundColor: '#f9f9f9', minHeight: '200px' }}>
          <div style={{ height: '140px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '1rem' }} />
          <div style={{ height: '20px', backgroundColor: '#e0e0e0', width: '80%', borderRadius: '4px', marginBottom: '0.5rem' }} />
          <div style={{ height: '16px', backgroundColor: '#e0e0e0', width: '50%', borderRadius: '4px' }} />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;