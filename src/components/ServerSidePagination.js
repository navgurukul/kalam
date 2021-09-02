import React from "react";
import MUIDataTable from "mui-datatables";
import { qualificationKeys, allStages } from "../config";

import { withRouter } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import SearchBar from "./SearchBar";

const baseURL = process.env.API_URL;

class ServerSidePagination extends React.Component {
  state = {
    page: 0,
    isData: false,
    filterColumns: [],
  };
  getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };
  getStudents = async (page, rowsPerPage) => {
    const { params, dataSetup } = this.props;
    this.setState({
      isData: true,
    });
    const url =
      typeof page === "string" && page.includes(baseURL)
        ? page
        : `${baseURL}students?limit=${rowsPerPage}&page=${page}`;
    const response = await axios.get(url, { params });
    const studentData = response.data.data.results.map((student) => {
      return {
        ...student,
        qualification: qualificationKeys[student.qualification],
        studentOwner: "",
        campus: student.campus ? student.campus : null,
        donor: student.studentDonor ? student.studentDonor : null,
      };
    });
    this.setState({
      isData: false,
    });
    dataSetup(studentData);
  };

  changePage = (page, rowsPerPage) => {
    this.getStudents(page, rowsPerPage);
    this.setState({
      page: page,
    });
  };

  getfilterApi = async (query, value) => {
    if (query === "stage") {
      value = this.getKeyByValue(allStages, value);
    } else if (query === "gender") {
      value = value === "Female" ? 1 : 2;
    }

    const keys = {
      gender: "gender",
      stage: "stage",
      donor: "searchDonorName",
      campus: "searchCampusName",
    };

    await this.setState((prevState) => {
      const newData = prevState.filterColumns.filter(
        (filterColumn) => filterColumn.key !== query
      );
      return {
        filterColumns: [...newData, { key: keys[query], value: value }],
      };
    });
    const { filterColumns } = this.state;

    let url = `${baseURL}students`;

    filterColumns.map((filterColumn, index) => {
      if (index > 0) {
        url = url + `&${filterColumn.key}=${filterColumn.value}`;
      } else {
        url = url + `?${filterColumn.key}=${filterColumn.value}`;
      }
    });
    this.getStudents(`${url}&limit=250&page=0`);
  };

  getSearchApi = (query, value) => {
    if (query) {
      this.getStudents(`${baseURL}students?${query}=${value}`);
    } else {
      this.getStudents(0, 250);
    }
  };
  render() {
    const { page, isData } = this.state;
    const { data, columns, totalData } = this.props;

    const options = {
      selectableRows: false,
      filter: true,
      search: false,
      serverSide: true,
      filterType: "dropdown",
      onFilterChange: (columnChanged, filterList) => {
        const indexObj = {
          gender: 8,
          stage: 9,
          campus: 22,
          donor: 23,
        };
        if (columnChanged) {
          const filterValue = filterList[indexObj[columnChanged]];
          return this.getfilterApi(
            columnChanged,
            filterValue[filterValue.length - 1]
          );
        } else {
          return this.getStudents(0, 250);
        }
      },
      responsive: "stacked",
      rowsPerPageOptions: [50, 100, 250],
      count: totalData,
      rowsPerPage: 250,
      page: page,
      onChangeRowsPerPage: (numberOfRows) => {
        this.getStudents(this.state.page, numberOfRows);
      },
      onTableChange: (action, tableState) => {
        const { rowsPerPage, page } = tableState;
        switch (action) {
          case "changePage":
            this.changePage(page, rowsPerPage);
            break;
        }
      },
      textLabels: {
        body: {
          noMatch: this.props.showLoader ? (
            <Loader />
          ) : (
            "Sorry, there is no matching data to display"
          ),
        },
      },
    };
    return (
      <MUIDataTable
        title={<SearchBar searchByName={this.getSearchApi} />}
        data={isData ? [] : data}
        columns={columns}
        options={options}
      />
    );
  }
}

export default withRouter(ServerSidePagination);
