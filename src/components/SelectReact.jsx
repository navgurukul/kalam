import React from "react";
import Select from "react-select";

const SelectReact = (props) => {
  const { value } = props;
  const [selectedOption, setSelectedOption] = React.useState({
    value,
    label: value,
  });
  const { options, onChange, filterList, index, column } = props;

  return (
    <Select
      value={selectedOption}
      onChange={(event) => {
        filterList[index] = [event.value];
        setSelectedOption(event);
        onChange(filterList[index], index, column);
      }}
      options={options}
      styles={{
        menuList: (base) => ({
          ...base,
          position: "fixed !important",
          backgroundColor: "white",
          border: "1px solid lightgray",
          width: "18%",
        }),
      }}
    />
  );
};

export default SelectReact;
