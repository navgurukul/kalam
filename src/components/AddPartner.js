import React from "react";
import { connect } from "react-redux";
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
  text: {
    marginBottom: theme.spacing(1),
  },
  btn: {
    marginTop: theme.spacing(4),
  },
});

export class AddPartnerPage extends React.Component {
  async addPartner() {
    const { name, notes, slug } = this.state;
    try {
      this.props.fetchingStart();
      const dataURL = baseUrl + "partners";
      console.log(localStorage.getItem("jwt"));
      const response = await axios.post(
        dataURL,
        {
          name: name,
          notes: notes,
          slug: slug,
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
      notes: "",
      slug: "",
    };
  }

  handleChange = (name) => (event) => {
    let valChange = {};
    valChange[name] = event.target.value;

    this.setState(valChange);
  };

  render = () => {
    const { classes } = this.props;

    return (
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

        <Button
          variant="contained"
          color="primary"
          onClick={this.onSubmit}
          className={classes.btn}
        >
          Add Partner
        </Button>
      </form>
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
