import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Select from "react-select";
import SendIcon from "@material-ui/icons/Send";
import AddIcon from "@material-ui/icons/Add";
import {
  Typography,
  Modal,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Fab,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

const weekDays = [
  {
    value: "Sunday",
    label: "Sunday",
  },
  {
    value: "Monday",
    label: "Monday",
  },
  {
    value: "Tuesday",
    label: "Tuesday",
  },
  {
    value: "Wednesday",
    label: "Wednesday",
  },
  {
    value: "Thursday",
    label: "Thursday",
  },
  {
    value: "Friday",
    label: "Friday",
  },
  {
    value: "Saturday",
    label: "Saturday",
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
    marginBottom: theme.spacing(2),
    color: "black",
    fontSize: "15px",
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
      emails: [""],
      repeat: "Daily",
      date: "",
      status: "",
      report: "",
      emailreportId: null,
    };
  }
  addEmail = () => {
    this.setState({ emails: [...this.state.emails, ""] });
  };
  changeHandler = (index) => {
    const emails = this.state.emails;
    if (event.target.value) {
      emails[index] = event.target.value;
    } else {
      emails.splice(index, 1);
    }
    this.setState({ emails: emails.length < 1 ? [""] : emails });
  };
  handleChange = (name) => (event) => {
    const { value, label } = event;
    this.setState({
      [name]: value ? value : event.target.value,
    });
  };

  sendReport = () => {
    const { emails, repeat, date, status, report } = this.state;
    const { partnerId } = this.props;
    if (emails[0].length < 1) {
      this.props.enqueueSnackbar(`Please give email id`, {
        variant: "error",
      });
      return;
    }
    if (date > 31) {
      this.props.enqueueSnackbar(`date should be less than 32`, {
        variant: "error",
      });
      return;
    } else {
      axios
        .post(`${baseUrl}emailreport`, {
          partner_id: partnerId,
          emails: emails,
          repeat: `${repeat} ${date}`,
          status: status === "Yes" ? true : false,
          report: report,
        })
        .then((data) => {
          this.props.enqueueSnackbar(
            `Report ready to share  ${repeat} on ${date} `,
            {
              variant: "success",
            }
          );
        });
    }
  };

  editSendReport = () => {
    const { emails, repeat, date, status, report, emailreportId } = this.state;
    if (emails[0].length < 1) {
      this.props.enqueueSnackbar(`Please give email id`, {
        variant: "error",
      });
      return;
    }
    if (date > 31) {
      this.props.enqueueSnackbar(`date should be less than 32`, {
        variant: "error",
      });
      return;
    } else {
      axios
        .put(`${baseUrl}emailreport/${emailreportId}`, {
          partner_id: partnerId,
          emails: emails,
          repeat: `${repeat} ${date}`,
          status: status === "Yes" ? true : false,
          report: report,
        })
        .then((data) => {
          this.props.enqueueSnackbar(`Report successfully updated`, {
            variant: "success",
          });
        });
    }
  };
  openModal = () => {
    const { partnerId } = this.props;
    this.setState({ dialogOpen: true });

    axios.get(`${baseUrl}emailreport/${partnerId}`).then((data) => {
      const resp = data.data.data[0];
      let splitRepeat = resp.repeat.split(" ");
      this.setState({
        emails: resp.emails,
        repeat: splitRepeat[0],
        date: splitRepeat[1],
        status: resp.status ? "Yes" : "No",
        report: resp.report,
        emailreportId: resp.id,
      });
    });
  };

  render = () => {
    const { emails, dialogOpen, repeat, date, status, report, emailreportId } =
      this.state;
    const { classes } = this.props;
    return (
      <div>
        <SendIcon onClick={this.openModal} />
        <Modal
          open={dialogOpen}
          style={{ overflow: "scroll" }}
          onClose={() => this.setState({ dialogOpen: false })}
          onOpen={() => this.setState({ dialogOpen: true })}
        >
          <Card className={classes.root}>
            <form className={classes.container}>
              <div>
                <Typography
                  variant="h4"
                  id="outreach-data"
                  style={{
                    paddingBottom: "20px",
                  }}
                >
                  Send Report To Partner
                </Typography>
              </div>
              <FormControl>
                {emails.map((state, index) => {
                  return (
                    <div key={index}>
                      <TextField
                        type={emails.length - 1 === index ? "search" : null}
                        label="Give email"
                        name="state"
                        value={state}
                        onChange={() => this.changeHandler(index)}
                      />
                    </div>
                  );
                })}

                <FormHelperText className={classes.text}>
                  Email Id's
                </FormHelperText>
                <Fab
                  className={classes.addIcon}
                  color="primary"
                  aria-label="add"
                  onClick={this.addEmail}
                  disabled={emails[emails.length - 1].length < 1}
                >
                  <AddIcon />
                </Fab>
              </FormControl>
              <FormControl>
                <Select
                  name="repeat"
                  value={repeat && { value: repeat, label: repeat }}
                  onChange={this.handleChange("repeat")}
                  options={[
                    { value: "Daily", label: "Daily" },
                    { value: "Weekly", label: "Weekly" },
                    { value: "Monthly", label: "Monthly" },
                  ].map((x) => {
                    return { value: x.value, label: x.label };
                  })}
                  placeholder={"Select Time Line"}
                  isClearable={false}
                  closeMenuOnSelect={true}
                  isSearchable={true}
                />
                <FormHelperText className={classes.text}>
                  Time Lines
                </FormHelperText>
              </FormControl>
              {repeat !== "Daily" &&
                (repeat === "Weekly" ? (
                  <FormControl>
                    <Select
                      maxMenuHeight={100}
                      name="date"
                      value={date && { value: date, label: date }}
                      onChange={this.handleChange("date")}
                      options={weekDays.map((x) => {
                        return { value: x.value, label: x.label };
                      })}
                      placeholder={"Select week day"}
                      isClearable={false}
                      closeMenuOnSelect={true}
                      isSearchable={true}
                    />
                    <FormHelperText className={classes.text}>
                      Please select week day
                    </FormHelperText>
                  </FormControl>
                ) : (
                  <FormControl>
                    <TextField
                      type="number"
                      label="Give date"
                      name="date"
                      value={date}
                      onChange={this.handleChange("date")}
                    />
                    <FormHelperText className={classes.text}>
                      Give date
                    </FormHelperText>
                  </FormControl>
                ))}
              <FormControl>
                <Select
                  maxMenuHeight={100}
                  name="report"
                  value={report && { value: report, label: report }}
                  onChange={this.handleChange("report")}
                  options={[
                    { value: "Outreach", label: "Outreach" },
                    { value: "Academic", label: "Academic" },
                  ].map((x) => {
                    return { value: x.value, label: x.label };
                  })}
                  placeholder={"Select Time Line"}
                  isClearable={false}
                  closeMenuOnSelect={true}
                  isSearchable={true}
                />
                <FormHelperText className={classes.text}>
                  Which report wants to share with a partner ?
                </FormHelperText>
              </FormControl>
              <FormControl>
                <Select
                  maxMenuHeight={100}
                  name="status"
                  value={status && { value: status, label: status }}
                  onChange={this.handleChange("status")}
                  options={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ].map((x) => {
                    return { value: x.value, label: x.label };
                  })}
                  placeholder={"Select Time Line"}
                  isClearable={false}
                  closeMenuOnSelect={true}
                  isSearchable={true}
                />
                <FormHelperText className={classes.text}>
                  Do you want to share report ?
                </FormHelperText>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                className={classes.btn}
                onClick={emailreportId ? this.editSendReport : this.sendReport}
              >
                {emailreportId ? "Edit Send Report" : "Send Report"}
              </Button>
            </form>
          </Card>
        </Modal>
      </div>
    );
  };
}

export default withSnackbar(withRouter(withStyles(styles)(AddOwner)));
