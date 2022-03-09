import React from "react";
import { makeStyles } from "@material-ui/styles";
import Select from "react-select";
import SendIcon from "@material-ui/icons/Send";
import AddIcon from "@material-ui/icons/Add";
//mail icon from material icons
import MailIcon from "@material-ui/icons/Mail";
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
import { useSnackbar } from "notistack";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let dates = [];
for (let a = 1; a <= 31; a++) {
  dates.push({ value: a, label: a });
}

const baseUrl = process.env.API_URL;
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
    marginBottom: theme.spacing(2),
    color: "black",
    fontSize: "15px",
  },
  btn: {
    marginTop: theme.spacing(4),
  },
}));

const AddOwner = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    dialogOpen: false,
    emails: [""],
    repeat: "Daily",
    date: null,
    status: "Yes",
    report: "Outreach",
    emailreportId: null,
  });

  const addEmail = () => {
    setState({ ...state, emails: [...state.emails, ""] });
  };
  const changeHandler = (index) => {
    const emails = state.emails;
    if (event.target.value) {
      emails[index] = event.target.value;
    } else {
      emails.splice(index, 1);
    }
    setState({ ...state, emails: emails.length < 1 ? [""] : emails });
  };
  const handleChange = (name) => (event) => {
    const { value } = event;
    setState({
      ...state,
      [name]: value ? value : event.target.value,
    });
  };

  const handleChangeTimeLines = (name) => (event) => {
    if (event) {
      setState({ ...state, [name]: event });
    } else {
      setState({ ...state, [name]: null });
    }
  };

  const sendReport = () => {
    const { emails, repeat, date, status, report } = state;
    //console.log(emails, repeat, date, status, report);
    const { partnerId } = props;

    if (validations()) {
      //console.log("Callingg..");
      return;
    } else {
      axios
        .post(`${baseUrl}partners/emailreport`, {
          partner_id: partnerId,
          emails: emails,
          repeat: getRepeatValue(repeat, date),
          status: status === "Yes" ? true : false,
          report: report,
        })
        .then(() => {
          enqueueSnackbar(`Report ready to share  ${repeat} bases`, {
            variant: "success",
          });
        });
    }
  };

  const validations = () => {
    const { emails, repeat, date, status } = state;
    if (emails[0].length < 1) {
      enqueueSnackbar(`Please give email id`, {
        variant: "error",
      });
      return true;
    }
    if (repeat != "Daily") {
      for (let d of date) {
        if (repeat.indexOf("Monthly") > -1 && isNaN(d.value)) {
          enqueueSnackbar("You have given week day to date field", {
            variant: "error",
          });
          return true;
        } else if (repeat.indexOf("Weekly") > -1 && parseInt(d.value)) {
          enqueueSnackbar("You have given date to week field", {
            variant: "error",
          });
          return true;
        }
      }
    }
    if (!status) {
      enqueueSnackbar(`Please give status to share report`, {
        variant: "error",
      });
      return true;
    }
    return false;
  };

  const getRepeatValue = (repeat, date) => {
    if (repeat === "Daily") {
      return repeat;
    }
    const values = date.map((e) => {
      return e.value;
    });
    return `${repeat} ${values.join(" ")}`;
  };
  const editSendReport = async () => {
    const { emails, repeat, date, status, report, emailreportId } = state;
    const { partnerId } = props;
    if (validations()) {
      return;
    } else {
      axios
        .put(`${baseUrl}partners/emailreport/${emailreportId}`, {
          partner_id: partnerId,
          emails: emails,
          repeat: getRepeatValue(repeat, date),
          status: status === "Yes" ? true : false,
          report: report,
        })
        .then(() => {
          enqueueSnackbar(`Report successfully updated`, {
            variant: "success",
          });
        });
    }
  };

  const instantReportSend = () => {
    const { partnerId } = props;

    axios.get(`${baseUrl}emailreport/send/partner/${partnerId}`).then(() => {
      enqueueSnackbar(`Instant Report Sent!!!`, {
        variant: "success",
      });
    });
  };

  const openModal = () => {
    const { partnerId } = props;
    setState((prevState) => ({ ...prevState, dialogOpen: true }));

    axios.get(`${baseUrl}partners/emailreport/${partnerId}`).then((data) => {
      const resp = data.data.data[0];
      if (resp) {
        let splitRepeat = resp.repeat.split(" ");
        const dateData = splitRepeat.splice(1, splitRepeat.length);
        setState((prevState) => ({
          ...prevState,
          emails: resp.emails,
          repeat: splitRepeat[0],
          date: dateData.map((e) => {
            return {
              value: e,
              label: e,
            };
          }),
          status: resp.status ? "Yes" : "No",
          report: resp.report,
          emailreportId: resp.id,
        }));
      }
    });
  };

  const { emails, dialogOpen, repeat, date, status, emailreportId } = state;
  const isWeekly = repeat.indexOf("Weekly") > -1;
  return (
    <div>
      <a target="_blank" title="Report Sending Option">
        <SendIcon
          style={{
            cursor: "pointer",
          }}
          onClick={openModal}
        />
      </a>
      <a target="_blank" title="Send Instant Report">
        <MailIcon
          style={{
            cursor: "pointer",
            marginLeft: "10px",
          }}
          onClick={instantReportSend}
        />
      </a>
      <Modal
        open={dialogOpen}
        style={{ overflow: "scroll" }}
        onClose={() => setState({ ...state, dialogOpen: false })}
        onOpen={() => setState({ ...state, dialogOpen: true })}
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
                      onChange={() => changeHandler(index)}
                    />
                  </div>
                );
              })}

              <FormHelperText className={classes.text}>
                Email Id&apos;s
              </FormHelperText>
              <Fab
                className={classes.addIcon}
                color="primary"
                aria-label="add"
                onClick={addEmail}
                disabled={emails[emails.length - 1].length < 1}
              >
                <AddIcon />
              </Fab>
            </FormControl>
            <FormControl>
              <Select
                name="repeat"
                value={repeat && { value: repeat, label: repeat }}
                onChange={handleChange("repeat")}
                options={[
                  { value: "Daily", label: "Daily" },
                  { value: "Weekly", label: "Weekly" },
                  { value: "Bi-Weekly", label: "Bi-Weekly" },
                  { value: "Monthly", label: "Monthly" },
                  { value: "Bi-Monthly", label: "Bi-Monthly" },
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
            {repeat !== "Daily" && (
              <FormControl>
                <Select
                  maxMenuHeight={100}
                  name="date"
                  value={
                    date &&
                    date.map((e) => {
                      return { value: e.value, label: e.label };
                    })
                  }
                  onChange={handleChangeTimeLines("date")}
                  options={
                    isWeekly
                      ? weekDays.map((x) => {
                          return { value: x, label: x };
                        })
                      : dates
                  }
                  placeholder={isWeekly ? "Select week day" : "Select date"}
                  isMulti
                  isClearable={false}
                  closeMenuOnSelect={true}
                  isSearchable={true}
                />
                <FormHelperText className={classes.text}>
                  {isWeekly ? "Please select week day" : "Please select date"}
                </FormHelperText>
              </FormControl>
            )}

            <FormControl>
              <Select
                maxMenuHeight={100}
                name="status"
                value={status && { value: status, label: status }}
                onChange={handleChange("status")}
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
              onClick={emailreportId ? editSendReport : sendReport}
            >
              {emailreportId ? "Edit Send Report" : "Send Report"}
            </Button>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default AddOwner;
