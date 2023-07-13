import React from "react";
import MUIDataTable from "mui-datatables";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import SearchBar from "../smallComponents/SearchBar";
import Loader from "../ui/Loader";
import {
  setFilterColumns,
  setNoOfRows,
  setPageNo,
} from "../../store/slices/studentSlice";
import { qualificationKeys } from "../../utils/constants";
import { dConvert, getColumnIndex } from "../../utils";

const baseURL = import.meta.env.VITE_API_URL;

const ServerSidePagination = ({
  defaultColumns,
  showLoader,
  params,
  sortChange,
  customOptions,
}) => {
  const snackbar = useSnackbar();
  const { filterColumns, studentData, totalData, numberOfRows, page, url } =
    useSelector((state) => state.students);
  const dispatch = useDispatch();
  const setFilters = (data) => dispatch(setFilterColumns(data));
  const setRows = (data) => dispatch(setNoOfRows(data));
  const setPage = (data) => dispatch(setPageNo(data));
  const [columns, setColumns] = React.useState(defaultColumns ?? []);
  const getKeyByValue = React.useCallback(
    (object, value) => Object.keys(object).find((key) => object[key] === value),
    []
  );

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
    const newUrl = filterColumns.reduce((cUrl, filterColumn, index) => {
      if (index > 0) {
        return `${cUrl}&${filterColumn.key}=${filterColumn.value}`;
      }
      return `${cUrl}${filterColumn.key}=${filterColumn.value}`;
    }, `${baseURL}students?`);

    if (newColumns.length > 0) {
      setFilters({ filterColumns: newState.filterColumns, url: `${newUrl}&` });
    } else {
      setFilters({ filterColumns: [], url: `${newUrl}` });
    }
  };

  const changePage = async (newPage) => setPage(newPage);

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
    const newUrl = await filterColumns.reduce((cUrl, filterColumn, index) => {
      if (index > 0) {
        return `${cUrl}&${filterColumn.key}=${encodeURIComponent(
          filterColumn.value
        )}`;
      }
      return `${cUrl}${filterColumn.key}=${encodeURIComponent(
        filterColumn.value
      )}`;
    }, `${baseURL}students?`);
    if (newColumns.length > 0) {
      setFilters({ filterColumns: newState.filterColumns, url: `${newUrl}&` });
    } else {
      setFilters({ filterColumns: [], url: `${newUrl}` });
    }
  };

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
        const nStudent = dConvert({
          ...student,
          qualification: qualificationKeys[student.qualification],
          studentOwner: "",
          campus: student.campus ? student.campus : null,
          donor: student.studentDonor ? student.studentDonor : null,
        });
        let body = "";
        columns.forEach((col, colInx) => {
          if (col.name === "donor") {
            body += `"${nStudent.donor !== null && nStudent.donor !== undefined
                ? nStudent.donor.map((donor) => donor.donor).join(", ")
                : ""
              }",`;
          } else if (colInx === columns.length - 1)
            body += `"${!nStudent[col.name] || nStudent[col.name] === undefined
                ? " "
                : nStudent[col.name]
              }"`;
          else
            body += `"${!nStudent[col.name] || nStudent[col.name] === undefined
                ? " "
                : nStudent[col.name]
              }",`;
        });
        return body;
      })
      .join("\n");
    const csvContent = `${await columns
      .map((col) => col.label)
      .join(",")}"\n"${fullStudentData}`;
    const encoded = new Blob([csvContent], { type: "text/csv:encoding=utf-8" });
    if (navigator.msSaveBlob) navigator.msSaveBlob(encoded, "data.csv");
    else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
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

  // function dateSort(column, direction) {
  //   return (a, b) => {
  //     const dateA = new Date(a[column]);
  //     const dateB = new Date(b[column]);
  //     if (direction === 'ascending') {
  //       return dateA - dateB;
  //     } else {
  //       return dateB - dateA;
  //     }
  //   }
  // }

  // ...

  // onColumnSortChange: (changedColumn, direction) => {
  //   if (changedColumn === 'dateColumn') {
  //     const sortFunction = dateSort('dateColumn', direction);
  //     sortChange(changedColumn, sortFunction);
  //   } else {
  //     sortChange(changedColumn, direction === 'ascending' ? 'asc' : 'desc');
  //   }
  // }

  const options = React.useMemo(
    () => ({
      selectableRows: "none",
      filter: true,
      search: false,
      serverSide: true,
      onDownload: () => {
        downloadCSV();
        return false;
      },
      // onColumnSortChange: (changedColumn, direction) => {
      //   if (changedColumn === 'dateColumn') {
      //     const sortFunction = dateSort('dateColumn', direction);
      //     sortChange(changedColumn, sortFunction);
      //   } else {
      //     sortChange(changedColumn, direction === 'ascending' ? 'asc' : 'desc');
      //   }
      // }
      onColumnSortChange: (changedColumn, direction) =>
        sortChange(changedColumn, direction === "ascending" ? "asc" : "desc"),
      onFilterChange: async (columnChanged, filterList) => {
        if (columnChanged) {
          const filterValue =
            filterList[getColumnIndex(columns, columnChanged)][0];
          if (filterValue === undefined)
            return getfilterApi(columnChanged, "All");
          return getfilterApi(columnChanged, filterValue);
        }

        setFilters({ filterColumns: [], url: `${baseURL}students?` });
      },
      responsive: "vertical",
      rowsPerPageOptions: [10, 50, 100],
      tableBodyMaxHeight: "64vh",
      count: totalData,
      rowsPerPage: numberOfRows,
      page,
      onChangeRowsPerPage: (newNumberOfRows) => setRows(newNumberOfRows),
      onChangePage: changePage,
      onViewColumnsChange: (changedColumn, action) =>
        setColumns((prevColumns) => {
          const updatedColumns = [...prevColumns];
          const updatedColumnIndex = updatedColumns.findIndex(
            (currentCol) => currentCol.name === changedColumn
          );
          updatedColumns[updatedColumnIndex].options.display = action === "add";
          return updatedColumns;
        }),
      textLabels: {
        body: {
          noMatch: showLoader ? (
            <Loader />
          ) : (
            "Sorry, there is no matching data to display"
          ),
        },
      },
      ...(customOptions || {}),
    }),
    [totalData, numberOfRows, page, showLoader, customOptions]
  );
  return (
    <MUIDataTable
      title={<SearchBar searchByName={getSearchApi} />}
      data={studentData}
      columns={columns}
      options={options}
    />
  );
};

export default ServerSidePagination;
