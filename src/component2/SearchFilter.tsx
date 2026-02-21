// components/SearchFilter.tsx
import React, { useState, useEffect } from 'react';

interface SearchFilterProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, placeholder = 'جستجو...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Trigger search when debounced term changes
  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  return (
    <div className="search-filter">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="filter-input"
      />
      <span className="filter-icon">🔍</span>
    </div>
  );
};

export default SearchFilter;