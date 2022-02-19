import React from "react";
import { connect } from "react-redux";
import { changeFetching, setupUsers } from "../store/actions/auth";
import axios from "axios";
import StudentService from "../services/StudentService";
import DashboardPage from "./Dashboard";
import SelectUiByButtons from "./SelectUiByButtons";
import StudentsProgressCards from "./StudentsProgressCards";
import GraphingPresentationJob from "./GraphingPresentationJob.js";
import user from "../utils/user";
import NotHaveAccess from "./NotHaveAccess";

//baseUrl
const baseUrl = process.env.API_URL;

class CampusStudentsData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      access: null, //access object to store data who are allowed to access the page
      userLoggedIn: user(), //user object to store data of logged in user
      allCampusCondition: false, //condition to check if user is allowed to access the page
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
  async fetchAccess() {
    try {
      const accessUrl = baseUrl + "rolebaseaccess"; //request url

      axios.get(accessUrl).then((response) => {
        const campusData = response.data.campus; //storing response data in campusData variable

        this.setState(
          {
            access: campusData ? campusData : null, //to set access object
          },
          () => {
            const conditions = //variable to check if user is allowed to access the page
              this.state.access &&
              this.state.userLoggedIn &&
              this.state.userLoggedIn.email &&
              this.state.access.All &&
              this.state.access.All.view &&
              this.state.access.All.view.includes(
                this.state.userLoggedIn.email
              );

            this.setState({
              allCampusCondition: conditions, //set the state of allCampusCondition
            });
          }
        );
      });
    } catch (e) {
      console.log(e);
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
    const { isShow } = this.state;
    return (
      <div>
        {this.state.allCampusCondition ? ( //if user is allowed to access the page
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
