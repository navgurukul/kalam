import React from "react";
import Select from "react-select";

export default class SelectReact extends React.Component {
  // state = {
  //   selectedOption: "All",
  // };

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: {
        value: "All",
        label: "All",
      },
    };

    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );
  };

  // handleChange(e) {
  //   console.log("Fruit Selected!!");
  //   this.setState({ selectedOption: e.target.value });
  //   console.log(e.target.value);
  // }

  render() {
    // const { selectedOption } = this.state;
    const { options, onChange, value, filterList, index, column } = this.props;
    console.log(options, onChange, value, filterList, index, column);
    // console.log(onChange);

    return (
      <Select
        // value={value}
        onChange={(event) => {
          console.log(event);
          console.log(filterList, "checking filter");
          filterList[index] = event.value;
          this.setState({ selectedOption: event });
          onChange(filterList[index], index, column);
        }}
        // onChange={this.handleChange}
        options={options}
        value={this.state.selectedOption}
        styles={{
          menuList: (base) => ({
            ...base,
            position: "fixed !important",
            backgroundColor: "white",
            border: "1px solid lightgray",
            width: "20rem",
          }),
        }}
      />
    );
  }
}
