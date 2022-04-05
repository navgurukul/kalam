import StudentService from "../services/StudentService";

export const dataSetup = (data, totalData, loggedInUser) => {
  if (data.length > 0) {
    // for (let i = 0; i < data.length; i++) {
    //   data[i] = StudentService.dConvert(data[i]);
    // }
    const newData = data.map((v) => ({
      ...StudentService.dConvert(v),
      loggedInUser: loggedInUser.email.split("@")[0],
    }));
    return { data: newData, totalData };
  }
  return { data: [], totalData: 0 };
};

export const dummy = () => {};
