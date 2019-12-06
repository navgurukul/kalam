export default (state = {
  isFetching : false,
  isAuthenticated: localStorage.getItem('jwt') ? true : false,
  loggedInUser: JSON.parse(localStorage.getItem('user')),
  users: null,
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
    case 'LOGOUT': {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user')
      return Object.assign({}, state, {
        isAuthenticated: false,
        loggedInUser: null
      })
    }
    case 'SETUP_USERS': {
      return Object.assign({}, state, {
        users: action.users
      })
    }
    default: return state
  }
};