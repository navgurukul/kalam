import React, { useEffect, useMemo } from "react";
import TextField from "@mui/material/TextField";
import { debounce } from "lodash";

const SearchBar = (props) => {
  // const [name, setName] = React.useState("");

  const validInput = (value) => {
    if (value.match(/^[A-Za-z\s]+$/)) {
      return "letter";
    }
    if (value.match(/^[0-9]+$/)) {
      return "number";
    }
  };

  const onSearchText = (input) => {
    // setName(input);
    const { searchByName } = props;
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
      label="Search name or number"
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export default SearchBar;
