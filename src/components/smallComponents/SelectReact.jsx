import React from "react";
import Select from "react-select";

const SelectReact = ({
  value,
  options,
  onChange,
  filterList,
  index,
  column,
}) => {
  const [selectedOption, setSelectedOption] = React.useState({
    value,
    label: value,
  });

  return (
    <Select
      value={selectedOption}
      onChange={(event) => {
        const newFilterList = [...filterList];
        newFilterList[index] = [event.value];
        setSelectedOption(event);
        onChange(newFilterList[index], index, column);
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
