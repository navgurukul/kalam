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
    const { rowMetaTable } = this.props;
    this.studentId = rowMetaTable.rowData[5];
    this.columnIndex = rowMetaTable.columnIndex;
    this.stage = rowMetaTable.rowData[0];
    this.dataURL = baseUrl+'students/feedback/'+this.studentId;
  }
  
  handleChange = selectedValue => {
    try{
      const { change } = this.props;
      const { value } = selectedValue;
      axios.put(this.dataURL, { student_stage: this.stage, state: value })
      .then(() => {
        this.props.enqueueSnackbar('state is successfully changed!',{ variant: 'success' });
        change(value, this.columnIndex)
      });
    }catch (e) {
      this.props.enqueueSnackbar(e, { variant: 'error' });
    }
  }

  render = () => {
    const { state, feedbackableStagesData } = this.props;
    
    const allstatus = feedbackableStagesData[this.stage].status;
    const allStatusOptions = allstatus.map(x => { return { value: x, label: (x.charAt(0).toUpperCase() + x.slice(1)).match(/[A-Z][a-z]+/g).join(" ") } })
    
    let selectedValue = { value: null, label: null }
    if (state) {
      const lable = (state.charAt(0).toUpperCase() + state.slice(1)).match(/[A-Z][a-z]+|[0-9]+/g).join("")
      selectedValue.value = state;
      selectedValue.label = lable;
    }
    
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