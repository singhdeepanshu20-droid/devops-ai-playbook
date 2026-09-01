import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  suggestions?: string[];
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search luxury products...",
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex: 1,
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '1rem'
        }}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#eee',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      )}
      <button
        type="submit"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;