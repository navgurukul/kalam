import React from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";

import axios from "axios";
import { Button } from "@material-ui/core";

import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";

import { changeFetching } from "../store/actions/auth";
import { withSnackbar } from "notistack";

import { withRouter } from "react-router-dom";

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
    marginTop: "100px",
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

export class AddPartnerPage extends React.Component {
  async addPartner() {
    const { name, email, notes, slug, districts } = this.state;
    try {
      this.props.fetchingStart();
      const dataURL = baseUrl + "partners";
      console.log(localStorage.getItem("jwt"));
      const response = await axios.post(
        dataURL,
        {
          name: name,
          email: email,
          notes: notes,
          slug: slug,
          districts: districts,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
      );

      this.props.fetchingFinish();
      this.props.history.push("/partners");
    } catch (e) {
      console.log(e);
      this.props.enqueueSnackbar(
        "All fields are mandatory Or Slug should be unique",
        { variant: "error" }
      );
      this.props.fetchingFinish();
    }
  }

  onSubmit = () => {
    this.addPartner();
  };

  validate = () => {};

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      notes: "",
      slug: "",
      districts: [""],
    };
  }

  addState = () => {
    this.setState({ districts: [...this.state.districts, ""] });
  };

  handleChange = (name) => (event) => {
    console.log(name, "name");
    let valChange = {};
    valChange[name] = event.target.value;
    console.log("valChange[name]", valChange[name]);
    this.setState(valChange);
  };

  check = (index) => {
    const districts = this.state.districts;
    districts[index] = event.target.value;
    this.setState({ districts: districts });
  };

  render = () => {
    const { classes } = this.props;
    console.log(this.state, "stateeeee");
    return (
      <Card className={classes.root}>
        <form className={classes.container}>
          <FormControl>
            <InputLabel htmlFor="partnerName">Partner Name</InputLabel>
            <Input
              id="partnerName"
              aria-describedby="my-helper-text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange("name")}
            />
            <FormHelperText className={classes.text} id="my-helper-text">
              Partner ka Name Enter karein.
            </FormHelperText>
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="partnerEmail">Partner Email</InputLabel>
            <Input
              id="partnerEmail"
              aria-describedby="my-helper-text"
              name="email"
              value={this.state.email}
              onChange={this.handleChange("email")}
            />
            <FormHelperText className={classes.text} id="my-helper-text">
              Partner ka Email Enter karein.
            </FormHelperText>
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="partnerNotes">Partner Notes</InputLabel>
            <Input
              id="partnerNotes"
              aria-describedby="my-helper-text"
              name="notes"
              value={this.state.notes}
              onChange={this.handleChange("notes")}
            />
            <FormHelperText className={classes.text} id="my-helper-text">
              Partner ki thodi details add karein.
            </FormHelperText>
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="partnerNotes">Partner Slug</InputLabel>
            <Input
              id="partnerNotes"
              aria-describedby="my-helper-text"
              name="notes"
              value={this.state.slug}
              onChange={this.handleChange("slug")}
            />
            <FormHelperText className={classes.text} id="my-helper-text">
              Partner ke student ko online test dene ke liye Slug add karo.
            </FormHelperText>
          </FormControl>

          <FormControl>
            {this.state.districts.map((state, index) => {
              return (
                <div key={index}>
                  <TextField
                    id="PartnerDistrictsCities"
                    label=" Partner Districts/Cities"
                    aria-describedby="my-helper-text"
                    name="state"
                    value={this.state.state}
                    onChange={() => this.check(index)}
                  />
                </div>
              );
            })}

            <FormHelperText className={classes.text} id="my-helper-text">
              Partner ka districts aur city Enter karein.
            </FormHelperText>

            <Fab
              className={classes.addIcon}
              color="primary"
              aria-label="add"
              onClick={this.addState}
            >
              <AddIcon />
            </Fab>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={this.onSubmit}
            className={classes.btn}
          >
            Add Partner
          </Button>
        </form>
      </Card>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withSnackbar(
  withRouter(
    withStyles(styles)(connect(undefined, mapDispatchToProps)(AddPartnerPage))
  )
);
