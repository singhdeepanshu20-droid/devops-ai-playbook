import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const productData = await productService.getById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      setMessage(`${quantity} item(s) added to cart!`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <LoadingSkeleton count={1} />;

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const formattedPrice = (() => {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    return isNaN(price) || !isFinite(price) ? '0.00' : price.toFixed(2);
  })();

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '1.5rem', color: '#666' }}>
        <Link to="/" style={{ color: '#1a1a1a', textDecoration: 'none' }}>Home</Link> /{' '}
        <Link to="/products" style={{ color: '#1a1a1a', textDecoration: 'none' }}>Products</Link> /{' '}
        <span>{product.name}</span>
      </div>

      {message && (
        <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div>
          <img
            src={product.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjwvc3ZnPgo='}
            alt={product.name}
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
          />
        </div>
        <div>
          <span style={{ textTransform: 'uppercase', color: '#888', fontSize: '0.875rem', fontWeight: 600 }}>{product.category}</span>
          <h1 style={{ fontSize: '2.25rem', margin: '0.5rem 0 1rem 0' }}>{product.name}</h1>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '1.5rem' }}>
            ${formattedPrice}
          </div>
          <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '2rem' }}>{product.description}</p>

          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ fontWeight: 600 }}>Quantity:</label>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
            >
              -
            </button>
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;