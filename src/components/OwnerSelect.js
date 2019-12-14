import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { connect } from 'react-redux';

import { withSnackbar } from 'notistack';
import { EventEmitter } from './events';

const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

export class OwnerSelect extends React.Component {

  constructor (props) {
    super(props);
  }
  
  handleChange = selectedValue => {
    try{
      const { rowData } = this.props
      const { label } =  selectedValue;
      axios.post(`${baseUrl}students/assign_feedback_work`, { 
          whoAssign: rowData.loggedInUser.email.split('@')[0],
          toAssign: label,
          student_stage: rowData.toStage,
          studentId: rowData.studentId
      })
      .then(() => {
        this.props.enqueueSnackbar(`successfully Assigned work for ${label}`,{ variant: 'success' });
        EventEmitter.dispatch("transitionsChange"+this.props.rowData.studentId, {rowData:rowData});
      })
    } catch(e) {
      this.props.enqueueSnackbar(e, { variant: 'error' });
    }
  }

  render = () => {
    const { rowData } = this.props;
    const allUserOptions = this.props.users.map(x=> {return {label:x.user, value: x.id}})
    let selectedValue = { value: null, label: null };
    
    if (rowData['feedback']) {
      selectedValue = { value: rowData['feedback']['toAssign'], label: rowData['feedback']['toAssign'] };
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