import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { connect } from 'react-redux';

import { withSnackbar } from 'notistack';

const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

export class OwnerSelect extends React.Component {
  
  handleChange = selectedValue => {
    try{
      const { change, rowMetaTable } = this.props
      const { value } =  selectedValue;
      const { columnIndex, rowData } = rowMetaTable;
      const whoAssign = rowData[8].email.split('@')[0];
      const stage = rowData[0];
      const studentId = rowData[5];
      axios.post(`${baseUrl}students/assign_feedback_work`, { 
          who_assign: whoAssign,
          to_assign: value,
          student_stage: stage,
          student_id: studentId
      })
      .then(() => {
        this.props.enqueueSnackbar(`successfully Assigned work for ${value}`,{ variant: 'success' });
        change(value, columnIndex)
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