import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import { EventEmitter } from './events';

const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

export class StatusSelect extends React.Component {
  
  handleChange = selectedValue => {
    try{
      const { change, rowMetaTable } = this.props;
      const studentId = rowMetaTable.rowData[5];
      const columnIndex = rowMetaTable.columnIndex;
      const stage = rowMetaTable.rowData[0];
      const { value } = selectedValue;
      const dataURL = baseUrl+'students/feedback/'+studentId;
      axios.put(dataURL, { student_stage: stage, state: value })
      .then(() => {
        this.props.enqueueSnackbar('state is successfully changed!',{ variant: 'success' });
        change(value, columnIndex)
      }).catch(() => {
        this.props.enqueueSnackbar('Please fill feedback first and try again!',{ variant: 'error' });
      })
    }catch (e) {
      this.props.enqueueSnackbar(e, { variant: 'error' });
    }
  }

  render = () => {
    const { state, feedbackableStagesData, rowMetaTable} = this.props;
    const stage = rowMetaTable.rowData[0];

    const allstatus = feedbackableStagesData[stage].status;
    const allStatusOptions = allstatus.map(x => { return { value: x, label: (x.charAt(0).toUpperCase() + x.slice(1)).match(/[A-Z][a-z]+/g).join(" ") } })
    
    let selectedValue = { value: null, label: null }
    if (state) {
      const lable = (state.charAt(0).toUpperCase() + state.slice(1)).match(/[A-Z][a-z]+|[0-9]+/g).join(" ")
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