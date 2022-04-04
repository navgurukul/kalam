export const getData = (data) => {
  return {
    type: "GETDATA",
    data,
  };
};

export const setStudentData = (data) => {
  return {
    type: "SET_STUDENT_DATA",
    payload: data,
  };
};

export const setFilterColumns = (payload) => {
  return {
    type: "SET_FILTER_COLUMNS",
    payload,
  };
};

export const setFromDate = (payload) => {
  return {
    type: "SET_FROM_DATE",
    payload,
  };
};

export const setToDate = (payload) => {
  return {
    type: "SET_TO_DATE",
    payload,
  };
};

export const setNoOfRows = (payload) => {
  return {
    type: "SET_NO_OF_ROWS",
    payload,
  };
};

export const setPageNo = (payload) => {
  return {
    type: "SET_PAGE",
    payload,
  };
};

export const setStage = (payload) => {
  return {
    type: "SET_STAGE",
    payload,
  };
};
