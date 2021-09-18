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

let columns;
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
    const { getStudentsData } = this.props;
    for (let i = 0; i < studentData.length; i++) {
      studentData[i] = StudentService.dConvert(studentData[i]);
    }
    getStudentsData(studentData);
    const { data } = this.props;
    this.setState(
      {
        mainData: data,
        fromDate: data.length > 0 ? data[0].created_at : null,
        showLoader: false,
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
    const showAllStage = parseInt(
      location.pathname[location.pathname.length - 1]
    );
    const { fromStage, toStage, mainData, showLoader } = this.state;
    const options = mainData.length > 0 && (
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
    return (
      <div>
        {options}
        <MainLayout
          title={title}
          columns={displayData}
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

      const studentData = response.data.data.map((student) => {
        return {
          ...student,
          qualification: qualificationKeys[student.qualification],
        };
      });
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
