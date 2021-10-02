import React from "react";
import Card from "@material-ui/core/Card";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Select from "react-select";
import { Modal } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

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
const baseUrl = process.env.API_URL;
const styles = (theme) => ({
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
    marginTop: theme.spacing(4),
  },
});

export class AddOwner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      data: [],
      ownerName: null,
      ownerId: null,
      availablity: null,
      stage: null,
      limit: undefined,
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    axios.get(`${baseUrl}users/getall`).then((response) => {
      this.setState({
        data: response.data.data,
      });
    });
  };

  createOwner = () => {
    const { ownerName, ownerId, availablity, stage, limit } = this.state;
    const { ownerData, getUpdatedData } = this.props;
    const duplicateData = ownerData.filter((x) => x.user.mail_id === ownerName);
    if (duplicateData.length > 0) {
      this.props.enqueueSnackbar(`${ownerName} exists in owner dashboard.`, {
        variant: "error",
      });
    } else if (ownerName && ownerId && availablity && stage) {
      axios
        .post(`${baseUrl}owner`, {
          user_id: ownerId,
          available: availablity === "Yes" ? true : false,
          max_limit: limit ? limit : undefined,
          type: stage,
        })
        .then((response) => {
          this.props.enqueueSnackbar(`Owner Successfull created !`, {
            variant: "success",
          });
          this.setState({
            dialogOpen: false,
          });
          getUpdatedData(response.data.data[0], false);
        });
    } else {
      this.props.enqueueSnackbar(`Please fill all fields`, {
        variant: "error",
      });
    }
  };

  getOnwer = async (ownerId) => {
    const response = await axios.get(`${baseUrl}owner/${ownerId}`);
    const data = response.data.data[0];

    this.setState({
      ownerName: data.user.user_name,
      availablity: data.available ? "Yes" : "No",
      stage: data.type,
      limit: data.max_limit,
      ownerId: data.id,
    });
  };

  editOwner = () => {
    const { ownerName, ownerId, availablity, stage, limit } = this.state;
    const { getUpdatedData } = this.props;
    if (ownerName && ownerId && availablity && stage) {
      axios
        .put(`${baseUrl}owner/${ownerId}`, {
          available: availablity === "Yes" ? true : false,
          max_limit: limit ? limit : undefined,
          type: stage,
        })
        .then((response) => {
          this.props.enqueueSnackbar(`Owner Successfull updated !`, {
            variant: "success",
          });
          this.setState({
            dialogOpen: false,
          });
          getUpdatedData(response.data.data[0], true);
        });
    } else {
      this.props.enqueueSnackbar(`Please fill all fields`, {
        variant: "error",
      });
    }
  };

  openModel = () => {
    this.setState({
      dialogOpen: true,
    });
    const { ownerId } = this.props;
    this.getOnwer(ownerId);
  };
  openDialog = () => {
    this.setState({
      dialogOpen: true,
    });
  };

  handleClose = () => {
    this.setState({
      dialogOpen: false,
    });
  };

  handleChange = (name) => (event) => {
    const { value, label } = event;
    if (name === "ownerName") {
      this.setState({ ownerName: label, ownerId: value });
    } else {
      this.setState({
        [name]: value ? value : event.target.value,
      });
    }
  };

  getStage = (event) => {
    const newStages = event && event.map((x) => x.value);
    this.setState({
      stage: newStages,
    });
  };

  render = () => {
    const { classes, isEdit } = this.props;
    const { data, ownerName, ownerId, availablity, stage, limit } = this.state;
    return (
      <div>
        {isEdit ? (
          <EditIcon onClick={this.openModel} style={{ cursor: "pointer" }} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={this.openDialog}
            className={classes.btn}
          >
            Add Owner
          </Button>
        )}

        <Modal
          open={this.state.dialogOpen}
          onClose={this.handleClose}
          onOpen={this.openDialog}
        >
          <Card className={classes.root}>
            <form className={classes.container}>
              <FormControl>
                <Select
                  name="ownerName"
                  value={ownerName && { value: ownerId, label: ownerName }}
                  onChange={this.handleChange("ownerName")}
                  options={data.map((x) => {
                    return { value: x.id, label: x.user };
                  })}
                  placeholder={"Select Owner"}
                  isClearable={false}
                  closeMenuOnSelect={true}
                  isSearchable={true}
                  isDisabled={isEdit ? true : false}
                />
                <FormHelperText className={classes.text} id="my-helper-text">
                  Please select owner
                </FormHelperText>
              </FormControl>

              <FormControl>
                <Select
                  name="availablity"
                  value={
                    availablity && { value: availablity, label: availablity }
                  }
                  onChange={this.handleChange("availablity")}
                  options={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ].map((x) => {
                    return { value: x.value, label: x.label };
                  })}
                  placeholder={"Select Availablity"}
                  isClearable={false}
                  closeMenuOnSelect={true}
                  isSearchable={true}
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
                    stageOptions.filter((x) => {
                      return stage.indexOf(x.value) > -1
                        ? { value: x.value, label: x.label }
                        : null;
                    })
                  }
                  isMulti
                  onChange={this.getStage}
                  options={stageOptions.map((x) => {
                    return { value: x.value, label: x.label };
                  })}
                  placeholder={"Select Stage"}
                  isClearable={false}
                  isSearchable={true}
                  closeMenuOnSelect={true}
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
                  value={limit ? limit : ""}
                  onChange={this.handleChange("limit")}
                />
                <FormHelperText className={classes.text} id="my-helper-text">
                  Ek student kitne interviews le sakta hai.
                </FormHelperText>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={isEdit ? this.editOwner : this.createOwner}
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
}

export default withSnackbar(withRouter(withStyles(styles)(AddOwner)));
