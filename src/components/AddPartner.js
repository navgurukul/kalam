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

export class AddPartnerPage extends React.Component {
  async addPartner() {
    const { name, email, notes, slug, districts } = this.state;
    let removeExtraDistricts = districts.filter(
      (district) => district.length > 0
    );

    try {
      this.props.fetchingStart();
      const dataURL = baseUrl + "partners";
      const response = await axios.post(
        dataURL,
        {
          name: name,
          email: email,
          notes: notes,
          slug: slug,
          districts: removeExtraDistricts,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
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

  editPartner = (value) => {
    const { name, email, notes, slug, districts } = this.state;
    let removeExtraDistricts = districts.filter(
      (district) => district.length > 0
    );
    axios
      .put(`${baseUrl}partners/${value}`, {
        name: name,
        email: email ? email : null,
        notes: notes,
        districts:
          removeExtraDistricts.length > 0 ? removeExtraDistricts : null,
      })
      .then((response) => {
        this.props.enqueueSnackbar("Partner details Successfull edit", {
          variant: "success",
        });
      })
      .catch((e) => {
        this.props.enqueueSnackbar("Something went wrong", {
          variant: "error",
        });
      });
  };

  onSubmit = () => {
    const { value } = this.props;
    if (value) {
      this.editPartner(value);
    } else {
      this.addPartner();
    }
  };

  validate = () => {};

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: null,
      slug: "",
      notes: "",
      districts: [""],
    };
  }
  componentDidMount() {
    if (this.props.value) {
      const dataURL = `${baseUrl}partners/${this.props.value}`;
      axios.get(dataURL).then((response) => {
        const data = response.data.data;
        this.setState({
          name: data.name ? data.name : "",
          email: data.email ? data.email : "",
          slug: data.slug ? data.slug : "",
          notes: data.notes ? data.notes : "",
          districts: data.districts ? data.districts : [""],
        });
      });
    }
  }

  addState = () => {
    this.setState({ districts: [...this.state.districts, ""] });
  };

  handleChange = (name) => (event) => {
    let valChange = {};
    valChange[name] = event.target.value;
    this.setState(valChange);
  };

  changeHandler = (index) => {
    const districts = this.state.districts;
    districts[index] = event.target.value;
    this.setState({ districts: districts });
  };

  render = () => {
    const { classes, value } = this.props;

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
              disabled={value ? true : false}
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
                    value={state}
                    onChange={() => this.changeHandler(index)}
                  />
                </div>
              );
            })}

            <FormHelperText className={classes.text} id="my-helper-text">
              Partner ka districts or city Enter karein.
            </FormHelperText>
            <Fab
              className={classes.addIcon}
              color="primary"
              aria-label="add"
              onClick={this.addState}
              disabled={
                this.state.districts[this.state.districts.length - 1] === ""
              }
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
            {value ? "Edit Partner" : "Add Partner"}
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
