import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import MaterialTable from "material-table";
import DetailsIcon from '@material-ui/icons/Details';

import StudentService from '../services/StudentService';
import GlobalService from '../services/GlobalService';

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

export class StudentDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      modalOpen : false,
    }
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  };

  handleOpen = () => {
    this.setState({
      modalOpen: true
    })
  };
  
  render = () => {

    const modalStyle = getModalStyle()
    const { classes, details } = this.props
    return <div>
      <Button color="primary" align="right" onClick={this.handleOpen}>
        <DetailsIcon />
      </Button>
      <Modal
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <div style={modalStyle} className={classes.paper}>

          <Typography variant="h5" id="modal-title">
            Student Details<br/>
          </Typography>

          <MaterialTable
            columns={StudentService.columnStudentDetails}
            data={details}
            icons={GlobalService.tableIcons}
            options={{
              filtering: true,
              exportButton: true,
              pageSize: 10,
              showTitle: false,
              toolbar: false,
            }}
            style={{maxWidth: '90%', margin: '0 auto', marginTop: 25}}
          />
        </div>
      </Modal>
    </div>
  }
}

export default withStyles(useStyles)(StudentDetails)