const baseUrl = process.env.API_URL;

export default (
  state = {
    getData: [],
    studentData: [],
    filterColumns: [],
    url: `${baseUrl}students?`,
    totalData: 0,
    fromDate: null,
    toDate: null,
    numberOfRows: 10,
    page: 0,
    stage: [],
  },
  action
) => {
  switch (action.type) {
    case "GETDATA":
      return Object.assign({}, state, {
        getData: action.data,
      });

    case "SET_STUDENT_DATA":
      return {
        ...state,
        studentData: action.payload.data,
        totalData: action.payload.totalData,
      };
    case "SET_FILTER_COLUMNS":
      return {
        ...state,
        filterColumns: action.payload.filterColumns,
        url: action.payload.url,
      };

    case "SET_FROM_DATE":
      return {
        ...state,
        fromDate: action.payload,
      };
    case "SET_TO_DATE":
      return {
        ...state,
        toDate: action.payload,
      };
    case "SET_NO_OF_ROWS":
      return {
        ...state,
        numberOfRows: action.payload,
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };
    case "SET_STAGE":
      return {
        ...state,
        stage: action.payload,
      };
    default:
      return state;
  }
};
