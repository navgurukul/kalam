import React, { useRef, useEffect } from 'react';
import { forwardRef } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import axios, { post } from 'axios';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom';
import ReactJson from 'react-json-view'
import { Modal, Box } from '@material-ui/core';
import BaseUrl from '../config/config.json'

const DEBUG = false; // If you woek on localhost then change DEBUGing mode as true 
let baseUrl = "";

if (DEBUG){
  baseUrl = BaseUrl.development;
}else{
  baseUrl = BaseUrl.production;
}

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
});

function getModalStyle() {
  // const top = 50 // + rand()
  // const left = 50 //+ rand()
  return {
    // top: `${top}%`,
    // left: `${left}%`,
    backgroundColor: "white",
    border: '2px solid #000',
    padding: "10px",
    marginLeft: '3vw', 
    marginRight: '3vw',
    marginTop: '3vw',
    width: '85vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
}

export class CsvUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      file: '',
      modalOpen : false,
      errors: ''
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
        const url = baseUrl+"partners/"+this.props.partnerId+"/assessments/"+this.props.assessmentId+"/attempts"
        const response = await axios.post(url, {
          "csvUrl": this.state.data[0].fileUrl
        });
        if(response.data.errors != undefined){
          this.setState({
            modalOpen:true,
            errors: response.data
          })
        }else{
          this.setState({
            modalOpen:true,
            errors: "sucess"
          })
        }
      }      
    }catch(e){
      console.log(e)
    }
  }

  errorHandler = () => {
    if (typeof(this.state.errors) == 'object') {
      return <div>
          <h3 style={{color: 'green'}}>Please coreect your csv file according to the detailsErrors and answerErrors using following  instructions.</h3>
          <ReactJson src={this.state.errors}/>
        </div>
    }else if (this.state.errors == "sucess"){
      return <div>
          <h1 style={{ alignItems: "center"}}>You have succssesfully uploaded students details!</h1>
        </div>
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
    const url = baseUrl+'general/upload_file/answerCSV';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  await post(url, formData,config)
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  };

  render = () => {
    const modalStyle = getModalStyle()
    const { classes } = this.props
    return <div>
        <form onSubmit={this.onFormSubmit} style={{padding:"10px"}}>
          <h3>File Upload</h3>
          <input type="file" onChange={this.onChange} style={{color: 'green'}} />
          <Button variant="contained" color="primary" 
            type="submit" onClick={ () => this.onsubmit()} style={{top: "5px"}}> Upload </Button>
        </form>
        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          >
          <div style={modalStyle} className={classes.errors}>
              { this.errorHandler() }
          </div>
        </Modal>
      </div>
  }
};

export default withRouter(withStyles(styles)(CsvUpload))