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
import { allStages } from '../config';

import GlobalService from '../services/GlobalService';
import StudentService from '../services/StudentService';


// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

const styles = theme => ({
  clear: {
    clear: 'both'
  }
})

export class StageWiseGenderDistribution extends React.Component {

  constructor(props) {

    super(props);
    this.StageWiseGenderDistributionURL = baseURL + 'students/report/all';
    
    this.state = {
      data: [],
    }
  }

  dataConvert = (data) => {
    const newData = [];
    for (const [key, value] of Object.entries(data)) {
      const dic = {};
      dic.female = value[1];
      dic.male = value[2];
      dic.transgender = value[3];
      dic.unspecified = value[null];
      dic.total = dic.female + dic.male + dic.transgender + dic.unspecified;
      dic.stage = allStages[key];
      newData.push(dic);
    } 
    this.setState({
      data: newData,
    });
  }

  render = () => {

    return <Box>
      <MuiThemeProvider theme={theme}>
        <MaterialTable
          columns={StudentService.columnDanglingReports}
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
      const response = await axios.get(this.StageWiseGenderDistributionURL, { });
      this.dataConvert(response.data.data);
      this.props.fetchingFinish();
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  };
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false))
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(StageWiseGenderDistribution));
