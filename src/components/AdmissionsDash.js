import "date-fns";
import React from "react";
// import { allStages} from '../config';
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import Select from "react-select";

import axios from "axios";
import Box from "@material-ui/core/Box";
import makeAnimated from "react-select/animated";

import { theme } from "../theme/theme";
import { changeFetching, setupUsers } from "../store/actions/auth";
import { withRouter } from "react-router-dom";
import StudentService from "../services/StudentService";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { allStages } from "../config";
import MainLayout from "./MainLayout";
import { qualificationKeys } from "../config";
import ServerSidePagination from "./ServerSidePagination";
import _ from "lodash";

const animatedComponents = makeAnimated();
// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

let allStagesOptions = Object.keys(allStages).map((x) => {
  return { value: x, label: allStages[x] };
});
allStagesOptions = [
  {
    value: "default",
    label: "All",
  },
  ...allStagesOptions,
];

const styles = (theme) => ({
  clear: {
    clear: "both",
  },
});

export class AdmissionsDash extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.match.params.dataType) {
      this.dataType = this.props.match.params.dataType;
    } else {
      this.dataType = "softwareCourse";
    }
    this.studentsURL = baseURL + "students";
    this.usersURL = baseURL + "users/getall";
    (this.stage = null),
      (this.value = null),
      (this.loggedInUser = this.props.loggedInUser);

    this.state = {
      totalData: 0,
      data: [],
      sData: undefined, //subsetData,
      fromDate: null,
      showLoader: true,
      filterValues: [],
      numberOfRows: 10,
    };
  }

  setNumbersOfRows = (value) => {
    this.setState({
      numberOfRows: value,
    });
  };

  getFilterValues = (value) => {
    this.setState({ filterValues: value });
  };
  stageChangeEvent = (iData) => {
    // const rowIds = this.state.data.map(x => x.id)
    // const rowIndex = rowIds.indexOf(iData.rowData.rowId);
    // this.setState(({data}) => ({
    //   data: [
    //     ...data.slice(0,rowIndex),
    //     {
    //       ...data[rowIndex],
    //       stage: iData.selectedValue.value,
    //       stageTitle: iData.selectedValue.label
    //     },
    //     ...data.slice(rowIndex+1)
    //   ]
    // }))
    let dataElem = this.state.data[iData.rowId];
    // dataElem.stageTitle = iData.selectedValue.label;
    dataElem.stage = iData.selectedValue.value;

    let newData = this.state.data;
    newData[iData.rowId] = dataElem;

    this.setState({ data: newData }, function () {});
  };

  changeDataType = (option) => {
    this.dataType = option.value;
    this.stage = null;
    this.value = null;
    this.fetchStudents();
  };

  changeStudentStage = (option) => {
    this.value = { value: option.value, label: allStages[option.value] };
    const { filterValues } = this.state;
    if (option.value === "default") {
      this.stage = null;
      this.dataType = "softwareCourse";
      this.fetchStudents(filterValues);
      this.value = "Student Details";
    } else {
      this.stage = option.value;
      this.fetchStudents(filterValues);
      this.dataType = "softwareCourse";
    }
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

  dataSetup = (data, totalData) => {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i] = StudentService.dConvert(data[i]);
      }
      const newData = data.map((v) => {
        return {
          ...v,
          loggedInUser: this.props.loggedInUser.email.split("@")[0],
        };
      });
      this.setState(
        {
          data: newData,
          showLoader: true,
          totalData: totalData ? totalData : this.state.totalData,
        },
        function () {
          this.props.fetchingFinish();
        }
      );
    } else {
      this.setState({
        data: data,
        showLoader: false,
      });
    }
  };

  sortChange = (column, order) => {
    const { data } = this.state;
    let sorted = _.orderBy(data, [column], [order]);
    this.setState({
      data: sorted,
    });
  };

  render = () => {
    const { classes, fetchPendingInterviewDetails } = this.props;
    const { sData, data, showLoader, totalData, numberOfRows } = this.state;
    const options = (
      <Box>
        <Select
          className={"filterSelectGlobal"}
          value={this.dataType}
          onChange={this.changeDataType}
          options={[
            { value: "requestCallback", label: "Request Callback" },
            { value: "softwareCourse", label: "Other Data" },
          ]}
          placeholder={"Select Data Type"}
          isClearable={false}
          components={animatedComponents}
          closeMenuOnSelect={true}
        />
        <Select
          className={"filterSelectGlobal"}
          value={this.value}
          onChange={this.changeStudentStage}
          options={allStagesOptions}
          placeholder={"Get Student Details By Stage"}
          isClearable={false}
          components={animatedComponents}
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

    if (fetchPendingInterviewDetails) {
      return (
        <ServerSidePagination
          columns={StudentService.columns[this.dataType]}
          data={sData ? sData : data}
          showLoader={showLoader}
          params={{
            params: {
              dataType: this.dataType,
              stage: this.stage,
              from: this.state.fromDate,
              to: this.toDate,
            },
          }}
          dataSetup={this.dataSetup}
          totalData={totalData}
          filterValues={this.getFilterValues}
          sortChange={this.sortChange}
          numberOfRows={numberOfRows}
          setNumbersOfRows={this.setNumbersOfRows}
        />
      );
    }
    return (
      <Box>
        {this.options}
        <MuiThemeProvider theme={theme}>
          {this.props.fetchPendingInterviewDetails ? null : options}
          <div className={classes.clear}></div>
          <ServerSidePagination
            columns={StudentService.columns[this.dataType]}
            data={sData ? sData : data}
            showLoader={showLoader}
            fun={this.fetchStudents}
            params={{
              params: {
                dataType: this.dataType,
                stage: this.stage,
                from: this.state.fromDate,
                to: this.toDate,
              },
            }}
            stages={this.value}
            dataSetup={this.dataSetup}
            totalData={totalData}
            filterValues={this.getFilterValues}
            sortChange={this.sortChange}
            numberOfRows={numberOfRows}
            setNumbersOfRows={this.setNumbersOfRows}
          />
        </MuiThemeProvider>
      </Box>
    );
  };

  componentDidMount() {
    this.fetchStudents();
    this.fetchUsers();
    this.fetchOWner();
    this.fetchPartner();
  }

  async fetchOWner() {
    const response = await axios.get(`${baseURL}owner`);
    let newData = response.data.data.map((e) => e.user.mail_id);
    localStorage.setItem("owners", JSON.stringify(newData.sort()));
  }

  async fetchPartner() {
    const response = await axios.get(`${baseURL}partners`);
    let newData = response.data.data.map((e) => e.name);
    console.log(newData.sort());
    localStorage.setItem("partners", JSON.stringify(newData.sort()));
  }
  async fetchUsers() {
    try {
      this.props.fetchingStart();
      const response = await axios.get(this.usersURL, {});
      this.props.usersSetup(response.data.data);
      let newData = response.data.data.map((data) => data.user);
      localStorage.setItem("users", JSON.stringify(newData));
      this.props.fetchingFinish();
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish();
    }
  }

  async fetchStudents(value) {
    const { fetchPendingInterviewDetails, loggedInUser } = this.props;
    const { numberOfRows } = this.state;
    try {
      this.props.fetchingStart();
      let response;
      if (fetchPendingInterviewDetails) {
        response = await axios.get(`${baseURL}students/pending_interview`, {
          params: {
            user: loggedInUser.mailId,
          },
        });
      } else {
        let url = this.studentsURL;
        value &&
          value.map((filterColumn, index) => {
            if (index > 0) {
              url = url + `&${filterColumn.key}=${filterColumn.value}`;
            } else {
              url = url + `?${filterColumn.key}=${filterColumn.value}`;
            }
          });
        response =
          value && value.length > 0
            ? await axios.get(`${url}&limit=${numberOfRows}&page=0`, {
                params: {
                  dataType: this.dataType,
                  stage: this.stage,
                  from: this.state.fromDate,
                  to: this.toDate,
                },
              })
            : await axios.get(
                `${this.studentsURL}?limit=${numberOfRows}&page=0`,
                {
                  params: {
                    dataType: this.dataType,
                    stage: this.stage,
                    from: this.state.fromDate,
                    to: this.toDate,
                  },
                }
              );
      }

      const studentData = response.data.data.results.map((student) => {
        let contacts = student.contacts[student.contacts.length - 1];
        return {
          ...student,
          qualification: qualificationKeys[student.qualification],
          studentOwner: "",
          campus: student.campus ? student.campus : null,
          donor: student.studentDonor ? student.studentDonor : null,
          altNumber: contacts ? contacts.alt_mobile : contacts,
        };
      });
      this.setState({
        totalData: response.data.data.total,
      });
      this.dataSetup(studentData);
    } catch (e) {
      this.props.fetchingFinish();
    }
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
  usersSetup: (users) => dispatch(setupUsers(users)),
});

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(AdmissionsDash)
  )
);
