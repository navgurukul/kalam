import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import SelectReact from "../smallComponents/SelectReact";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchStudents } from "../../store/slices/studentSlice";

const baseURL = import.meta.env.VITE_API_URL;

const SchoolFilterList = ({ filterlist, onChange, index, column, Lables }) => {
  const { loggedInUser } = useSelector((state) => state.auth);
  //   const dispatch = useDispatch();
  //   const { dataType: paramDataType } = useParams();

  const [schoolList, setSchoolList] = React.useState([]);
  //   let dataType = paramDataType;

  const fetchCampus = async () => {
    try {
      // const adminRole = roles.findIndex(
      //     (roleItem) => roleItem.role === "Admin"
      //   );
      //   const role = roles.find((roleItem) => roleItem.role === "school");
      //   const access = role?.access?.map((accessItem) => accessItem.access) || [];
      const dataURL = `${baseURL}school`;
      const response = await axios.get(dataURL);
      //   console.log("schoolList in SchoolFilterList", response.data);
      setSchoolList(response.data);
    } catch (e) {
      // console.error(e);
    }
  };
  useEffect(() => {
    (async () => {
      await fetchCampus();
    })();
  }, [loggedInUser]);

  //   useEffect(() => {
  //     if (loggedInUser) dispatch(fetchStudents({ dataType })); //softwareCourse
  //   }, [loggedInUser, schoolList]);

  return (
    <div>
      <label style={Lables}>School</label>
      <SelectReact
        options={[{ name: "All" }, ...schoolList].map((x) => ({
          value: x.name,
          label: x.name,
        }))}
        filterList={filterlist}
        onChange={onChange}
        index={index}
        column={column}
        value={filterlist[index].length === 0 ? "All" : filterlist[index]}
      />
    </div>
  );
};

export default SchoolFilterList;
