import React from "react";
import Select from "react-select";

export default class SelectReact extends React.Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      selectedOption: {
        value: value,
        label: value,
      },
    };
  }
  render() {
    const { options, onChange, filterList, index, column } = this.props;
    const { selectedOption } = this.state;
    return (
      <Select
        value={selectedOption}
        onChange={(event) => {
          filterList[index] = event.value;
          this.setState({ selectedOption: event });
          onChange(filterList[index], index, column);
        }}
        options={options}
        value={this.state.selectedOption}
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
  }
}
