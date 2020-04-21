import React from 'react';

import axios, { post } from 'axios';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import { withSnackbar } from 'notistack';

const baseUrl = process.env.API_URL;

export class AudiofileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen : false,
      file: '',
      loading: false,
      audioUrl: ''
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  
  async addAudioUrl(fileUrl){
    const {studentId, userId, student_stage, change, columnIndex} = this.props;
    try{
      if (fileUrl){
        const url = baseUrl+"students/"+"audioRecording/"+studentId+"/"+userId
        const response = await axios.post(url, {
          "audioUrl": fileUrl,
          "student_stage": student_stage
        });
        if (response.data.sucess){
          this.setState({
            loading: false
          });
          this.props.enqueueSnackbar('successfully uploaded audio file!',{ variant: 'success' });
          change(fileUrl, columnIndex)
        } else {
          this.setState({
            loading:false
          });
          this.props.enqueueSnackbar('Something is went wrong!',{ variant: 'error' });
        }
      }      
    }catch (e) {
      this.props.enqueueSnackbar('Internal Server Error', { variant: 'error' });
      console.log(e)
    }
  }

  async onFormSubmit(e){
    e.preventDefault() // Stop form submit

    this.fileUpload(this.state.file).then((response)=>{
        try{
            if (response.data.errors == undefined){
              this.addAudioUrl(response.data.fileUrl)
            }else{
              alert("It is enternal server error please refresh the page.")
            }
        }catch (e) {
            console.log(e);
        }
    })
  }

  async onChange(e) {
    await this.setState({file: e.target.files[0], loading: true})
    await this.onFormSubmit(e)
  }
  
  async fileUpload(file){
    const url = baseUrl+'general/upload_file/audioRecording';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  await post(url, formData, config)
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  };

  render = () => {
    const { loading } = this.state
    return <div>
        <form style={{padding:"10px", width: 300, marginTop: -35}}>
          <h3>Upload audio file</h3>
          <input type="file"  accept=".mp3,.aac,audio/*" onChange={this.onChange} style={{color: 'green'}} />
          <Spinner size={35} spinnerColor={"#ed343d"} spinnerWidth={5} visible={loading} style={{padding: '10px'}} />
        </form>
      </div>
  }
}

export default withSnackbar(withRouter(AudiofileUpload));