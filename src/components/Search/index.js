import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { TextField } from '@mui/material';

const SearchComponent = ({ fetchData, sx, label, value }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search term
  const debouncedSearch = useCallback(
    debounce((term) => {
      fetchData(term);
    }, 500),
    []
  );

  // Update search term and trigger debounced search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  useEffect(() => {
    if (value) {
      setSearchTerm(value);
    }
  }, [value]);

  return (
    <div>
      <TextField
        type="text"
        placeholder="Search..."
        label={label}
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        sx={sx}
      />
    </div>
  );
};

export default SearchComponent;
