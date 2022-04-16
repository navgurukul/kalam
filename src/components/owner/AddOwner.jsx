import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import { makeStyles } from "@mui/styles";
import {
  Button,
  IconButton,
  Modal,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@mui/material";
import Select from "react-select";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.VITE_API_URL;

const stageOptions = [
  {
    value: "EnglishInterview",
    label: "English Interview Pending (2nd Round)",
  },
  {
    value: "AlgebraInterview",
    label: "Algebra Interview Pending (3rd Round)",
  },
  {
    value: "CultureFitInterview",
    label: "Culture Fit Interview Pending (4th Round)",
  },
];

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    maxWidth: 400,
  },
  root: {
    maxWidth: 450,
    margin: "auto",
    marginTop: "20px",
  },

  addIcon: {
    position: "absolute",
    marginLeft: "60%",
    top: "9px",
  },
  text: {
    marginBottom: theme.spacing(1),
  },
  btn: {
    // marginTop: theme.spacing(4),
  },
}));

const AddOwner = (props) => {
  const { isEdit, disabled } = props;

  const classes = useStyles();
  const snackbar = useSnackbar();
  const [state, setState] = React.useState({
    dialogOpen: false,
    data: [],
    ownerName: null,
    ownerId: null,
    availablity: null,
    stage: null,
    limit: undefined,
    gender: null,
  });

  // componentDidMount() {
  //   this.getUsers();
  // }

  const getUsers = (signal) => {
    axios.get(`${baseUrl}users/getall`, { signal }).then((response) => {
      setState({
        ...state,
        data: response.data.data,
      });
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    getUsers(controller.signal);
    return () => controller.abort();
  }, []);

  const createOwner = () => {
    const { ownerName, gender, ownerId, availablity, stage, limit } = state;
    const { ownerData, getUpdatedData } = props;
    const duplicateData = ownerData.filter((x) => x.user.mail_id === ownerName);
    if (duplicateData.length > 0) {
      snackbar.enqueueSnackbar(`${ownerName} exists in owner dashboard.`, {
        variant: "error",
      });
    } else if (ownerName && ownerId && availablity && stage) {
      axios
        .post(`${baseUrl}owner`, {
          user_id: ownerId,
          available: availablity === "Yes",
          max_limit: limit || undefined,
          type: stage,
          gender,
        })
        .then((response) => {
          snackbar.enqueueSnackbar(`Owner Successfull created !`, {
            variant: "success",
          });
          setState({
            ...state,
            dialogOpen: false,
          });
          getUpdatedData(response.data.data[0], false);
        });
    } else {
      snackbar.enqueueSnackbar(`Please fill all fields`, {
        variant: "error",
      });
    }
  };

  const getOwner = async (ownerId) => {
    const response = await axios.get(`${baseUrl}owner/${ownerId}`);
    const data = response.data.data[0];
    await setState((prevState) => ({
      ...prevState,
      ownerName: data.user.mail_id,
      gender: data.gender,
      availablity: data.available ? "Yes" : "No",
      stage: data.type,
      limit: data.max_limit,
      ownerId: data.id,
    }));
  };

  const editOwner = () => {
    const { ownerName, gender, ownerId, availablity, stage, limit } = state;
    const { getUpdatedData } = props;
    if (ownerName && ownerId && availablity && stage) {
      axios
        .put(`${baseUrl}owner/${ownerId}`, {
          available: availablity === "Yes",
          max_limit: limit || undefined,
          type: stage,
          gender,
        })
        .then((response) => {
          snackbar.enqueueSnackbar(`Owner Successfull updated !`, {
            variant: "success",
          });
          setState({
            ...state,
            dialogOpen: false,
          });
          getUpdatedData(response.data.data[0], true);
        })
        .catch(() => {
          snackbar.enqueueSnackbar(`Interviews limit  should not be 0`, {
            variant: "error",
          });
          setState({
            ...state,
            dialogOpen: false,
          });
          //getUpdatedData(response.data.data[0], true);
        });
    } else {
      snackbar.enqueueSnackbar(`Please fill all fields`, {
        variant: "error",
      });
    }
  };

  const openDialog = async () => {
    const { ownerId } = props;
    setState({
      ...state,
      dialogOpen: true,
    });
    if (isEdit) await getOwner(ownerId);
  };
  // const openDialog = () => {
  //   setState({
  //     ...state,
  //     dialogOpen: true,
  //   });
  // };

  const handleClose = () => {
    setState({
      ...state,
      dialogOpen: false,
    });
  };

  const handleChange = (name) => (event) => {
    const { value, label } = event;
    if (name === "ownerName") {
      setState({ ...state, ownerName: label, ownerId: value });
    } else {
      setState({
        ...state,
        [name]: value || event.target.value,
      });
    }
  };

  const getStage = (event) => {
    const newStages = event && event.map((x) => x.value);
    setState({
      ...state,
      stage: newStages,
    });
  };
  const { data, ownerName, gender, ownerId, availablity, stage, limit } = state;
  let ownerGender = "Na";
  if (gender === 1) ownerGender = "Female";
  else if (gender === 2) ownerGender = "Male";
  else if (gender === 3) ownerGender = "Transgender";
  else ownerGender = "NA";
  // const columns = [
  //   {
  //     name: "student_name",
  //     label: "name",
  //     options: {
  //       filter: false,
  //       sort: false,
  //     },
  //   },
  //   {
  //     name: "topic_name",
  //     label: "topic name",
  //     options: {
  //       filter: false,
  //       sort: false,
  //     },
  //   },
  //   {
  //     name: "name",
  //     label: "Phone Number",
  //     options: {
  //       filter: false,
  //       sort: false,
  //     },
  //   },
  //   {
  //     name: "start_time",
  //     label: "start time",
  //     options: {
  //       filter: false,
  //       sort: false,
  //     },
  //   },
  //   {
  //     name: "end_time_expected",
  //     label: "end time",
  //     options: {
  //       filter: false,
  //       sort: false,
  //     },
  //   },
  //   {
  //     name: "on_date",
  //     label: "date",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       // eslint-disable-next-line arrow-body-style
  //       customBodyRender: (value) => {
  //         return <p>{value.split("T")[0]}</p>;
  //       },
  //     },
  //   },
  // ];
  // const month = {
  //   Jan: `01`,
  //   Feb: `02`,
  //   Mar: `03`,
  //   Apr: `04`,
  //   May: `05`,
  //   Jun: `06`,
  //   Jul: `07`,
  //   Aug: `08`,
  //   Sep: `09`,
  //   Oct: `10`,
  //   Nov: `11`,
  //   Dec: `12`,
  // };

  return (
    <div>
      {isEdit ? (
        <IconButton disabled={disabled} onClick={openDialog}>
          <EditIcon />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={openDialog}
          className={classes.btn}
        >
          Add Owner
        </Button>
      )}
      <Modal open={state.dialogOpen} onClose={handleClose} onOpen={openDialog}>
        <Card className={classes.root}>
          <form className={classes.container}>
            <FormControl>
              <Select
                name="ownerName"
                value={ownerName && { value: ownerId, label: ownerName }}
                onChange={handleChange("ownerName")}
                options={data.map((x) => ({ value: x.id, label: x.user }))}
                placeholder="Select Owner"
                isClearable={false}
                closeMenuOnSelect
                isSearchable
                isDisabled={!!isEdit}
              />
              <FormHelperText className={classes.text} id="my-helper-text">
                Please select owner
              </FormHelperText>
            </FormControl>

            <FormControl>
              <Select
                name="gender"
                value={
                  gender && {
                    value: ownerId,
                    label: ownerGender,
                  }
                }
                onChange={handleChange("gender")}
                options={[
                  { value: 1, label: "Female" },
                  { value: 2, label: "Male" },
                  { value: 3, label: "Transgender" },
                ].map((x) => ({ value: x.value, label: x.label }))}
                placeholder="Select Gender"
                isClearable={false}
                closeMenuOnSelect
                isSearchable
                // isDisabled={isEdit ? true : false}
              />
              <FormHelperText className={classes.text} id="my-helper-text">
                Please select your gender
              </FormHelperText>
            </FormControl>

            <FormControl>
              <Select
                name="availablity"
                value={
                  availablity && { value: availablity, label: availablity }
                }
                onChange={handleChange("availablity")}
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ].map((x) => ({ value: x.value, label: x.label }))}
                placeholder="Select Availablity"
                isClearable={false}
                closeMenuOnSelect
                isSearchable
              />
              <FormHelperText className={classes.text} id="my-helper-text">
                Select Yes/No
              </FormHelperText>
            </FormControl>

            <FormControl>
              <Select
                name="stage"
                value={
                  stage &&
                  // eslint-disable-next-line arrow-body-style
                  stageOptions.filter((x) => {
                    return stage.indexOf(x.value) > -1
                      ? { value: x.value, label: x.label }
                      : null;
                  })
                }
                isMulti
                onChange={getStage}
                options={stageOptions.map((x) => ({
                  value: x.value,
                  label: x.label,
                }))}
                placeholder="Select Stage"
                isClearable={false}
                isSearchable
                closeMenuOnSelect
              />
              <FormHelperText className={classes.text} id="my-helper-text">
                Stage select kariye jo aap owner ko assign karna chahate ho.
              </FormHelperText>
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="limit">Interview Limit</InputLabel>
              <Input
                type="number"
                id="limit"
                aria-describedby="my-helper-text"
                name="limit"
                value={limit || ""}
                onChange={handleChange("limit")}
              />
              <FormHelperText className={classes.text} id="my-helper-text">
                Ek student kitne interviews le sakta hai.
              </FormHelperText>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={isEdit ? editOwner : createOwner}
              className={classes.btn}
            >
              {isEdit ? "Edit Owner" : "Add Owner"}
            </Button>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default AddOwner;
