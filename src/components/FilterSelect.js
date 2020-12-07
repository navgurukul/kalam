import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export class FilterSelect extends React.Component {
  // <FilterSelect filter={filters[0]} options={this.state.selectedCities} handleChange={this.handleChange}/>
  constructor(props) {
    super(props);
    this.state = {
      selectedValues: undefined,
    };
  }

  getFilter = (x) => {
    const { selectedValues } = this.state;

    if (!selectedValues) {
      //no values mean - this filter isn't a barrier - it is filtering in - hence true
      return true;
    }

    if ("value" in selectedValues) {
      return (
        selectedValues.value.toLowerCase() ==
        x[this.props.filter.field].toLowerCase()
      );
    } else {
      // selectedValues is now an array

      if (!selectedValues.length) {
        //no values mean - this filter isn't a barrier - it is filtering in - hence true
        return true;
      }

      // check if koi bhi m.value (kisi bhi option ki value) aur x.field same hai kya
      return selectedValues.filter((m) => {
        if (x[this.props.filter.field]) {
          return (
            m.value.toLowerCase() == x[this.props.filter.field].toLowerCase()
          );
        } else {
          return false;
        }
      }).length;
    }
  };

  handleChange = (selectedVals) => {
    const { selectedValues } = this.state;
    this.state.selectedValues = selectedVals;
    this.props.handleChange(this.props.filter.field, this.getFilter);
  };

  render = () => {
    const { selectedValues } = this.state;

    return (
      <Select
        className={"filterSelect"}
        // className={this.props.filter.field+"Select"}
        value={selectedValues}
        isMulti={this.props.ifMulti}
        onChange={this.handleChange}
        options={this.props.options}
        placeholder={"Select " + this.props.filter.name + " ..."}
        isClearable={true}
        components={animatedComponents}
        closeMenuOnSelect={true}
      />
    );
  };
}

export default FilterSelect;
