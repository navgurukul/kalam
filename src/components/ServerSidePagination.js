import React from "react";
import MUIDataTable from "mui-datatables";
import { qualificationKeys } from "../config";
import { useSnackbar } from "notistack";
import axios from "axios";
import Loader from "./Loader";
import SearchBar from "./SearchBar";
import { permissions } from "../config";
import StudentService from "../services/StudentService";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterColumns,
  setNoOfRows,
  setPageNo,
} from "../store/actions/data";

const baseURL = process.env.API_URL;

const ServerSidePagination = (props) => {
  const snackbar = useSnackbar();
  const { filterColumns, studentData, totalData, numberOfRows } = useSelector(
    (state) => state.data
  );
  const dispatch = useDispatch();
  const setFilters = (data) => dispatch(setFilterColumns(data));
  const setRows = (data) => dispatch(setNoOfRows(data));
  const setPage = (data) => dispatch(setPageNo(data));
  const [state, setState] = React.useState({
    // page: 0,
    isData: false,
    // filterColumns: [],
    // mainUrl: `${baseURL}students?`,
    query: "",
    value: "",
    newColumns: props.columns,
  });
  const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };
  // const getStudents = async (page, rowsPerPage) => {
  //   const { params, dataSetup } = props;
  //   setState((prevState) => ({
  //     ...prevState,
  //     isData: true,
  //   }));

  //   const url =
  //     typeof page === "string" && page.includes(baseURL)
  //       ? page
  //       : `${state.mainUrl}limit=${rowsPerPage}&page=${page}`;
  //   const response = await axios.get(url, params);
  //   const studentData = response.data.data.results.map((student) => {
  //     return {
  //       ...student,
  //       qualification: qualificationKeys[student.qualification],
  //       studentOwner: "",
  //       campus: student.campus ? student.campus : null,
  //       donor: student.studentDonor ? student.studentDonor : null,
  //     };
  //   });
  //   setState((prevState) => ({
  //     ...prevState,
  //     isData: false,
  //   }));
  //   // dataSetup(studentData, response.data.data.total);
  // };

  const getStudentsDetailBySearch = async (query, value) => {
    const keys = {
      name: "searchName",
      number: "searchNumber",
    };

    const newData = filterColumns.filter(
      (filterColumn) => getKeyByValue(keys, filterColumn.key) !== query
    );
    console.log(filterColumns, newData);
    let newState = {
      filterColumns:
        value === ""
          ? [...newData]
          : [...newData, { key: keys[query], value: value }],
    };
    const { filterColumns: newColumns } = newState;
    // props.filterValues(filterColumns);
    let url = newColumns.reduce((cUrl, filterColumn, index) => {
      if (index > 0) {
        return (cUrl += `&${filterColumn.key}=${filterColumn.value}`);
      } else {
        if (state.query) {
          return (cUrl += `${state.query}=${state.value}&${filterColumn.key}=${filterColumn.value}`);
        } else {
          return (cUrl += `${filterColumn.key}=${filterColumn.value}`);
        }
      }
    }, `${baseURL}students?`);

    if (newColumns.length > 0) {
      //getStudents(`${url}&limit=${numberOfRows}&page=0`);
      setFilters({ filterColumns: newState.filterColumns, url: `${url}&` });
      // setState({
      //   ...state,
      //   filterColumns: newState.filterColumns,
      //   mainUrl: `${url}&`,
      // });
    } else {
      setFilters({ filterColumns: [], url: `${url}` });
      //getStudents(0, numberOfRows);
      setState({
        ...state,
        filterColumns: [],
        mainUrl: `${url}`,
      });
    }

    // setState((prevState) => {

    //   if (filterColumns.length > 0) {
    //     return {
    //       ...prevState,
    //       filterColumns: newState.filterColumns,
    //       mainUrl: `${url}&`,
    //     };
    //   } else {
    //     return {
    //       ...prevState,
    //       filterColumns: [],
    //       mainUrl: `${url}`,
    //     };
    //   }
    // });
  };

  const changePage = async (page) => {
    // await getStudents(page, rowsPerPage);
    setPage(page);
    setState((prevState) => ({
      ...prevState,
      page: page,
    }));
  };

  const getfilterApi = async (query, value) => {
    if (query === "gender" && value !== "All") {
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

    const newData = filterColumns.filter(
      (filterColumn) => getKeyByValue(keys, filterColumn.key) !== query
    );
    let newState = {
      filterColumns:
        value === "All"
          ? [...newData]
          : [...newData, { key: keys[query], value: value }],
    };
    const { filterColumns: newColumns } = newState;
    // props.filterValues(filterColumns);
    let url = await newColumns.reduce((cUrl, filterColumn, index) => {
      if (index > 0) {
        return (cUrl += `&${filterColumn.key}=${filterColumn.value}`);
      } else {
        if (state.query) {
          return (cUrl += `${state.query}=${state.value}&${filterColumn.key}=${filterColumn.value}`);
        } else {
          return (cUrl += `${filterColumn.key}=${filterColumn.value}`);
        }
      }
    }, `${baseURL}students?`);
    if (newColumns.length > 0) {
      //getStudents(`${url}&limit=${numberOfRows}&page=0`);
      setFilters({ filterColumns: newState.filterColumns, url: `${url}&` });
      setState({
        ...state,
        filterColumns: newState.filterColumns,
        mainUrl: `${url}&`,
      });
    } else {
      //getStudents(0, numberOfRows);
      setFilters({ filterColumns: [], url: `${url}` });
      setState({
        ...state,
        filterColumns: [],
        mainUrl: `${url}`,
      });
    }
  };

  // useEffect(() => {
  //   const { mainUrl } = state;
  //   const fetchData = async () =>
  //     await getStudents(`${mainUrl}&limit=${numberOfRows}&page=0`);
  //   fetchData();
  // }, [state.mainUrl]);

  const getSearchApi = async (query, value) => {
    await getStudentsDetailBySearch(query, value);
  };

  const downloadCSV = async () => {
    const CustomSnack = () => (
      <CircularProgress size="1.6rem" color="inherit" />
    );
    const snackKey = snackbar.enqueueSnackbar("Downloading CSV!", {
      variant: "info",
      action: CustomSnack,
      persist: true,
    });
    const response = await axios.get(state.mainUrl, props.params);
    const studentData = await response.data.data.results
      .map((student) => {
        student = StudentService.dConvert({
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
              student["donor"]
                ? student["donor"].map((donor) => donor.donor).join(", ")
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
              !student[col.name] || student[col.name] == undefined
                ? " "
                : student[col.name]
            }",`;
        });
        return body;
      })
      .join("\n");
    let csvContent = `${await state.newColumns
      .map((col) => col.label)
      .join(",")}"\n"${studentData}`;
    let encoded = new Blob([csvContent], { type: "text/csv:encoding=utf-8" });
    if (navigator.msSaveBlob) navigator.msSaveBlob(encoded, "data.csv");
    else {
      let link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        let url = URL.createObjectURL(encoded);
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

  const { sortChange } = props;
  const options = {
    selectableRows: false,
    filter: true,
    sort: false,
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
      } else {
        setState((prevState) => ({
          ...prevState,
          filterColumns: [],
          mainUrl: `${`${baseURL}students?`}`,
        }));
        // const { filterColumns } = state;
        setFilters({ filterColumns: [], url: `${baseURL}students?` });
        // props.filterValues(filterColumns);
        // return getStudents(0, numberOfRows);
      }
    },
    responsive: "stacked",
    rowsPerPageOptions: [10, 50, 100],
    count: totalData,
    rowsPerPage: numberOfRows,
    page: page,
    onChangeRowsPerPage: (numberOfRows) => {
      setRows(numberOfRows);
      // getStudents(state.page, numberOfRows);
    },
    onTableChange: (action, tableState) => {
      const { rowsPerPage, page, columns } = tableState;
      let updatedColumns;
      switch (action) {
        case "changePage":
          changePage(page, rowsPerPage);
          break;
        case "columnViewChange":
          updatedColumns = newColumns.map((newColumn, index) => {
            if (columns[index].name === newColumn.name) {
              newColumn.options.display = columns[index].display;
            }
            return newColumn;
          });
          setState((prevState) => ({
            ...prevState,
            newColumns: updatedColumns,
          }));
          break;
      }
    },
    textLabels: {
      body: {
        noMatch: props.showLoader ? (
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
      data={isData ? [] : studentData}
      columns={newColumns}
      options={options}
    />
  );
};

// export default withSnackbar(withRouter(ServerSidePagination));
export default ServerSidePagination;
