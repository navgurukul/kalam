import React from "react";
import { connect } from "react-redux";
import { changeFetching, setupUsers } from "../store/actions/auth";

import axios from "axios";

import StudentService from "../services/StudentService";
import { campus } from "../config";
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
      campusName: campus.find(
        (x) => x.id === parseInt(this.props.match.params.campusId)
      ).name,
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
    const { campusName, isShow } = this.state;
    const { campusId } = this.props.match.params;
    return (
      <div>
        <SelectUiByButtons
          name={`${campusName} Campus`}
          progressMade={this.progressMade}
          tabularData={this.tabularData}
          showGraphData={this.showGraphData}
        />
        {isShow ? (
          <DashboardPage
            displayData={StudentService["CampusData"]}
            url={`campus/${campusId}/students`}
          />
        ) : isShow === null ? (
          <GraphingPresentationJob
            url={`/campus/${campusId}/students/distribution`}
          />
        ) : (
          <StudentsProgressCards url={`campus/${campusId}`} />
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
