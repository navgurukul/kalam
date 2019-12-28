import React from 'react';
import { forwardRef } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import AssessmentIcon from '@material-ui/icons/Assessment';
import MaterialTable from "material-table";
import axios from 'axios';
import { Link } from 'react-router-dom';
import {withRouter} from 'react-router-dom';

import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import CsvUpload from './Uploadcsv';

const baseUrl = process.env.API_URL;
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight color="primary" {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

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

export class ModalStages extends React.Component {

  constructor(props) {
    super(props)
    this.dataURL =  baseUrl+'partners/'+this.props.partnerId+'/assessments'

    this.state = {
      modalOpen : false,
      data: [],
      partnerId: null,
    }

    this.columns = [
      {
        title: 'ID',
        field: 'id',
      },
      {
        title: 'Name',
        field: 'name',
      },
      {
        title: 'Assessment URL',
        field: 'assessmentUrl',
        render: rowData => {
          if (rowData.assessmentUrl) {
            return <a target="_blank" href={rowData.assessmentUrl}>Link to Assessment</a>
          } else {
            return ""
          }
         }
      },
      {
        title: 'Answer Key URL',
        field: 'answerKeyUrl',
        render: rowData => {
          if (rowData.answerKeyUrl) {
            return <a target="_blank" href={rowData.answerKeyUrl}>Link to Answer Key</a>
          } else {
            return ""
          }
        }
      },
      {
        title: 'Question Set ID',
        field: 'questionSetId',
        render: rowData => {
          if (rowData.questionSetId) {
            const url = "/partners/"+this.props.partnerId+"/assessments/"+rowData.questionSetId;
            return <Link to={url}>{rowData.questionSetId}</Link>  
          } else {
            return ""
          }
        }
      },
      {
        title: 'Created At',
        field: 'createdAt',
      },
      {
        title: 'Upload Data',
        field: 'uploadData',
        filtering: true,
        render: rowData => {
          return <CsvUpload partnerId= {rowData.partnerId} assessmentId = {rowData.id}/>
        }
      }
    ]
    
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  };

  handleOpen = () => {
    this.fetchAssessments()
    this.setState({
      modalOpen: true
    })
    // this.props.modalOpen = true
  };

  async fetchAssessments() {
    try {
        const response = await axios.get(this.dataURL);
        this.setState({data: response.data.data})
      } catch (e) {
        console.log(e);
      }  
  }

  componentDidMount() {
  }

  render = () => {

    const modalStyle = getModalStyle()
    const { classes } = this.props

    return <div>
      <Button color="primary" align="right" onClick={this.handleOpen}>
        <AssessmentIcon color="primary"/>&nbsp;&nbsp;
      </Button>
      <Modal
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <div style={modalStyle} className={classes.paper}>

          <Typography variant="h5" id="modal-title">
            View Assessments<br/>
          </Typography>

          <MaterialTable
            columns={this.columns}
            data={this.state.data}
            icons={tableIcons}
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

export default withRouter(withStyles(useStyles)(ModalStages))