export default (state = {
  isFetching : false,
  isAuthenticated: localStorage.getItem('jwt') ? true : false,
  loggedInUser: JSON.parse(localStorage.getItem('user'))
}, action) => {
  switch (action.type) {
    case 'FETCHING_STATUS': 
      return Object.assign({}, state, {
        isFetching: action.isFetchingStatus
      });
    case 'LOGIN':
      return Object.assign({}, state, {
        isAuthenticated: localStorage.getItem('jwt') ? true: false,
        loggedInUser: JSON.parse(localStorage.getItem('user'))
      })
    default: return state
  }
};