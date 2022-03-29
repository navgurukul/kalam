import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const FilterSelect = (props) => {
  // <FilterSelect filter={filters[0]} options={this.state.selectedCities} handleChange={this.handleChange}/>
  const [selectedValues, setSelectedValues] = React.useState(undefined);

  const getFilter = (x) => {
    if (!selectedValues)
      //no values mean - this filter isn't a barrier - it is filtering in - hence true
      return true;

    if ("value" in selectedValues) {
      return (
        selectedValues.value.toLowerCase() ==
        x[props.filter.field].toLowerCase()
      );
    } else {
      // selectedValues is now an array
      if (!selectedValues.length) {
        //no values mean - this filter isn't a barrier - it is filtering in - hence true
        return true;
      }
      // check if koi bhi m.value (kisi bhi option ki value) aur x.field same hai kya
      return selectedValues.filter((m) => {
        if (x[props.filter.field]) {
          return m.value.toLowerCase() == x[props.filter.field].toLowerCase();
        } else return false;
      }).length;
    }
  };

  const handleChange = (selectedVals) => {
    setSelectedValues(selectedVals);
    props.handleChange(props.filter.field, getFilter);
  };

  return (
    <Select
      className={"filterSelect"}
      // className={props.filter.field+"Select"}
      value={selectedValues}
      isMulti={props.ifMulti}
      onChange={handleChange}
      options={props.options}
      placeholder={"Select " + props.filter.name + " ..."}
      isClearable={true}
      components={animatedComponents}
      closeMenuOnSelect={true}
    />
  );
};

export default FilterSelect;
