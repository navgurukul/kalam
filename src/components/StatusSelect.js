import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import { EventEmitter } from './events';

const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

export class StatusSelect extends React.Component {

  constructor (props) {
    super(props);
    this.dataURL = baseUrl+'students/feedback/'+this.props.studentId;
  }
  
  handleChange = selectedValue => {
    // const { selectedOption } = this.state
    const stage = this.props.rowData['toStage']
    console.log(this.props.studentId)
    try{
      const { rowData } = this.props;
      const { value } = selectedValue;
      axios.put(this.dataURL, { student_stage: stage, state: value })
      .then(() => {
        this.props.enqueueSnackbar('state is successfully changed!',{ variant: 'success' });
        EventEmitter.dispatch("transitionsChange", {rowData: rowData});
      });
      EventEmitter.dispatch("transitionsChange", {rowData: rowData});
    }catch (e) {
      this.props.enqueueSnackbar(e, { variant: 'error' });
    }
  }

  render = () => {
    const { allStatusOptions, rowData } = this.props;
    const selectedValue = { value: rowData['feedback']['state'], label: rowData.statusTitle }
    return <Select
        className={"filterSelectStage"}
        // defaultValue={selectedValue}
        value={selectedValue}
        onChange={this.handleChange}
        options={allStatusOptions}
        // placeholder={"Select "+this.props.filter.name+" ..."}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect={true}
    />
  }
}

export default withSnackbar(StatusSelect);