import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import MUIDataTable from "mui-datatables";
import axios from 'axios';
import { withSnackbar } from 'notistack';
import {withRouter} from 'react-router-dom';
import GlobalService from '../services/GlobalService';
import StudentService from '../services/StudentService';
const baseUrl = process.env.API_URL;

function getModalStyle() {
  const top = 54 // + rand()
  const left = 50 //+ rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflowY: 'scroll',
    maxHeight: '80vh',
    width: "75%"
  };
}

const useStyles = theme => ({
  paper: {
    position: 'absolute',
    marginLeft: '3vw',
    marginRight: '3vw',
    width: '94vw',
    [theme.breakpoints.up('md')]: {
      margin: 'auto',
      width: '50%'
    },
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
})

export class StudentStatus extends React.Component {

  constructor(props) {
    super(props)
    this.dataURL =  baseUrl+ `students/status/${this.props.mobile}`
    this.state = {
      modalOpen : false,
      data: [],
    }
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  };

  handleOpen = () => {
    this.fetchStudentStatus()
  };

  async fetchStudentStatus() {
    try {
      const response = await axios.get(this.dataURL);
      this.setState({data: response.data.data, modalOpen: true })
    } catch (e) {
      this.handleClose();
      this.props.enqueueSnackbar('Please Enter Registered Mobile Number!', {
        variant: 'error', anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        }
      });
      console.log(e);
    }  
  }

  render = () => {

    const modalStyle = getModalStyle()
    const { classes, lang } = this.props

    return <div>
      <Button variant="outlined" onClick={this.handleOpen} color="primary">
          {lang}
      </Button>
      <Modal
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <div style={modalStyle} className={classes.paper}>

          <Typography variant="h5" id="modal-title">
            Student Status<br/>
          </Typography>

          <MUIDataTable
            columns={StudentService.columns['columnStudentStatus']}
            data={this.state.data}
            icons={GlobalService.tableIcons}
            options={{
              exportButton: true,
              pageSize: 100,
              showTitle: false,
              selectableRows: 'none',
              toolbar: false,
              filtering: true,
              filter: true,
              filterType: 'doprdown',
              responsive: 'stacked',
            }}
            style={{maxWidth: '90%', margin: '0 auto', marginTop: 25}}
          />
        </div>
      </Modal>
    </div>
  }
}

export default withSnackbar(withRouter(withStyles(useStyles)(StudentStatus)))