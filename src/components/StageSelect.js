import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
const baseUrl = process.env.API_URL;

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
    const {value} = this.state.selectedOption;
    axios.post(`${baseUrl}students/chnageStage/${this.props.studentId}`, { stage: value })
    .then(() => {
      alert("stage is successfully changed")
    })
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