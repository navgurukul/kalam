// Todo
// Logic of RQC Columns

import 'date-fns';
import React from 'react';
import { connect } from 'react-redux';

import MaterialTable from "material-table";
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import axios from 'axios';
import Box from '@material-ui/core/Box';

import { theme } from '../theme/theme';

import { changeFetching } from '../store/actions/auth';

import GlobalService from '../services/GlobalService';
import StudentService from '../services/StudentService';


// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

const styles = theme => ({
  clear: {
    clear: 'both'
  }
})

export class MyTaskReport extends React.Component {

  constructor(props) {

    super(props);
    this.onwerDetailsURL = baseURL + 'students/my_tasks';
    
    this.state = {
      data: [],
    }
  }

  dataConvert = (data) => {
    const newData = []
    for (let i=0; i< data.length; i++) {
      data[i].name = data[i].student.name;
      delete data[i].student;
      newData.push(data[i])      
    }
    this.setState({
      data: newData,
    })
  }

  render = () => {

    return <Box>
      <MuiThemeProvider theme={theme}>
        <MaterialTable
          columns={StudentService.columnMyReports}
          data={this.state.data}
          icons={GlobalService.tableIcons}
          options={{
            headerStyle: {
              color: theme.palette.primary.main
            },
            exportButton: true,
            pageSize: 100,
            showTitle: false,
            toolbar: false,
            filtering: false,
          }}
        />
      </MuiThemeProvider>
    </Box>
  }

  componentDidMount() {
    this.fetchonwerReport();
  }

  async fetchonwerReport() {
    try {
      this.props.fetchingStart()
      // response = ngFetch(this.studentsURL, 'GET', {
      //   params: {
      //     dataType: this.dataType,
      //     fromDate: this.fromDate,
      //     toDate: this.toDate
      //   }
      // }, true);
      const user = this.props.loggedInUser.email.split('@')[0];
      console.log(user)
      const response = await axios.get(this.onwerDetailsURL, {
        params: {
          user: user
        }
      });
      this.dataConvert(response.data.data);
      this.props.fetchingFinish();
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false))
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MyTaskReport));
