import React from "react";
import MUIDataTable from "mui-datatables";
import { qualificationKeys, allStages } from "../config";

import { withRouter } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import SearchBar from "./SearchBar";

const baseURL = process.env.API_URL;

class ServerSidePagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      isData: false,
      filterColumns: [],
      mainUrl: `${baseURL}students?`,
      query: "",
      value: "",
      newColumns: this.props.columns
    };
  }

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
        : `${this.state.mainUrl}limit=${rowsPerPage}&page=${page}`;
    const response = await axios.get(url, params);
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
    dataSetup(studentData, response.data.data.total);
  };

  getStudentsDetailBySearch = async (url) => {
    const { dataSetup } = this.props;
    this.setState({
      isData: true,
    });
    const response = await axios.get(url);
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
    dataSetup(studentData, response.data.data.total);
  };
  changePage = (page, rowsPerPage) => {
    this.getStudents(page, rowsPerPage);
    this.setState({
      page: page,
    });
  };

  getfilterApi = async (query, value) => {
    if (query === "gender" && value) {
      value = value === "Female" ? 1 : 2;
    }

    const keys = {
      gender: "gender",
      donor: "searchDonorName",
      campus: "searchCampusName",
      studentOwner: "searchOwnerName",
    };

    await this.setState((prevState) => {
      const newData = prevState.filterColumns.filter(
        (filterColumn) => this.getKeyByValue(keys, filterColumn.key) !== query
      );
      return {
        filterColumns:
          value === undefined
            ? [...newData]
            : [...newData, { key: keys[query], value: value }],
      };
    });
    const { filterColumns } = this.state;
    this.props.filterValues(filterColumns);
    let url = `${baseURL}students?`;

    filterColumns.map((filterColumn, index) => {
      if (index > 0) {
        url = url + `&${filterColumn.key}=${filterColumn.value}`;
      } else {
        if (this.state.query) {
          url =
            url +
            `${this.state.query}=${this.state.value}&${filterColumn.key}=${filterColumn.value}`;
        } else {
          url = url + `${filterColumn.key}=${filterColumn.value}`;
        }
      }
    });
    if (filterColumns.length > 0) {
      await this.setState({
        mainUrl: `${url}&`,
      });
      this.getStudents(`${url}&limit=10&page=0`);
    } else {
      await this.setState({
        mainUrl: `${url}`,
      });
      this.getStudents(0, 10);
    }
  };

  getSearchApi = (query, value) => {
    if (query) {
      this.getStudentsDetailBySearch(`${baseURL}students?${query}=${value}`);
    } else {
      this.getStudents(this.state.page, 10);
    }
  };
  render() {
    const { page, isData, filterColumns, newColumns } = this.state;
    const { data, totalData } = this.props;
    const options = {
      selectableRows: false,
      filter: true,
      search: false,
      serverSide: true,
      filterType: "dropdown",
      onFilterChange: async (columnChanged, filterList) => {
        const indexObj = {
          gender: 8,
          campus: 22,
          donor: 23,
          studentOwner: 16,
        };
        if (columnChanged) {
          const filterValue = filterList[indexObj[columnChanged]];
          return this.getfilterApi(
            columnChanged,
            filterValue[filterValue.length - 1]
          );
        } else {
          await this.setState({
            filterColumns: [],
          });
          this.props.filterValues(filterColumns);
          return this.getStudents(0, 10);
        }
      },
      responsive: "stacked",
      rowsPerPageOptions: [10, 50, 100],
      count: totalData,
      rowsPerPage: 10,
      page: page,
      onChangeRowsPerPage: (numberOfRows) => {
        this.getStudents(this.state.page, numberOfRows);
      },
      onTableChange: (action, tableState) => {
        const { rowsPerPage, page, columns } = tableState;
        switch (action) {
          case "changePage":
            this.changePage(page, rowsPerPage);
            break;
          case "columnViewChange":
            const updatedColumns = newColumns.map((newColumn, index) => {
              if (columns[index].name === newColumn.name) {
                newColumn.options.display = columns[index].display;
              }
              return newColumn;
            })
            this.setState({
              newColumns: updatedColumns
            })
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
        columns={newColumns}
        options={options}
      />
    );
  }
}

export default withRouter(ServerSidePagination);
