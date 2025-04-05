import React from 'react';
import '../styles/SearchInput.css'; // Import the CSS

const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;
