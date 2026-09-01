import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const featuredProducts = await productService.getAll();
        setProducts(featuredProducts.slice(0, 8));
      } catch (error) {
        console.error('[Home] Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <LoadingSkeleton count={8} />;
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: '4rem 2rem',
        borderRadius: '12px',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', fontFamily: 'Playfair Display, serif' }}>
          Discover Timeless <span style={{ color: '#d4af37' }}>Elegance</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Indulge in our curated collection of luxury products, where sophistication meets exceptional quality.
        </p>
        <Link
          to="/products"
          style={{
            backgroundColor: '#d4af37',
            color: '#1a1a1a',
            textDecoration: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '6px',
            fontWeight: 700,
            display: 'inline-block'
          }}
        >
          Shop Collection
        </Link>
      </section>

      {/* Featured Products */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>
          Featured Products
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addItem} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;