import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import SearchBar from "./SearchBar";
import StudentService from "../services/StudentService";
import Loader from "./Loader";

const { permissions, qualificationKeys } = require("../config");

const baseURL = import.meta.env.VITE_API_URL;

const ServerSidePagination = ({
  columns,
  showLoader,
  params,
  dataSetup,
  filterValues,
  data,
  totalData,
  setNumbersOfRows,
  sortChange,
  numberOfRows,
}) => {
  const snackbar = useSnackbar();
  const [state, setState] = React.useState({
    page: 0,
    isData: false,
    filterColumns: [],
    mainUrl: `${baseURL}students?`,
    query: "",
    value: "",
    newColumns: columns,
  });
  const getKeyByValue = (object, value) =>
    Object.keys(object).find((key) => object[key] === value);
  const getStudents = async (page, rowsPerPage) => {
    setState((prevState) => ({
      ...prevState,
      isData: true,
    }));

    const url =
      typeof page === "string" && page.includes(baseURL)
        ? page
        : `${state.mainUrl}limit=${rowsPerPage}&page=${page}`;
    const response = await axios.get(url, params);
    const studentData = response.data.data.results.map((student) => ({
      ...student,
      qualification: qualificationKeys[student.qualification],
      studentOwner: "",
      campus: student.campus ? student.campus : null,
      donor: student.studentDonor ? student.studentDonor : null,
    }));
    setState((prevState) => ({
      ...prevState,
      isData: false,
    }));
    dataSetup(studentData, response.data.data.total);
  };

  const getStudentsDetailBySearch = async (query, value) => {
    const keys = {
      name: "searchName",
      number: "searchNumber",
    };
    setState((prevState) => {
      const newData = prevState.filterColumns.filter(
        (filterColumn) => getKeyByValue(keys, filterColumn.key) !== query
      );
      const newState = {
        filterColumns:
          value === ""
            ? [...newData]
            : [...newData, { key: keys[query], value }],
      };
      const { filterColumns } = newState;
      filterValues(filterColumns);
      const url = filterColumns.reduce((cUrl, filterColumn, index) => {
        if (index > 0) {
          return `${cUrl}&${filterColumn.key}=${filterColumn.value}`;
        }
        if (prevState.query) {
          return `${cUrl}${state.query}=${state.value}&${filterColumn.key}=${filterColumn.value}`;
        }
        return `${cUrl}${filterColumn.key}=${filterColumn.value}`;
      }, `${baseURL}students?`);
      if (filterColumns.length > 0) {
        return {
          ...prevState,
          filterColumns: newState.filterColumns,
          mainUrl: `${url}&`,
        };
      }
      return {
        ...prevState,
        filterColumns: [],
        mainUrl: `${url}`,
      };
    });
  };

  const changePage = async (page, rowsPerPage) => {
    await getStudents(page, rowsPerPage);
    setState((prevState) => ({
      ...prevState,
      page,
    }));
  };

  const getfilterApi = async (query, value) => {
    if (query === "gender" && value !== "All") {
      // eslint-disable-next-line no-param-reassign
      value = value === "Female" ? 1 : value === "Male" ? 2 : 3;
    }

    const keys = {
      gender: "gender",
      donor: "searchDonorName",
      campus: "searchCampusName",
      studentOwner: "searchOwnerName",
      status: "searchStatus",
      partnerName: "searchPartnerName",
    };

    const newData = state.filterColumns.filter(
      (filterColumn) => getKeyByValue(keys, filterColumn.key) !== query
    );
    const newState = {
      filterColumns:
        value === "All"
          ? [...newData]
          : [...newData, { key: keys[query], value }],
    };
    const { filterColumns } = newState;
    filterValues(filterColumns);
    const url = await filterColumns.reduce((cUrl, filterColumn, index) => {
      if (index > 0) {
        return `${cUrl}&${filterColumn.key}=${filterColumn.value}`;
      }
      if (state.query) {
        return `${cUrl}${state.query}=${state.value}&${filterColumn.key}=${filterColumn.value}`;
      }
      return `${cUrl}${filterColumn.key}=${filterColumn.value}`;
    }, `${baseURL}students?`);
    if (filterColumns.length > 0) {
      //getStudents(`${url}&limit=${numberOfRows}&page=0`);
      setState({
        ...state,
        filterColumns: newState.filterColumns,
        mainUrl: `${url}&`,
      });
    } else {
      //getStudents(0, numberOfRows);
      setState({
        ...state,
        filterColumns: [],
        mainUrl: `${url}`,
      });
    }
  };

  useEffect(() => {
    const { mainUrl } = state;
    const fetchData = async () =>
      getStudents(`${mainUrl}&limit=${numberOfRows}&page=0`);
    fetchData();
  }, [state.mainUrl]);

  const getSearchApi = async (query, value) => {
    await getStudentsDetailBySearch(query, value);
  };

  const CustomSnackSpinner = React.useCallback(
    () => <CircularProgress size="1.6rem" color="inherit" />,
    []
  );

  const downloadCSV = async () => {
    const snackKey = snackbar.enqueueSnackbar("Downloading CSV!", {
      variant: "info",
      action: CustomSnackSpinner,
      persist: true,
    });
    const response = await axios.get(state.mainUrl, params);
    const studentData = await response.data.data.results
      .map((student) => {
        const nStudent = StudentService.dConvert({
          ...student,
          qualification: qualificationKeys[student.qualification],
          studentOwner: "",
          campus: student.campus ? student.campus : null,
          donor: student.studentDonor ? student.studentDonor : null,
        });
        let body = "";
        state.newColumns.forEach((col, colInx) => {
          if (col.name === "donor") {
            body += `"${
              nStudent.donor
                ? student.donor.map((donor) => donor.donor).join(", ")
                : ""
            }",`;
          } else if (colInx === state.newColumns.length - 1)
            body += `"${
              !student[col.name] || student[col.name] === undefined
                ? " "
                : student[col.name]
            }"`;
          else
            body += `"${
              !student[col.name] || student[col.name] === undefined
                ? " "
                : student[col.name]
            }",`;
        });
        return body;
      })
      .join("\n");
    const csvContent = `${await state.newColumns
      .map((col) => col.label)
      .join(",")}"\n"${studentData}`;
    const encoded = new Blob([csvContent], { type: "text/csv:encoding=utf-8" });
    if (navigator.msSaveBlob) navigator.msSaveBlob(encoded, "data.csv");
    else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(encoded);
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    snackbar.closeSnackbar(snackKey);
    snackbar.enqueueSnackbar("CSV File Downloaded", {
      variant: "success",
    });
  };
  const { page, isData, newColumns } = state;
  const user = window.localStorage.user
    ? JSON.parse(window.localStorage.user).email
    : null;
  if (permissions.permissionsView.indexOf(user) > -1) {
    localStorage.setItem("permissions", JSON.stringify(permissions));
  }
  const options = {
    selectableRows: "none",
    filter: true,
    search: false,
    serverSide: true,
    filterType: "dropdown",
    onDownload: () => {
      downloadCSV();
      return false;
    },
    onColumnSortChange: (changedColumn, direction) => {
      let order = "desc";
      if (direction === "ascending") {
        order = "asc";
      }
      sortChange(changedColumn, order);
    },
    onFilterChange: async (columnChanged, filterList) => {
      const indexObj = {
        gender: 10,
        campus: 24,
        donor: 25,
        studentOwner: 18,
        status: 19,
        partnerName: 21,
      };
      if (columnChanged) {
        const filterValue = filterList[indexObj[columnChanged]];
        return getfilterApi(columnChanged, filterValue);
      }
      setState((prevState) => ({
        ...prevState,
        filterColumns: [],
        mainUrl: `${`${baseURL}students?`}`,
      }));
      const { filterColumns } = state;
      filterValues(filterColumns);
      return getStudents(0, numberOfRows);
    },
    responsive: "vertical",
    rowsPerPageOptions: [10, 50, 100],
    count: totalData,
    rowsPerPage: numberOfRows,
    page,
    onChangeRowsPerPage: (newNumberOfRows) => {
      setNumbersOfRows(newNumberOfRows);
      getStudents(state.page, newNumberOfRows);
    },
    onTableChange: (action, tableState) => {
      const {
        rowsPerPage,
        page: tablePage,
        columns: tableColumns,
      } = tableState;
      let updatedColumns;
      switch (action) {
        case "changePage":
          changePage(tablePage, rowsPerPage);
          break;
        case "columnViewChange":
          updatedColumns = newColumns.map((newColumn, index) => {
            const nColumn = { ...newColumn };
            if (columns[index].name === newColumn.name) {
              nColumn.options.display = tableColumns[index].display;
            }
            return nColumn;
          });
          setState((prevState) => ({
            ...prevState,
            newColumns: updatedColumns,
          }));
          break;
        default:
          break;
      }
    },
    textLabels: {
      body: {
        noMatch: showLoader ? (
          <Loader />
        ) : (
          "Sorry, there is no matching data to display"
        ),
      },
    },
  };
  return (
    <MUIDataTable
      title={<SearchBar searchByName={getSearchApi} />}
      data={isData ? [] : data}
      columns={newColumns}
      options={options}
    />
  );
};

// export default withSnackbar(withRouter(ServerSidePagination));
export default ServerSidePagination;
