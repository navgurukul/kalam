export default (
  state = {
    getData: [],
  },
  action
) => {
  switch (action.type) {
    case "GETDATA":
      return Object.assign({}, state, {
        getData: action.data,
      });
    default:
      return state;
  }
};
