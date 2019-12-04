import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export class StageSelect extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      selectedOption: undefined
    }
  }

  handleChange = selectedValue => {
    // const { selectedOption } = this.state
    this.state.selectedOption = selectedValue;
    console.log("changing stage to ", selectedValue);
  }

  render = () => {
    const { selectedOption } = this.state;
    const { selectedValue, allStagesOptions } = this.props;

    return <Select
        className={"filterSelectStage"}
        defaultValue={selectedValue}
        value={selectedOption}
        onChange={this.handleChange}
        options={allStagesOptions}
        // placeholder={"Select "+this.props.filter.name+" ..."}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect={true}
    />
  }
}

export default StageSelect;