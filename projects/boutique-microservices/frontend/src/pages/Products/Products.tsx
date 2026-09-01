import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/common/ProductCard';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel from '../../components/common/FilterPanel';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const { addItem } = useCart();

  const categories = ['clothing', 'accessories', 'shoes', 'bags', 'jewelry'];
  const brands = ['Gucci', 'Prada', 'Louis Vuitton', 'Chanel', 'Hermès'];
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Black', 'White', 'Beige', 'Gold'];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await productService.getAll();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('[Products] Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy]);

  const handleFilterChange = (filters: any) => {
    let filtered = products;
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }
    if (filters.inStock) {
      filtered = filtered.filter(product => (product.inventory_quantity ?? product.inventory ?? 0) > 0);
    }
    setFilteredProducts(filtered);
  };

  if (loading) {
    return <LoadingSkeleton count={12} />;
  }

  const maxPrice = Math.max(...products.map(p => p.price), 1000);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', marginTop: '1rem' }}>
      <aside>
        <FilterPanel
          onFilterChange={handleFilterChange}
          categories={categories}
          brands={brands}
          sizes={sizes}
          colors={colors}
          maxPrice={maxPrice}
        />
      </aside>
      <main>
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <SearchBar onSearch={setSearchQuery} />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="featured">Sort By: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addItem} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#666' }}>
            No products found matching your search criteria.
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;