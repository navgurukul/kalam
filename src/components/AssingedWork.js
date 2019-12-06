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
    const { value } = this.state.selectedOption;
    axios.post(`${baseUrl}students/assinge_feedback_work/${this.props.studentId}`, { 
        howAssinge: rowData['loggedInUser'].user_name,
        toAssinge: value,
     })
    .then(() => {
      this.props.enqueueSnackbar(`successfully Assinged work for ${value}`,{ variant: 'success' });
      EventEmitter.dispatch("stageChange", {selectedValue: selectedValue, rowData: rowData});
    })
    // this.state.selectedOption = selectedValue;
    EventEmitter.dispatch("stageChange", {selectedValue: selectedValue, rowData: rowData});
  }

  render = () => {
    const { allUserOptions, rowData } = this.props;
    const selectedValue = { value: rowData['loggedInUser'].user_name, label: rowData['loggedInUser'].user_name }

    return <Select
        className={"filterSelectStage"}
        // defaultValue={selectedValue}
        value={selectedValue}
        onChange={this.handleChange}
        options={allUserOptions}
        // placeholder={"Select "+this.props.filter.name+" ..."}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect={true}
    />
  }
}

export default withSnackbar(StageSelect);