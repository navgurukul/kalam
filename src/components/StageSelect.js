import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import { EventEmitter } from './events';

const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

export class StageSelect extends React.Component {

  constructor (props) {
    super(props);
    const { rowData } = props;
  }
  
  handleChange = selectedValue => {
    try{
      const { rowMetatable, change } = this.props;
      const studentId = rowMetatable.rowData[0];
      const columnIndex = rowMetatable.columnIndex;
      const { value } = selectedValue;
      axios.post(`${baseUrl}students/chnageStage/${studentId}`, { stage: value })
      .then(() => {
        this.props.enqueueSnackbar('stage is successfully changed!',{ variant: 'success' });
        change(value, columnIndex)
      });
    }catch (e) {
      this.props.enqueueSnackbar(e, { variant: 'error' });
    }
  }

  render = () => {
    const { allStagesOptions, allStages, stage } = this.props;
    const selectedValue = { value: stage, label: allStages[stage]}
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