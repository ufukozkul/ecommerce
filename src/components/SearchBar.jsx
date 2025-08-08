import React from "react";

const SearchBar = ({ query, onQueryChange, onSearch }) => (
  <div style={{ marginBottom: "1rem", textAlign: "center" }}>
    <input
      type="text"
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder="Search e.g. 'jewelery under 50'"
      style={{ padding: "8px", width: "60%", maxWidth: "400px" }}
    />
    <button onClick={onSearch} style={{ marginLeft: "10px", padding: "8px" }}>
      🔍 Smart Search
    </button>
  </div>
);

export default SearchBar;
