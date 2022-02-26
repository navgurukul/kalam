import React, { useRef, useEffect } from 'react';

import { withStyles } from '@material-ui/core/styles';
import axios, { post } from 'axios';
import {withRouter} from 'react-router-dom';
import ReactJson from 'react-json-view'
import { Modal, Box } from '@material-ui/core';
import Spinner from 'react-spinner-material';
import { withSnackbar } from 'notistack';

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
      modalOpen : false,
      errors: '',
      file: '',
      loading: false
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  
  async addAttempts(fileUrl){
    try{
      if (fileUrl){
        const url = baseUrl+"partners/"+this.props.partnerId+"/assessments/"+this.props.assessmentId+"/attempts"
        const response = await axios.post(url, {
          "csvUrl": fileUrl
        });
        if (response.data.errors != undefined){
          this.setState({
            errors: response.data,
            loading: false
          });
          this.props.enqueueSnackbar('successfully uploaded csv file!',{ variant: 'success' });
        } else {
          this.setState({
            errors: "sucess",
            loading:false
          });
        }
      }      
    }catch (e) {
      this.props.enqueueSnackbar('Internal Server Error', { variant: 'error' });
      console.error(e)
    }
  }

  errorHandler = () => {
    if (typeof(this.state.errors) == 'object') {
      return <div>
          <h3 style={{color: 'green',textAlign: 'center'}}>Please coreect your csv file according to the detailsErrors and answerErrors using following  instructions.</h3>
          <ReactJson src={this.state.errors}/>
        </div>
    }else if (this.state.errors == "sucess"){
      return this.props.enqueueSnackbar('successfully uploaded csv file!',{ variant: 'success' });

    }
  }

  async onFormSubmit(e){
    e.preventDefault() // Stop form submit

    this.fileUpload(this.state.file).then((response)=>{
        try{
            if (response.data.errors == undefined){
              this.addAttempts(response.data.fileUrl)
            }else{
              alert("It is enternal server error please refresh the page.")
            }
        }catch (e) {
            console.error(e);
        }
    })
  }

  async onChange(e) {
    await this.setState({file: e.target.files[0], loading: true})
    await this.onFormSubmit(e)
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
    const { loading } = this.state
    return <div>
        <form style={{padding:"10px"}}>
          <h3>File Upload</h3>
          <input type="file"  accept=".csv" onChange={this.onChange} style={{color: 'green'}} />
          <Spinner size={35} spinnerColor={"#ed343d"} spinnerWidth={5} visible={loading} style={{padding: '10px'}} />
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
}

export default withSnackbar(withRouter(withStyles(styles)(CsvUpload)));