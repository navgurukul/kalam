import React, { useRef, useEffect } from 'react';
import { forwardRef } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import axios, { post } from 'axios';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom';
import ReactJson from 'react-json-view'
import { Modal, Box } from '@material-ui/core';

const baseUrl = process.env.API_URL;
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
  return {
    marginLeft: 'auto', 
    marginRight: 'auto',
    maxWidth: '85vh',
    backgroundColor: 'white',
    border: '2px solid rgb(0, 0, 0)',
    marginTop: '4vw',
    overflow: 'auto',
    maxHeight: '92vh',
    padding: '20px'
  
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
          <h3 style={{color: 'green',textAlign: 'center'}}>Please coreect your csv file according to the detailsErrors and answerErrors using following  instructions.</h3>
          <ReactJson src={this.state.errors}/>
        </div>
    }else if (this.state.errors == "sucess"){
      return <div>
          <h1 style={{textAlign: 'center', color:'green'}}>You have successfully uploaded students details!</h1>
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