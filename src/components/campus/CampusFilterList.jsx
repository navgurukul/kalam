import React, { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SelectReact from "../smallComponents/SelectReact";

const baseURL = import.meta.env.VITE_API_URL;

const CampusFilterList = ({ filterlist, onChange, index, column, Lables }) => {
  const { loggedInUser } = useSelector((state) => state.auth);

  const [campusList, setCampusList] = React.useState([]);

  const fetchCampus = async () => {
    try {
      const dataURL = `${baseURL}campus`;
      const response = await axios.get(dataURL);
      const campus = response.data.data;
      setCampusList([{ campus: "All" }, ...campus]);
    } catch (e) {
      // console.error(e);
    }
  };
  useEffect(() => {
    (async () => {
      await fetchCampus();
    })();
  }, [loggedInUser]);

  return (
    <div>
      <label style={Lables}>Campus</label>
      <SelectReact
        options={[{ name: "All" }, ...campusList].map((x) => ({
          value: x.campus,
          label: x.campus,
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

export default CampusFilterList;
