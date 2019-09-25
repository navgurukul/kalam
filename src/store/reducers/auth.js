export default (state = { isFetching : false }, action) => {
  switch (action.type) {
    case 'LOGIN': return {
      uid: action.uid
    }

    case 'LOGOUT': return {}

    case 'FETCHING_STATUS': {
      return {
        isFetching: action.isFetchingStatus
      }
    }

    default: return state
  }
};