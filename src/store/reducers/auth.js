export default (
  state = {
    isFetching: false,
    isAuthenticated: !!localStorage.getItem("jwt"),
    loggedInUser: JSON.parse(localStorage.getItem("user")),
    users: null,
  },
  action
) => {
  switch (action.type) {
    case "FETCHING_STATUS":
      return { ...state, isFetching: action.isFetchingStatus };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: !!localStorage.getItem("jwt"),
        loggedInUser: JSON.parse(localStorage.getItem("user")),
      };

    case "LOGOUT": {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      return { ...state, isAuthenticated: false, loggedInUser: null };
    }
    case "SETUP_USERS": {
      return { ...state, users: action.users };
    }
    default:
      return state;
  }
};
