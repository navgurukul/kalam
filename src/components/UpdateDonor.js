import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";

const baseURL = process.env.API_URL;
const animatedComponents = makeAnimated();

const UpdateDonor = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    data: null,
    defaultData: props.value,
  });

  const getDonorsId = (data) => {
    let result;
    result = data.map((item) => item.value);
    return result;
  };

  const updateDonor = () => {
    const { rowMetatable } = props;
    const data = getDonorsId(state.data);
    const student_id = rowMetatable.rowData[0];
    axios
      .put(`${baseURL}students/${student_id}`, { donor: data })
      .then((res) => {
        enqueueSnackbar(res.data.data, {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar(`Error in updating donor`, {
          variant: "unsuccess!",
        });
      });
  };

  const handleChange = (event) => {
    const { value, change } = props;
    let rename = [];
    if (event) {
      rename = event.map((item) => {
        return { id: item.value, donor: item.label };
      });
    }
    if (value && event === null) {
      setState({ ...state, data: [] });
    } else {
      setState({ ...state, data: event });
    }
    change(rename);
  };

  const { allOptions, value } = props;
  return (
    <div>
      <Select
        className={"filterSelectStage"}
        components={{ animatedComponents }}
        isMulti
        value={
          value
            ? value.map((x) => {
                return { value: x.id, label: x.donor };
              })
            : value
        }
        onChange={handleChange}
        options={allOptions.map((x) => {
          return { value: x.id, label: x.name };
        })}
        isClearable={false}
      ></Select>
      <Button
        color="primary"
        disabled={
          JSON.stringify(state.defaultData) !== JSON.stringify(value)
            ? false
            : true
        }
        onClick={updateDonor}
      >
        Update
      </Button>
    </div>
  );
};

export default UpdateDonor;
