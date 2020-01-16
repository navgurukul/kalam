import 'date-fns';
import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Modal, Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MUIDataTable from "mui-datatables";
import Moment from 'react-moment';
import Typography from '@material-ui/core/Typography';
import { theme } from '../theme/theme';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import GlobalService from '../services/GlobalService';
import DetailsIcon from '@material-ui/icons/Details';
// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/

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

export class StageTransitionsStudentStatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      modalOpen: false,
    }
    const { allStages } = this.props;
    this.column = [
        {
          label: "Stage",
          name: "toStage",
          options:{
            customBodyRender: (value) => {
              return allStages[value]
            }
          }
        },
        {
          label: 'When?',
          name: 'createdAt',
          options: {
            customBodyRender: (value) => {
              return <Moment format="D MMM YYYY" withTitle>{value}</Moment>
            }
          }
        }
    ]
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        stackedCommon: {
          height: 'auto !important',
          // width: 'calc(50% - 80px) !important'
        }
      },    
    }
  })
  
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
    const { classes, rowData } = this.props;
    const modalStyle = getModalStyle()
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
          <Typography variant="h5" id="modal-title">Transitions</Typography><br/>
          <MUIDataTable
            columns={this.column}
            data={rowData}
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

export default withStyles(styles)(StageTransitionsStudentStatus)