import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { withSnackbar } from 'notistack';

const baseUrl = process.env.API_URL;
import { EventEmitter } from './events';
const animatedComponents = makeAnimated();

export class StageSelect extends React.Component {

  constructor (props) {
    super(props);
    const { rowData } = props;
    this.state = {
      selectedOption: undefined,
    }
  }
  
  handleChange = selectedValue => {
    // const { selectedOption } = this.state
    const { rowData } = this.props
    this.state.selectedOption = selectedValue;
    const {value} = this.state.selectedOption;
    axios.post(`${baseUrl}students/chnageStage/${this.props.studentId}`, { stage: value })
    .then(() => {
      this.props.enqueueSnackbar('stage is successfully changed!',{ variant: 'success' });
      EventEmitter.dispatch("stageChange", {selectedValue: selectedValue, rowData: rowData});
    })
    // this.state.selectedOption = selectedValue;
    EventEmitter.dispatch("stageChange", {selectedValue: selectedValue, rowData: rowData});
  }

  render = () => {
    const { allStagesOptions, rowData } = this.props;
    const selectedValue = { value: rowData.stage, label: rowData.stageTitle }
    return <Select
        className={"filterSelectStage"}
        // defaultValue={selectedValue}
        value={selectedValue}
        onChange={this.handleChange}
        options={allStagesOptions}
        // placeholder={"Select "+this.props.filter.name+" ..."}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect={true}
    />
  }
}

export default withSnackbar(StageSelect);