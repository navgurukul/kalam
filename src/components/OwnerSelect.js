import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { connect } from 'react-redux';

import { withSnackbar } from 'notistack';
import { EventEmitter } from './events';
import { ro } from 'date-fns/locale';

const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

export class OwnerSelect extends React.Component {

  constructor (props) {
    super(props);
    const { rowMetaTable } = this.props;
    const { columnIndex, rowData } = rowMetaTable;
    this.columnIndex = columnIndex;
    this.whoAssign = rowData[8].email.split('@')[0];
    this.stage = rowData[0];
    this.studentId = rowData[5];
  }
  
  handleChange = selectedValue => {
    try{
      const { change } = this.props
      const { value } =  selectedValue;
      axios.post(`${baseUrl}students/assign_feedback_work`, { 
          whoAssign: this.whoAssign,
          toAssign: value,
          student_stage: this.stage,
          studentId: this.studentId
      })
      .then(() => {
        this.props.enqueueSnackbar(`successfully Assigned work for ${value}`,{ variant: 'success' });
        change(value, this.columnIndex)
      })
    } catch(e) {
      this.props.enqueueSnackbar(e, { variant: 'error' });
    }
  }

  render = () => {
    const { value } = this.props;
    const allUserOptions = this.props.users.map(x=> {return {label:x.user, value: x.user}})
    let selectedValue = { value: null, label: null }

    if (value) {
      selectedValue = { value: value, label: value }
    }
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

const mapStateToProps = (state) => ({
  users: state.auth.users,
});

export default withSnackbar(connect(mapStateToProps, undefined)(OwnerSelect))