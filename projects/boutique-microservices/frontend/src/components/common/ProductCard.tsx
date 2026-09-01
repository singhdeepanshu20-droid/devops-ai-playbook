import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
  variant?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const isOutOfStock = (product.inventory_quantity ?? product.inventory ?? 0) === 0;

  const getImageSrc = (): string => {
    if (product.imageUrl) return product.imageUrl;
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjwvc3ZnPgo=';
  };

  const formattedPrice = (() => {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    return isNaN(price) || !isFinite(price) ? '0.00' : price.toFixed(2);
  })();

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <img
        src={getImageSrc()}
        alt={product.name}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjwvc3ZnPgo=';
        }}
      />
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          {product.category}
        </span>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>{product.name}</h3>
        <p style={{ fontSize: '0.875rem', color: '#666', flex: 1, margin: '0 0 1rem 0' }}>{product.description}</p>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1rem' }}>
          ${formattedPrice}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => navigate(`/products/${product.id}`)}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid #1a1a1a',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Details
          </button>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: isOutOfStock ? '#ccc' : '#1a1a1a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;