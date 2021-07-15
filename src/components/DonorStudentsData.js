import React from "react";
import axios from "axios";

import StudentService from "../services/StudentService";

import MainLayout from "./MainLayout";
import { qualificationKeys, donor } from "../config";
import GrapLink from "./GrapLink";

const baseUrl = process.env.API_URL;

class DonorStudentsData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      donorName: donor.find(
        (x) => x.id === parseInt(this.props.match.params.donorId)
      ).name,
    };
  }
  componentDidMount() {
    this.fetching();
  }
  dataSetup = (data) => {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i] = StudentService.dConvert(data[i]);
      }
      this.setState({
        data: data,
      });
    }
  };
  fetching = async () => {
    const dataURL =
      baseUrl + `donor/${this.props.match.params.donorId}/students`;
    const response = await axios.get(dataURL);
    const studentData = response.data.data.map((student) => {
      return {
        ...student,
        qualification: qualificationKeys[student.qualification],
      };
    });
    this.dataSetup(studentData);
  };
  render() {
    const { data, donorName } = this.state;
    const { donorId } = this.props.match.params;
    return (
      <MainLayout
        title={<GrapLink titleName={donorName} id={`/donor/${donorId}`} />}
        columns={StudentService["DonorData"]}
        data={data}
      />
    );
  }
}

export default DonorStudentsData;
