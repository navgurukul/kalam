import React from 'react';
import axios from 'axios';
import AddBox from '@material-ui/icons/AddBox';
import {Box} from '@material-ui/core';

export class CreateAssessment extends React.Component {

  constructor(props) {
    super(props);
    this.dataURL = 'http://localhost:3000/partners/'+this.props.partnerId+'/assessments';
    this.partnerName = this.props.partnerName;
  }

  createAssessment2 = () => {
    this.createAssessment();
  }

  async createAssessment() {   
    try {
      const response = await axios.post(this.dataURL, {
        "name": this.partnerName
      });
      alert("Assessment Created", response);
    } catch (e) {
      alert(e);
    }
  }

  render = () => {
    return <Box onClick={this.createAssessment2}>
      <AddBox/>
    </Box>
  }
}

export default CreateAssessment;