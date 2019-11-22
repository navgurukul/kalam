export default (state = {
  isFetching : false,
  isAuthenticated: localStorage.getItem('jwt') ? true : false,
}, action) => {
  console.log("Something should come here.");
  console.log(action);
  switch (action.type) {
    case 'LOGIN':
      return Object.assign({}, state, {
        loggedInUser: action.user,
      })

    case 'LOGOUT':
      return Object.assign({}, state, {
        loggedInUser: null,
      })

    case 'FETCHING_STATUS': 
      return Object.assign({}, state, {
        isFetching: action.isFetchingStatus
      });
    default: return state
  }
};