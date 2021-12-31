import React from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import Select from "react-select";

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
    const { name, email, notes, slug, partner_user, districts, state } =
      this.state;
    let removeExtraDistricts = districts.filter(
      (district) => district.length > 0
    );

    console.log("state", this.state);

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
          state: state,
          partner_user: partner_user,
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
    const { name, email, notes, slug, districts, state } = this.state;
    let removeExtraDistricts = districts.filter(
      (district) => district.length > 0
    );
    axios
      .put(`${baseUrl}partners/${value}`, {
        name: name,
        email: email ? email : null,
        notes: notes,
        state: state ? state : null,
        partner_user: partner_user.length > 0 ? partner_user : null,
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

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      slug: "",
      notes: "",
      states: "",
      state: "",
      partner_user: [""],
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
          state: data.state ? data.state : "",
          partner_user: data.partner_user ? data.partner_user : "",
          districts: data.districts ? data.districts : [""],
        });
      });
    }
    this.getState();
  }

  getState = async () => {
    const response = await axios.get(
      "https://api.countrystatecity.in/v1/countries/IN/states",
      {
        headers: {
          "X-CSCAPI-KEY":
            "TzZrb2p0emtqa29BOW0zTnpLZHdzOVdjNmlubnRDMmtqOEgxRXpFdw==",
        },
      }
    );
    const newData = response.data.sort((a, b) => {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });

    this.setState({ states: newData });
  };

  addState = () => {
    this.setState({ districts: [...this.state.districts, ""] });
  };

  addEmail = () => {
    this.setState({ partner_user: [...this.state.partner_user, ""] });
  };

  handleChange = (name) => (event) => {
    let valChange = {};
    valChange[name] = event.target.value;
    this.setState(valChange);
  };

  changeHandler = (index) => {
    console.log("e", event.target.name);
    if (event.target.name === "state") {
      const districts = this.state.districts;
      if (event.target.value) {
        districts[index] = event.target.value;
      } else {
        districts.splice(index, 1);
      }
      this.setState({ districts: districts.length < 1 ? [""] : districts });
    }
    if (event.target.name === "user") {
      const partner_user = this.state.partner_user;
      if (event.target.value) {
        partner_user[index] = event.target.value;
      } else {
        partner_user.splice(index, 1);
      }
      this.setState({
        partner_user: partner_user.length < 1 ? [""] : partner_user,
      });
    }
  };

  render = () => {
    console.log("state", this.state);
    const { classes, value } = this.props;
    const { states, state } = this.state;
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
            {this.state.partner_user.map((state, index) => {
              return (
                <div key={index}>
                  <TextField
                    type={
                      this.state.partner_user.length - 1 === index
                        ? "search"
                        : null
                    }
                    id="PartnerDistrictsCities"
                    label="Users"
                    aria-describedby="my-helper-text"
                    name="user"
                    value={state}
                    onChange={() => this.changeHandler(index)}
                  />
                </div>
              );
            })}

            <FormHelperText className={classes.text} id="my-helper-text">
              Multiple Email Enter karein
            </FormHelperText>
            <Fab
              className={classes.addIcon}
              color="primary"
              aria-label="add"
              onClick={this.addEmail}
              disabled={
                this.state.partner_user[this.state.partner_user.length - 1] ===
                ""
              }
            >
              <AddIcon />
            </Fab>
          </FormControl>

          <FormControl>
            {this.state.districts.map((state, index) => {
              return (
                <div key={index}>
                  <TextField
                    type={
                      this.state.districts.length - 1 === index
                        ? "search"
                        : null
                    }
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
