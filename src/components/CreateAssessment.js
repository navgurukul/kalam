import React from 'react';
import axios from 'axios';
import AddBox from '@material-ui/icons/AddBox';
import {Box} from '@material-ui/core';
import BaseUrl from '../config/config.json'

const DEBUG = false; // If you woek on localhost then change DEBUGing mode as true 
let baseUrl = "";

if (DEBUG){
  baseUrl = BaseUrl.development;
}else{
  baseUrl = BaseUrl.production;
}

export class CreateAssessment extends React.Component {

  constructor(props) {
    super(props);
    this.dataURL = baseUrl + 'partners/'+this.props.partnerId+'/assessments';
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