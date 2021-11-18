import React from "react";
import Card from "@material-ui/core/Card";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Select from "react-select";
import { Modal } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import AddIcon from "@material-ui/icons/Add";

import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Fab,
  TextField,
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
    color:"black"
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
      Repeat:""
    };
  }
  addEmail = () => {
    this.setState({ emails: [...this.state.emails, ""] });
  };
  changeHandler = (index) => {
    const emails = this.state.emails;
    console.log(index, "index")
    if (event.target.value) {
      console.log("cond")
      emails[index] = event.target.value;
    } else {
      console.log("kkk")
      emails.splice(index, 1);
    }
    console.log(emails, "email")
    this.setState({ emails: emails.length < 1 ? [""] : emails });
  };
  render = () => {
    const { emails, dialogOpen,Repeat } = this.state;
    console.log(emails, "email")
    const { classes } = this.props;
    return (
      <div>
        <SendIcon onClick={() => this.setState({ dialogOpen: true })} />
        <Modal
          open={dialogOpen}
          onClose={() => this.setState({ dialogOpen: false })}
          onOpen={() => this.setState({ dialogOpen: true })}
        >
          <Card className={classes.root}>
            <form className={classes.container}>
              <h1>Send Report To Partner</h1>
              <FormControl>
                {emails.map((state, index) => {
                  return (
                    <div key={index}>
                      <TextField
                        type={
                          emails.length - 1 === index
                            ? "search"
                            : null
                        }
                        label="Give email"
                        aria-describedby="my-helper-text"
                        name="state"
                        value={state}
                        onChange={() => this.changeHandler(index)}
                      />
                    </div>
                  );
                })}

                <FormHelperText className={classes.text} id="my-helper-text">
                  Email Id's
                </FormHelperText>
                <Fab
                  className={classes.addIcon}
                  color="primary"
                  aria-label="add"
                  onClick={this.addEmail}
                  disabled={
                    emails[emails.length - 1].length < 1
                  }
                >
                  <AddIcon />
                </Fab>
              </FormControl>
              <FormControl>
                <Select
                  name="availablity"
                  value={
                    Repeat && { value: Repeat, label: Repeat }
                  }
                  // onChange={this.handleChange("availablity")}
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

              <Button
                variant="contained"
                color="primary"
                className={classes.btn}
              >
                Send Report
              </Button>
            </form>
          </Card>
        </Modal>
      </div>
    );
  };
}

export default withSnackbar(withRouter(withStyles(styles)(AddOwner)));
