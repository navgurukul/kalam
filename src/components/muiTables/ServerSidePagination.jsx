import React from "react";
import MUIDataTable from "mui-datatables";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import SearchBar from "../smallComponents/SearchBar";
import StudentService from "../../services/StudentService";
import Loader from "../ui/Loader";
import {
  setFilterColumns,
  setNoOfRows,
  setPageNo,
} from "../../store/slices/studentSlice";
import { qualificationKeys } from "../../utils/constants";
import { getColumnIndex } from "../../utils";

const baseURL = import.meta.env.VITE_API_URL;

const ServerSidePagination = ({ columns, showLoader, params, sortChange }) => {
  const snackbar = useSnackbar();
  const { filterColumns, studentData, totalData, numberOfRows, page, url } =
    useSelector((state) => state.students);
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
    newColumns: columns,
    vertical: false,
  });
  const getKeyByValue = (object, value) =>
    Object.keys(object).find((key) => object[key] === value);

  const getStudentsDetailBySearch = async (query, value) => {
    const keys = {
      name: "searchName",
      number: "searchNumber",
    };
    const newData = filterColumns.filter(
      (filterColumn) => getKeyByValue(keys, filterColumn.key) !== query
    );
    const newState = {
      filterColumns:
        value === "" ? [...newData] : [...newData, { key: keys[query], value }],
    };
    const { filterColumns: newColumns } = newState;
    // filterValues(filterColumns);
    const newUrl = filterColumns.reduce((cUrl, filterColumn, index) => {
      if (index > 0) {
        return `${cUrl}&${filterColumn.key}=${filterColumn.value}`;
      }
      if (state.query) {
        return `${cUrl}${state.query}=${state.value}&${filterColumn.key}=${filterColumn.value}`;
      }
      return `${cUrl}${filterColumn.key}=${filterColumn.value}`;
    }, `${baseURL}students?`);

    if (newColumns.length > 0) {
      setFilters({ filterColumns: newState.filterColumns, url: `${newUrl}&` });
    } else {
      setFilters({ filterColumns: [], url: `${newUrl}` });
      setState({
        ...state,
        filterColumns: [],
        mainUrl: `${newUrl}`,
      });
    }
  };

  const changePage = async (newPage) => {
    // await getStudents(page, rowsPerPage);
    setPage(newPage);
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

    const newData = filterColumns.filter(
      (filterColumn) => getKeyByValue(keys, filterColumn.key) !== query
    );
    const newState = {
      filterColumns:
        value === "All"
          ? [...newData]
          : [
              ...newData,
              { key: keys[query], value: encodeURIComponent(value) },
            ],
    };
    const { filterColumns: newColumns } = newState;
    // filterValues(filterColumns);
    const newUrl = await filterColumns.reduce((cUrl, filterColumn, index) => {
      if (index > 0) {
        return `${cUrl}&${filterColumn.key}=${encodeURIComponent(
          filterColumn.value
        )}`;
      }
      if (state.query) {
        return `${cUrl}${state.query}=${state.value}&${
          filterColumn.key
        }=${encodeURIComponent(filterColumn.value)}`;
      }
      return `${cUrl}${filterColumn.key}=${encodeURIComponent(
        filterColumn.value
      )}`;
    }, `${baseURL}students?`);
    if (newColumns.length > 0) {
      //getStudents(`${url}&limit=${numberOfRows}&page=0`);
      setFilters({ filterColumns: newState.filterColumns, url: `${newUrl}&` });
      setState({
        ...state,
        filterColumns: newState.filterColumns,
        mainUrl: `${newUrl}&`,
      });
    } else {
      //getStudents(0, numberOfRows);
      setFilters({ filterColumns: [], url: `${newUrl}` });
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
  //     getStudents(`${mainUrl}&limit=${numberOfRows}&page=0`);
  //   fetchData();
  // }, [state.mainUrl]);

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
    const response = await axios.get(url, params);
    const fullStudentData = await response.data.data.results
      .map((student) => {
        // eslint-disable-next-line import/no-named-as-default-member
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
              nStudent.donor !== null && nStudent.donor !== undefined
                ? nStudent.donor.map((donor) => donor.donor).join(", ")
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
      .join(",")}"\n"${fullStudentData}`;
    const encoded = new Blob([csvContent], { type: "text/csv:encoding=utf-8" });
    if (navigator.msSaveBlob) navigator.msSaveBlob(encoded, "data.csv");
    else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const downloadUrl = URL.createObjectURL(encoded);
        link.setAttribute("href", downloadUrl);
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
  const { isData, newColumns } = state;
  // const user = window.localStorage.user
  //   ? JSON.parse(window.localStorage.user).email
  //   : null;
  // if (permissions.permissionsView.indexOf(user) > -1) {
  //   localStorage.setItem("permissions", JSON.stringify(permissions));
  // }
  const options = {
    selectableRows: "none",
    filter: true,
    search: false,
    serverSide: true,
    // filterType: "dropdown",
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
      // const indexObj = {
      //   gender: getColumnIndex,
      //   campus: 25,
      //   donor: 26,
      //   studentOwner: 19,
      //   status: 20,
      //   partnerName: 22,
      // };
      if (columnChanged) {
        const filterValue =
          filterList[getColumnIndex(newColumns, columnChanged)][0];
        if (filterValue === undefined)
          return getfilterApi(columnChanged, "All");
        return getfilterApi(columnChanged, filterValue);
      }
      setState((prevState) => ({
        ...prevState,
        filterColumns: [],
        mainUrl: `${`${baseURL}students?`}`,
      }));

      setFilters({ filterColumns: [], url: `${baseURL}students?` });
      // const { filterColumns } = state;
      // filterValues(filterColumns);
      // return getStudents(0, numberOfRows);
    },
    responsive: "vertical",
    rowsPerPageOptions: [10, 50, 100],
    tableBodyMaxHeight: "64vh",
    count: totalData,
    rowsPerPage: numberOfRows,
    page,
    onChangeRowsPerPage: (newNumberOfRows) => {
      // setNumbersOfRows(newNumberOfRows);
      setRows(newNumberOfRows);
      // getStudents(state.page, newNumberOfRows);
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
      data={isData ? [] : studentData}
      columns={newColumns}
      options={options}
    />
  );
};

// export default withSnackbar(withRouter(ServerSidePagination));
export default ServerSidePagination;
