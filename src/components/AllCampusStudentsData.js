import React from "react";
import { connect } from "react-redux";
import { changeFetching, setupUsers } from "../store/actions/auth";

import axios from "axios";

import StudentService from "../services/StudentService";
import DashboardPage from "./Dashboard";
import SelectUiByButtons from "./SelectUiByButtons";
import StudentsProgressCards from "./StudentsProgressCards";
import GraphingPresentationJob from "./GraphingPresentationJob.js";

const baseUrl = process.env.API_URL;

class CampusStudentsData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
    };
  }
  async fetchUsers() {
    const usersURL = baseUrl + "users/getall";
    try {
      const response = await axios.get(usersURL, {});
      this.props.usersSetup(response.data.data);
      this.props.fetchingFinish();
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish();
    }
  }
  componentDidMount() {
    this.fetchUsers();
  }
  progressMade = (value) => {
    this.setState({ isShow: value });
  };
  tabularData = (value) => {
    this.setState({ isShow: value });
  };
  showGraphData = (value) => {
    this.setState({ isShow: value });
  };
  render() {
    const {  isShow } = this.state;
    return (
      <div>
        <SelectUiByButtons
          name={`All Campus`}
          progressMade={this.progressMade}
          tabularData={this.tabularData}
          showGraphData={this.showGraphData}
        />
        {isShow ? (
          <DashboardPage
            displayData={StudentService["CampusData"]}
            url={`/allcampus/students`}
          />
        ) : isShow === null ? (
          <GraphingPresentationJob
            url={`/allcampus/students/distribution`}
          />
        ) : (
          <StudentsProgressCards url={`allcampus`} />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchingFinish: () => dispatch(changeFetching(false)),
  usersSetup: (users) => dispatch(setupUsers(users)),
});

export default connect(undefined, mapDispatchToProps)(CampusStudentsData);