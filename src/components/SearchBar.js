import React, { useEffect, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import { debounce } from "lodash";

const SearchBar = (props) => {
  // const [name, setName] = React.useState("");

  const validInput = (value) => {
    if (value.match(/^[A-Za-z\s]+$/)) {
      return "letter";
    } else if (value.match(/^[0-9]+$/)) {
      return "number";
    }
  };

  const onSearchText = (input) => {
    // setName(input);
    let isValidInput = validInput(input);
    if (input.length >= 2 && isValidInput === "letter") {
      return props.searchByName("name", input);
    } else if (input.length >= 5 && isValidInput === "number") {
      return props.searchByName("number", input);
    } else if (input.length === 0) {
      props.searchByName("name", "");
      return props.searchByName("number", "");
    }
  };

  const onChange = useMemo(() => {
    return debounce(onSearchText, 600);
  }, []);

  useEffect(() => {
    return () => {
      onChange.cancel();
    };
  });

  return (
    <TextField
      error={false}
      id="standard-basic"
      label="Search name or number"
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export default SearchBar;
