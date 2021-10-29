import React, { Component } from "react";
import axios from "axios";
import StudentService from "../services/StudentService";
import DashboardPage from "./Dashboard";
import StudentsProgressCards from "./StudentsProgressCards";
import SelectUiByButtons from "./SelectUiByButtons";
import GraphingPresentationJob from "./GraphingPresentationJob.js";

const baseUrl = process.env.API_URL;

class PartnerStudentsProgressInCampus extends Component {
  constructor() {
    super();
    this.state = {
      partnerName: "",
      isShow: false,
    };
  }
  componentDidMount() {
    const partnerId = this.props.match.params.partnerId;
    axios.get(`${baseUrl}partners/${partnerId}`).then((res) => {
      this.setState({
        partnerName: res.data.data["name"],
      });
    });
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
    const { partnerName, isShow } = this.state;
    return (
      <div>
        <SelectUiByButtons
          name={`Hello ${partnerName}`}
          progressMade={this.progressMade}
          tabularData={this.tabularData}
          showGraphData={this.showGraphData}
        />
        {isShow ? (
          <DashboardPage
            displayData={StudentService["CampusData"]}
            url={`partners/joined_progress_made/${this.props.match.params.partnerId}`}
          />
        ) : isShow === null ? (
          <GraphingPresentationJob
            url={`/partners/${this.props.match.params.partnerId}/students/distribution`}
          />
        ) : (
          <StudentsProgressCards
            url={`partners/${this.props.match.params.partnerId}`}
          />
        )}
      </div>
    );
  }
}

export default PartnerStudentsProgressInCampus;
