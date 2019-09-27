import React from 'react';
import { forwardRef } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import axios, { post } from 'axios';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom';

const styles = theme => ({
  innerTable: {
    marginLeft: '3vw',
    marginRight: '3vw',
    width: '94vw',
    marginTop: '5',
    marginBottom: '5',
    [theme.breakpoints.up('md')]: {
      margin: 'auto',
      width: '50%',
      marginTop: 5,
      marginBottom: 5
    },
  },
  clear: {
    clear: 'both'
  }
})

export class CsvUpload extends React.Component {
  constructor(props) {
    super(props);    
    
    this.state = {
      data: [],
      file: ''
    }
    
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }

  onsubmit = () => {
    this.addAttempts();    
  };

  async addAttempts(){
    try{
      if (this.state.data[0]){
        console.log(this.state.data)
        const url = "http://localhost:3000/partners/" + this.props.partnerId + "/assessments/" + this.props.assessmentId + "/attempts"
        const response = await axios.post(url, {
          "csvUrl": this.state.data[0].fileUrl
        });
        if(!response.data.sucess){
          alert("In your csv file something is wrong in a student details or answers option is not correct.")
        }else{
          alert('You have succssesfully uploaded students')
        }
      }      
    }catch(e){
      console.log(e)
    }
  }
  
  async onFormSubmit(e){
    e.preventDefault() // Stop form submit

    this.fileUpload(this.state.file).then((response)=>{
        try{
            this.setState({data: [response.data]})
        }catch (e) {
            console.log(e);
        }
    })
  }

  async onChange(e) {
    this.setState({file: e.target.files[0]})
  }
  
  async fileUpload(file){
    const url = 'http://localhost:3000/general/upload_file/answerCSV';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  await post(url, formData,config)
  }

  render = () => {
    return <div>
        <form onSubmit={this.onFormSubmit} style={{padding:"10px"}}>
            <h3>File Upload</h3>
            <input type="file" onChange={this.onChange} style={{color: 'green'}} />
            <Button variant="contained" color="primary" 
              type="submit" onClick={this.onsubmit()} style={{top: "5px"}}> Upload </Button>
        </form>
    </div>
  }

};

export default withRouter(withStyles(styles)(CsvUpload))