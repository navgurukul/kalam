export default (
  state = {
    getData: [],
  },
  action
) => {
  switch (action.type) {
    case "GETDATA":
      return { ...state, getData: action.data };
    default:
      return state;
  }
};
