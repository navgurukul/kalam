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

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseUrl = process.env.API_URL;

let columns;
let filterFns = [];

export class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sData: undefined, //subsetData,
      fromDate: null,
    };

    EventEmitter.subscribe("stageChange", this.stageChangeEvent);
  }

  stageChangeEvent = (iData) => {
    const rowIds = this.state.data.map((x) => x.id);
    const rowIndex = rowIds.indexOf(iData.rowData.id);

    let dataElem = this.state.data[rowIndex];
    dataElem.stageTitle = iData.selectedValue.label;
    dataElem.stage = iData.selectedValue.value;

    let newData = this.state.data;
    newData[rowIndex] = dataElem;

    this.setState({ data: newData });
  };

  handleChange = (field, filterFn) => {
    filterFns[field] = filterFn;
    const fieldKeys = Object.keys(filterFns);

    let sData = this.state.data.filter((x) => {
      let result = true;
      for (var key in filterFns) {
        result = result && filterFns[key](x);
      }
      return result;
    });

    // sData [] and undefined are different
    // sData [] = when no results are returned
    // sData undefined = when all results are returned
    this.setState({
      sData: sData,
    });
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

  dataSetup = (data) => {
    // columns = StudentService.setupPre(StudentService.columns["partnerDashboard"]);

    for (let i = 0; i < data.length; i++) {
      data[i] = StudentService.dConvert(data[i]);
      // columns = StudentService.addOptions(columns, data[i]);
    }

    // columns = StudentService.setupPost(columns);

    this.setState({ data: data, fromDate: data[0].created_at }, function () {
      this.props.fetchingFinish();
    });
  };

  render = () => {
    const options = (
      <Box>
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

    // if (!this.state.data.length) {
    //   return <Box></Box>
    // }

    // let filterSelectRows = []
    // columns.map( (x) => {
    //   if ('selectFilter' in x)
    //     filterSelectRows.push(
    //       <FilterSelect
    //         filter={{
    //           name : x.sfTitle,
    //           field : x.field
    //         }}
    //         ifMulti={x.sfMulti}
    //         key={x.field}
    //         options={x.options}
    //         handleChange={this.handleChange}
    //       />
    //     )
    // })
    return (
      <div>
        {options}
        <MainLayout
          columns={StudentService.columns["softwareCourse"]}
          data={this.state.sData ? this.state.sData : this.state.data}
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
      const dataURL =
        baseUrl + "partners/" + this.props.match.params.partnerId + "/students";
      const response = await axios.get(dataURL, {
        params: {
          from: this.state.fromDate,
          to: this.toDate,
        },
      });
      this.dataSetup(response.data.data);
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish();
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
  usersSetup: (users) => dispatch(setupUsers(users)),
});

export default withRouter(
  connect(undefined, mapDispatchToProps)(DashboardPage)
);
