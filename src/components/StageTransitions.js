import 'date-fns';
import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Modal, Button } from '@material-ui/core';

import { connect } from 'react-redux';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import MUIDataTable from "mui-datatables";
import { theme } from '../theme/theme';
import { changeFetching } from '../store/actions/auth';
import { withRouter } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import GlobalService from '../services/GlobalService';
import StudentService from '../services/StudentService';
import DetailsIcon from '@material-ui/icons/Details';
// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

function getModalStyle() {
  const top = 50 // + rand()
  const left = 50 //+ rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflowY: 'scroll',
    maxHeight: '90vh',
    width: "90%"
  };
}

const styles = theme => ({
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
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        minHeight: '22px' 
      }
    }
  }
})

export class Transition extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      modalOpen: false,
    }
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "#FF0000",
        }
      },    
    }
  })

  transitionsChangeEvent = () => {
    this.fetchtransition();
  }

  async fetchtransition() {
    try {
      this.transitionURL = `${baseURL}students/transitionsWithFeedback/${this.props.studentId}`;
      this.props.fetchingStart()
      const response = await axios.get(this.transitionURL, {});
      const newData = response.data.data.map(v => ({ ...v, loggedInUser: this.props.loggedInUser }))
      this.setState({
        data: newData
      }, this.props.fetchingFinish)
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  };

  handleOpen = () => {
    this.fetchtransition();
    this.setState({
      modalOpen: true
    })
  };


  render = () => {
    const { classes } = this.props;
    const modalStyle = getModalStyle()
    console.log(this.state.data)
    return !this.state.modalOpen ? <div>
      <Button color="primary" align="right" onClick={this.handleOpen}>
        <DetailsIcon color="primary" />&nbsp;&nbsp;
    </Button>
    </div> :
      <Modal
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Box style={modalStyle} className={classes.paper}>
          <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            columns={StudentService.columns[this.props.dataType]}
            data={this.state.data}
            icons={GlobalService.tableIcons}
            options={{
              headerStyle: {
                color: theme.palette.primary.main
              },
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

          />
          </MuiThemeProvider>
        </Box>
      </Modal>
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Transition)))