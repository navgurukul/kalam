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
      // campusID: this.props.campusID,
    };
  }
  async fetchAccess() {
    try {
      // this.props.fetchingStart();
      const { campusId } = this.props.match.params;
      const accessUrl = baseUrl + "rolebaseaccess";

      axios.get(accessUrl).then((response) => {
        const campusData = response.data.campus;
        // const { access, userLoggedIn, campusName } = this.state;

        this.setState(
          {
            access: campusData ? campusData : null,
          },
          () => {
            // console.log(this.state.access, "accessesss");

            // console.log(this.state, "state");
            // console.log(this.state.access, "condition - access");
            // console.log(this.state.userLoggedIn, "condition - userLoggedIn");
            // console.log(
            //   this.state.userLoggedIn.email,
            //   "condition - userLoggedIn.email"
            // );
            // console.log(
            //   this.state.access[this.state.campusName] ? true : false,
            //   "condition - access[campusName]"
            // );
            // console.log(
            //   this.state.access[this.state.campusName].view,
            //   "condition - access[campusName].view"
            // );
            // console.log(
            //   this.state.access[this.state.campusName].view.includes(
            //     this.state.userLoggedIn.email
            //   ),
            //   "condition - access[campusName].view.includes(userLoggedIn.email)"
            // );

            const conditions =
              this.state.access &&
              this.state.userLoggedIn &&
              this.state.userLoggedIn.email &&
              this.state.access[this.state.campusName] &&
              this.state.access[this.state.campusName].view &&
              this.state.access[this.state.campusName].view.includes(
                this.state.userLoggedIn.email
              );

            console.log(conditions, "conditions");
            this.setState(
              {
                campusRouteCondition: conditions,
              },
              () => {
                console.log(
                  this.state.campusRouteCondition,
                  "campusRouteCondition"
                );
              }
            );
          }
        );
        console.log(response.data.campus, "campus access");
        // this.props.fetchingFinish();
      });

      // console.log(conditionCampus, "condition - conditionCampus");
      // const conditionCampus =
      //   access &&
      //   userLoggedIn &&
      //   userLoggedIn.email &&
      //   access[campusName] &&
      //   access[campusName].view &&
      //   access[campusName].view.includes(userLoggedIn.email)
      //     ? true
      //     : false;
      // console.log(conditionCampus, "campus condition");
      // this.setState(
      //   {
      //     campusRouteCondition: conditionCampus,
      //   },
      //   () => {
      //     console.log(this.state.campusRouteCondition, "campus condition 2");
      //   }
      // );
      // this.props.fetchingFinish();
    } catch (e) {
      console.log(e);
      // this.props.fetchingFinish();
    }
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
    console.log(campusName, campusId);
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
