import React, { useState } from 'react';

export interface FilterOptions {
  priceRange: [number, number];
  category: string;
  brand: string[];
  size: string[];
  color: string[];
  rating: number;
  inStock: boolean;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  maxPrice: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange,
  categories,
  maxPrice,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, maxPrice],
    category: '',
    brand: [],
    size: [],
    color: [],
    rating: 0,
    inStock: false,
  });

  const handleCategoryChange = (category: string) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleInStockToggle = () => {
    const newFilters = { ...filters, inStock: !filters.inStock };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      priceRange: [0, maxPrice],
      category: '',
      brand: [],
      size: [],
      color: [],
      rating: 0,
      inStock: false,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Filters</h3>
        <button
          onClick={clearFilters}
          style={{ padding: '0.25rem 0.5rem', backgroundColor: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Category</label>
        <select
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={handleInStockToggle}
          />
          In Stock Only
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;