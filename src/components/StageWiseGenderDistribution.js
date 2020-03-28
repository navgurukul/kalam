// Todo
// Logic of RQC Columns

import 'date-fns';
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';


import { changeFetching } from '../store/actions/auth';
import { allStages, feedbackableStagesData } from '../config';
import StudentService from '../services/StudentService';
import MainLayout from './MainLayout';



// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;



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
      if (!feedbackableStagesData[key]) {
        const dic = {};
        dic.female = value[1];
        dic.male = value[2];
        dic.transgender = value[3];
        dic.unspecified = value[null];
        dic.total = dic.female + dic.male + dic.transgender + dic.unspecified;
        dic.stage = allStages[key];
        newData.push(dic);
      }
    }
    this.setState({
      data: newData,
    });
  }

  render = () => {
    return (<MainLayout columns={StudentService.columnDanglingReports}
      data={this.state.data} />)
  }

  componentDidMount() {
    this.fetchonwerReport();
  }

  async fetchonwerReport() {
    try {
      this.props.fetchingStart()
      const response = await axios.get(this.StageWiseGenderDistributionURL, {});
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

export default (connect(mapStateToProps, mapDispatchToProps)(StageWiseGenderDistribution));
