// Todo
// Logic of RQC Columns

import 'date-fns';
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { changeFetching } from '../store/actions/auth';
import StudentService from '../services/StudentService';
import MainLayout from './MainLayout';




// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;


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
    for (let i = 0; i < data.length; i++) {
      data[i].name = data[i].student.name;
      delete data[i].student;
      newData.push(data[i])
    }
    this.setState({
      data: newData,
    })
  }

  render = () => {
    return (<MainLayout columns={StudentService.columnMyReports}
      data={this.state.data} />)
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

export default (connect(mapStateToProps, mapDispatchToProps)(MyTaskReport));
