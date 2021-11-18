import React from "react";
import { connect } from "react-redux";

import Box from "@material-ui/core/Box";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";

import { changeFetching, setupUsers } from "../store/actions/auth";

import { withRouter } from "react-router-dom";

import StudentService from "../services/StudentService";
import { EventEmitter } from "./events";
import MainLayout from "./MainLayout";
import { qualificationKeys } from "../config";
import Select from "react-select";
import { withSnackbar } from "notistack";
import { campusStageOfLearning, allStages } from "../config";
import { getData } from "../store/actions/data";

let allStagesOptions = Object.keys(campusStageOfLearning).map((x) => {
  return { value: x, label: campusStageOfLearning[x] };
});

let partnerStages = Object.keys(allStages).map((x) => {
  return { value: x, label: allStages[x] };
});

const allStagesValue = Object.values(allStages);
// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseUrl = process.env.API_URL;

let columns = [
  {
    label: "English Interview Pending (2nd Round)",
    name: "pendingEnglishInterview",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "English Interview Failed",
    name: "englishInterviewFail",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Algebra Interview Pending (3rd Round)",
    name: "pendingAlgebraInterview",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Algebra Interview Failed",
    name: "algebraInterviewFail",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Culture Fit Interview Pending (4th Round)",
    name: "pendingCultureFitInterview",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Culture Interview Failed",
    name: "cultureFitInterviewFail",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Selected",
    name: "selected",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Offer Letter Sent",
    name: "offerLetterSent",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Unreachable",
    name: "notReachable",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
];
let filterFns = [];

export class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainData: [],
      fromDate: null,
      showLoader: true,
      fromStage: null,
      toStage: null,
      dropoutCount: null,
      onLeaveCount: null,
      inCampusCount: null,
    };

    EventEmitter.subscribe("stageChange", this.stageChangeEvent);
  }

  stageChangeEvent = (iData) => {
    const { data, getStudentsData } = this.props;

    const rowIds = data.map((x) => x.id);
    const rowIndex = rowIds.indexOf(iData.rowData.id);

    let dataElem = data[rowIndex];
    dataElem.stageTitle = iData.selectedValue.label;
    dataElem.stage = iData.selectedValue.value;

    let newData = data;
    newData[rowIndex] = dataElem;
    getStudentsData(newData);
  };

  changeFromDate = async (date) => {
    await this.setState({
      fromDate: date,
    });
    this.fetchStudents();
  };

  changeToDate = (date) => {
    this.toDate = date;
    this.fetchStudents();
  };

  dataSetup = (studentData) => {
    const { data, getStudentsData } = this.props;
    let locationCampus = location.pathname.split("/")[1];

    let countDropOut = 0;
    let countOnLeave = 0;
    let countInCampus = 0;
    if (locationCampus === "campus") {
      console.log(studentData[2].stage);
      if (studentData.length > 0) {
        studentData.forEach((e) => {
          if (e.stage === "droppedOut") {
            countDropOut++;
          } else if (e.stage === "onLeave") {
            countOnLeave++;
          } else if (
            e.stage !== "M22" ||
            e.stage !== "M21" ||
            e.stage !== "offerLetterSent" ||
            e.stage !== "inJob" ||
            e.stage !== "payingForward" ||
            e.stage !== "paidForward"
          ) {
            countInCampus++;
          }
        });
      }
    }

    for (let i = 0; i < studentData.length; i++) {
      studentData[i] = StudentService.dConvert(studentData[i]);
    }
    getStudentsData(studentData);

    this.setState(
      {
        mainData: data,
        fromDate: data.length > 0 ? data[0].created_at : null,
        showLoader: false,
        dropoutCount: countDropOut,
        onLeaveCount: countOnLeave,
        inCampusCount: countInCampus,
      },
      function () {
        this.props.fetchingFinish();
      }
    );
  };

  filterData = () => {
    const { getStudentsData } = this.props;
    const { fromStage, toStage, mainData } = this.state;
    getStudentsData(mainData);
    const { data } = this.props;
    if (allStagesValue.indexOf(fromStage) <= allStagesValue.indexOf(toStage)) {
      const newAllStagesValue = allStagesValue.slice(
        allStagesValue.indexOf(fromStage),
        allStagesValue.indexOf(toStage) + 1
      );
      const newData = data.filter((element) => {
        return newAllStagesValue.indexOf(element.stage) > -1;
      });
      getStudentsData(newData);
    } else {
      getStudentsData([]);
      this.props.enqueueSnackbar(
        `Stage inputs not correct. Please check once.`,
        {
          variant: "error",
        }
      );
    }
  };

  onChangeFromStage = async (event) => {
    await this.setState({ fromStage: event.label });
    const { fromStage, toStage } = this.state;
    if (fromStage && toStage) {
      this.filterData();
    }
  };

  onChangeToStage = async (event) => {
    await this.setState({ toStage: event.label });
    const { fromStage, toStage } = this.state;
    if (fromStage && toStage) {
      this.filterData();
    }
  };

  render = () => {
    const { displayData, title, location, data } = this.props;
    const { dropoutCount, onLeaveCount, inCampusCount } = this.state;
    let locationCampus = location.pathname.split("/")[1];

    const showAllStage = parseInt(
      location.pathname[location.pathname.length - 1]
    );
    const { fromStage, toStage, mainData, showLoader } = this.state;

    const options = data.length > 0 && (
      <Box>
        <Select
          className={"filterSelectGlobal"}
          onChange={this.onChangeFromStage}
          options={showAllStage ? partnerStages : allStagesOptions}
          placeholder={"from Stage"}
          isClearable={false}
          closeMenuOnSelect={true}
        />
        <Select
          className={"filterSelectGlobal"}
          onChange={this.onChangeToStage}
          options={showAllStage ? partnerStages : allStagesOptions}
          placeholder={"to Stage"}
          isClearable={false}
          closeMenuOnSelect={true}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="dense"
            style={{ marginLeft: 16, maxWidth: "40%" }}
            value={this.state.fromDate}
            id="date-picker-dialog"
            label="From Date"
            format="MM/dd/yyyy"
            onChange={this.changeFromDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardDatePicker
            margin="dense"
            style={{ marginLeft: 16, maxWidth: "40%" }}
            value={this.toDate}
            id="date-picker-dialog"
            label="To Date"
            format="MM/dd/yyyy"
            onChange={this.changeToDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      </Box>
    );

    const options2 = data.length > 0 && (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Select
          className={"filterSelectGlobal"}
          onChange={this.onChangeFromStage}
          options={showAllStage ? partnerStages : allStagesOptions}
          placeholder={"from Stage"}
          isClearable={false}
          closeMenuOnSelect={true}
        />
        <Select
          className={"filterSelectGlobal"}
          onChange={this.onChangeToStage}
          options={showAllStage ? partnerStages : allStagesOptions}
          placeholder={"to Stage"}
          isClearable={false}
          closeMenuOnSelect={true}
        />

        {locationCampus === "campus" && (
          <span
            style={{
              fontSize: "17px",
              padding: "8px 10px",
              border: "1px solid #B3B3B3",

              fontFamily: "Times New Roman",
              marginLeft: "20px",
              borderRadius: "4px",
              marginTop: "16px",
            }}
          >
            <span style={{}}>InCampus : {inCampusCount}</span>
            <span> OnLeave : {onLeaveCount}</span>
            <span> DropOut : {dropoutCount} </span>
          </span>
        )}
      </div>
    );
    return (
      <div>
        {locationCampus === "campus" ? options2 : options}
        <MainLayout
          title={title}
          columns={[...displayData, ...columns]}
          data={data}
          showLoader={showLoader}
        />
      </div>
    );
  };

  componentDidMount() {
    this.fetchStudents();
    this.fetchUsers();
  }

  async fetchUsers() {
    try {
      this.props.fetchingStart();
      const usersURL = baseUrl + "users/getall";
      const response = await axios.get(usersURL, {});
      this.props.usersSetup(response.data.data);
      this.props.fetchingFinish();
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish();
    }
  }

  async fetchStudents() {
    try {
      this.props.fetchingStart();
      // const qualificationKeys = Object.assign(
      //   {},
      //   ...Object.entries(qualification).map(([k, v]) => ({ [v]: k }))
      // );
      const { url } = this.props;
      const dataURL = baseUrl + url;
      const response = await axios.get(dataURL, {
        params: {
          from: this.state.fromDate,
          to: this.toDate,
        },
      });
      const obj = {};
      const studentData = response.data.data.map((student) => {
        let value = student["lastTransition"]
          ? student["lastTransition"]["to_stage"]
          : "other";
        let contacts = student.contacts[student.contacts.length - 1];

        if (obj[value]) {
          obj[value] = obj[value] + 1;
        } else {
          obj[value] = 1;
        }
        return {
          ...student,
          qualification: qualificationKeys[student.qualification],
          altNumber: contacts ? contacts.alt_mobile : contacts,
        };
      });

      if (studentData.length > 0) {
        studentData[0] = { ...studentData[0], ...obj };
      }
      this.dataSetup(studentData);
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish();
    }
  }
}

const mapStateToProps = (state) => ({
  data: state.data.getData,
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
  usersSetup: (users) => dispatch(setupUsers(users)),
  getStudentsData: (data) => dispatch(getData(data)),
});

export default withRouter(
  withSnackbar(connect(mapStateToProps, mapDispatchToProps)(DashboardPage))
);
