import React, { useEffect, useMemo } from "react";
import TextField from "@mui/material/TextField";
import { debounce } from "lodash";

const SearchBar = ({ searchByName }) => {
  const validInput = (value) => {
    if (value.match(/^[A-Za-z\s]+$/)) {
      return "letter";
    }
    if (value.match(/^[0-9]+$/)) {
      return "number";
    }
  };

  const onSearchText = (input) => {
    const isValidInput = validInput(input);
    if (input.length >= 2 && isValidInput === "letter") {
      return searchByName("name", input);
    }
    if (input.length >= 5 && isValidInput === "number") {
      return searchByName("number", input);
    }
    if (input.length === 0) {
      searchByName("name", "");
      return searchByName("number", "");
    }
  };

  const onChange = useMemo(() => debounce(onSearchText, 600), []);

  useEffect(() => () => {
    onChange.cancel();
  });

  return (
    <TextField
      sx={{ my: "0.4rem" }}
      size="small"
      error={false}
      id="standard-basic"
      label="Search Name or Number"
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export default SearchBar;
