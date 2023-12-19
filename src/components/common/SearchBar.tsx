import React, { useState } from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    // Call onSearch prop with the current search query
    onSearch(newQuery);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Trigger search when the Enter key is pressed
    if (event.key === "Enter") {
      onSearch(searchQuery);
    }
  };

  return (
    <Box  width={'70%'}>
    <TextField
      label={location.pathname=== '/user/view-hotels'? "Search hotels/location" : location.pathname=== '/user/view-rooms'?'Search room types':'Search'}
      variant="outlined"
      size="small"
      sx={{
        width:location.pathname=== '/user/view-hotels' ? '50%' :location.pathname=== '/user/view-rooms'? '200px':'60%',
        mt: 2,
      }}
      value={searchQuery}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search/>
          </InputAdornment>
        ),
      }}
    />
    </Box>
  );
};

export default SearchBar;
