export default (state = { isFetching : false }, action) => {
  switch (action.type) {
    case 'LOGIN': return {
      uid: action.uid
    }

    case 'LOGOUT': return {}

    case 'FETCHING_STATUS': {
      console.log(action.isFetchingStatus, " status changing")
      return {
        isFetching: action.isFetchingStatus
      }
    }

    default: return state
  }
};