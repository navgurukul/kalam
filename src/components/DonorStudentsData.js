import React from "react";
import axios from "axios";

import StudentService from "../services/StudentService";

import MainLayout from "./MainLayout";
import { qualificationKeys, donor } from "../config";
import DashboardPage from "./Dashboard";
import SelectUiByButtons from "./SelectUiByButtons";
import StudentsProgressCards from "./StudentsProgressCards";
import GraphingPresentationJob from "./GraphingPresentationJob.js";
const baseUrl = process.env.API_URL;

class DonorStudentsData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      donorName: donor.find(
        (x) => x.id === parseInt(this.props.match.params.donorId)
      ).name,
    };
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
    const { donorName, isShow } = this.state;
    const { donorId } = this.props.match.params;

    return (
      <div>
        <SelectUiByButtons
          name={`${donorName} Donor`}
          progressMade={this.progressMade}
          tabularData={this.tabularData}
          showGraphData={this.showGraphData}
        />
        {isShow ? (
          <DashboardPage
            displayData={StudentService["CampusData"]}
            url={`donor/${donorId}/students`}
          />
        ) : isShow === null ? (
          <GraphingPresentationJob
            url={`/donor/${donorId}/students/distribution`}
          />
        ) : (
          <StudentsProgressCards url={`donor/${donorId}`} />
        )}
      </div>
    );
  }
}

export default DonorStudentsData;
