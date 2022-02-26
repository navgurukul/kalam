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
import user from "../utils/user";
import NotHaveAccess from "../components/NotHaveAccess";

const baseUrl = process.env.API_URL;

class CampusStudentsData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      campusName: campus.find(
        (x) => x.id === parseInt(this.props.match.params.campusId)
      ).name,
      access: null,
      userLoggedIn: user(),
      campusRouteCondition: false,
    };
  }
  async fetchAccess() {
    try {
      const accessUrl = baseUrl + "rolebaseaccess";

      axios.get(accessUrl).then((response) => {
        const campusData = response.data.campus;
        this.setState(
          {
            access: campusData ? campusData : null,
          },
          () => {
            const conditions =
              this.state.access &&
              this.state.userLoggedIn &&
              this.state.userLoggedIn.email &&
              this.state.access[this.state.campusName] &&
              this.state.access[this.state.campusName].view &&
              this.state.access[this.state.campusName].view.includes(
                this.state.userLoggedIn.email
              );

            this.setState({
              campusRouteCondition: conditions,
            });
          }
        );
      });
    } catch (e) {
      console.error(e);
    }
  }
  async fetchUsers() {
    const usersURL = baseUrl + "users/getall";
    try {
      const response = await axios.get(usersURL, {});
      this.props.usersSetup(response.data.data);
      this.props.fetchingFinish();
    } catch (e) {
      console.error(e);
      this.props.fetchingFinish();
    }
  }
  componentDidMount() {
    this.fetchUsers();
    this.fetchAccess();
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
    //console.log(campusName, campusId);
    return (
      <div>
        {this.state.campusRouteCondition ? (
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
                campusID={campusId}
              />
            ) : isShow === null ? (
              <GraphingPresentationJob
                url={`/campus/${campusId}/students/distribution`}
              />
            ) : (
              <StudentsProgressCards url={`campus/${campusId}`} />
            )}
          </div>
        ) : (
          <NotHaveAccess />
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
