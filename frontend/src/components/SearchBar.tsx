import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchTerm) return;
    // console.log("Searching for: ", searchTerm);
    navigate(`/search/${searchTerm}`);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", alignItems: "center" }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mr: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="inherit"
        sx={{ p: "10px" }}
      >
        <SearchIcon />
      </Button>
    </Box>
  );
};

export default SearchBar;
