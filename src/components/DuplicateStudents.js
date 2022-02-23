import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";
import GlobalService from "../services/GlobalService";
import StudentService from "../services/StudentService";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { allStages } from "../config";
import { changeFetching } from "../store/actions/auth";

const baseUrl = process.env.API_URL;

const useStyles = (theme) => ({
  paper: {
    position: "absolute",
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
    [theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "50%",
    },
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
});

export class DuplicateStudents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partnerId: "",
      data: [],
      pendingInterviewStage: "checking",
    };

    this.columns = [
      {
        name: "id",
        label: "Re-Test",
        options: {
          filter: false,
          customBodyRender: (value) => {
            return (
              <Button
                disabled={this.state.data.pendingInterview ? "true" : "false"}
                variant="contained"
                color="primary"
                style={{ fontSize: "10px" }}
                onClick={async () => {
                  console.log("value", value);

                  const response = await this.generateTestLink(value);
                  this.props.history.push({
                    pathname: `/test/${response.data.key}/${value}`,
                  });
                  this.props.fetchingFinish();
                }}
              >
                Re-Test
              </Button>
            );
          },
        },
      },
      {
        name: "stage",
        label: "Stage",
        options: {
          filter: false,
          customBodyRender: (value) => {
            return allStages[value];
          },
        },
      },
      {
        name: "total_marks",
        label: "Marks",
        options: {
          filter: false,
        },
      },

      {
        name: "key",
        label: "Key",
        options: {
          filter: false,
          display: false,
          viewColumns: false,
        },
      },
    ];
    this.message = {
      stageMessage: {
        en: `Your  ${
          allStages[this.state.pendingInterviewStage]
        } is still pending. You’re not required to give the online test now. We will soon complete your admission process.`,
        hi: `आपका  ${
          allStages[this.state.pendingInterviewStage]
        }  अभी भी चल रहा हैं। अभी आपको ऑनलाइन परीक्षा देने की आवश्यकता नहीं है। हम जल्द ही आपकी प्रवेश प्रक्रिया (एडमिशन प्रोसेस) पूरी कर देंगे।`,
      },
      testFailedMessage: {
        en: ` , Your previous attempts were unsuccessful/test failed, please give the 1st stage of the online test again.`,
        hi: ` , आपके पिछले टेस्ट असफल रहे या आप पास नहीं हो पाए, कृपया ऑनलाइन टेस्ट वापस से दे।`,
      },
    };
  }

  async generateTestLink(studentId) {
    try {
      const partnerId = this.state.partnerId ? this.state.partnerId : null;
      const details = window.location.href.split("Name=")[1];
      const mobileNumber = details.split("&Number=")[1].split("&Stage=")[0];
      const mobile = "0" + mobileNumber;
      this.props.fetchingStart();
      const dataURL = baseUrl + "helpline/register_exotel_call";
      const response = await axios.get(dataURL, {
        params: {
          ngCallType: "getEnrolmentKey",
          From: mobile,
          partner_id: partnerId,
          student_id: studentId,
        },
      });
      return response;
    } catch (e) {
      this.props.enqueueSnackbar("Something went wrong", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      this.props.fetchingFinish();
    }
  }

  isDuplicate = () => {
    const details = window.location.href.split("Name=")[1];
    const mobileNumber = details.split("&Number=")[1].split("&Stage=")[0];
    const name = details.split("&Number=")[0];
    axios
      .get(baseUrl + "/check_duplicate", {
        params: {
          Name: name,
          Number: mobileNumber,
        },
      })
      .then(async (data) => {
        const response = data.data.data;
        if (response.alreadyGivenTest) {
          this.setState({ data: response.data });
        }
        console.log(response);
        return response;
      });
  };

  componentDidMount() {
    const slug = window.location.href.split("partnerLanding/")[1];
    if (slug) {
      this.partnerFetch(slug);
    }
    this.isDuplicate();
  }

  async partnerFetch(slug) {
    const { history } = this.props;
    try {
      const response = await axios.get(`${baseUrl}partners/slug/${slug}`, {});
      this.setState({
        partnerId: response.data.data["id"],
      });
    } catch (e) {
      history.push("/notFound");
    }
  }

  render = () => {
    const data = this.state.data;
    const selectedLang =
      history.state === null ? "en" : history.state.state.state.selectedLang;
    let firstName;
    let middleName;
    let lastName;
    const details = window.location.href.split("Name=")[1];
    const name = details.split("&Number=")[0];
    const splitedName = name.match(/[A-Z][a-z]+/g);
    const pendingInterviewStage = details
      .split("&Number=")[1]
      .split("&Stage=")[1];
    if (splitedName.length === 3) {
      firstName = splitedName[0];
      middleName = splitedName[1];
      lastName = splitedName[2];
    } else {
      firstName = splitedName[0];
      middleName = "";
      lastName = splitedName[1];
    }

    return (
      <div>
        <Typography variant="h5" id="modal-title">
          Student Status
          <br />
        </Typography>
        <MUIDataTable
          title={
            pendingInterviewStage
              ? `${firstName.concat(" ", middleName, " ", lastName)}
            ${this.message.testFailedMessage[selectedLang]}`
              : `${firstName.concat(" ", middleName, " ", lastName)}
               ${this.message.stageMessage[selectedLang]}`
          }
          columns={this.columns}
          data={data}
          options={{
            viewColumns: false,
            print: false,
            download: false,
            exportButton: true,
            pageSize: 100,
            selectableRows: "none",
            rowsPerPage: 20,
            rowsPerPageOptions: [20, 40, 60],
            toolbar: false,
            filter: false,
            responsive: "stacked",
          }}
        />
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withSnackbar(
  withRouter(
    withStyles(useStyles)(
      connect(undefined, mapDispatchToProps)(DuplicateStudents)
    )
  )
);
