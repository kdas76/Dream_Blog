import React, { useState } from "react";

export default function SearchBar({ setQuery }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(input);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search photos like 'nature', 'city', 'ocean'..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
