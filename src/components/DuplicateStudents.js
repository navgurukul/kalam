import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { allStages } from "../config";
import { changeFetching } from "../store/actions/auth";
import SlotBooking from "./SlotBooking";

const baseUrl = process.env.API_URL;

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     position: "absolute",
//     marginLeft: "3vw",
//     marginRight: "3vw",
//     width: "94vw",
//     [theme.breakpoints.up("md")]: {
//       margin: "auto",
//       width: "50%",
//     },
//     backgroundColor: theme.palette.background.paper,
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(4),
//     outline: "none",
//   },
// }));

const DuplicateStudents = () => {
  // const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [state, setState] = React.useState({
    partnerId: "",
    data: [],
    pendingInterviewStage: "checking",
    response: {},
    slotBooking: false,
    slotBookingData: {},
  });
  const columns = [
    {
      name: "id",
      label: "Re-Test",
      options: {
        filter: false,
        customBodyRender: (value, rowData) => {
          return (
            <Button
              disabled={
                rowData.rowData[1] === "pendingEnglishInterview" ? true : false
              }
              variant="contained"
              color="primary"
              style={{ fontSize: "10px" }}
              onClick={async () => {
                //console.log("value", value);

                const response = await generateTestLink(value);
                history.push({
                  pathname: `/test/${response.data.key}/${value}`,
                });
                fetchingFinish();
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
      name: "stage",
      label: "Book Slot",
      options: {
        filter: false,
        customBodyRender: (value, rowData) => {
          return (
            <Button
              disabled={
                rowData.rowData[1] === "pendingEnglishInterview" ? false : true
              }
              variant="contained"
              color="primary"
              style={{ fontSize: "10px" }}
              onClick={() => {
                //console.log(rowData.rowData[0]);
                //console.log(rowData.rowData[1]);
                this.props.history.push({
                  pathname: `/bookSlot/${rowData.rowData[0]}`,
                });

                // this.setState({
                //   slotBooking: true,
                //   slotBookingData: {
                //     studentId: rowData.rowData[0],
                //     stage: allStages[rowData.rowData[1]],
                //   },
                // });
              }}
            >
              Book Slot
            </Button>
          );
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
  const message = {
    stageMessage: {
      en: `Your  ${
        allStages[state.pendingInterviewStage]
      } is still pending. You’re not required to give the online test now. We will soon complete your admission process.`,
      hi: `आपका  ${
        allStages[state.pendingInterviewStage]
      }  अभी भी चल रहा हैं। अभी आपको ऑनलाइन परीक्षा देने की आवश्यकता नहीं है। हम जल्द ही आपकी प्रवेश प्रक्रिया (एडमिशन प्रोसेस) पूरी कर देंगे।`,
    },
    testFailedMessage: {
      en: ` , Your previous attempts were unsuccessful/test failed, please give the 1st stage of the online test again.`,
      hi: ` , आपके पिछले टेस्ट असफल रहे या आप पास नहीं हो पाए, कृपया ऑनलाइन टेस्ट वापस से दे।`,
    },
  };

  const generateTestLink = async (studentId) => {
    try {
      const partnerId = state.partnerId ? state.partnerId : null;
      const details = window.location.href.split("Name=")[1];
      const mobileNumber = details.split("&Number=")[1].split("&Stage=")[0];
      const mobile = "0" + mobileNumber;
      fetchingStart();
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
      enqueueSnackbar("Something went wrong", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      fetchingFinish();
    }
  };

  const isDuplicate = () => {
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
        //console.log("response", response);

        if (response.alreadyGivenTest) {
          setState({ ...state, response, data: response.data });
          //console.log("data", state.data);
        } else {
          setState({
            ...state,
            response: response,
          });
        }
        //console.log("data", state.data);

        return response;
      });
  };

  useEffect(() => {
    const slug = window.location.href.split("partnerLanding/")[1];
    if (slug) {
      partnerFetch(slug);
    }
    isDuplicate();
  }, []);

  const partnerFetch = async (slug) => {
    try {
      const response = await axios.get(`${baseUrl}partners/slug/${slug}`, {});
      setState({
        ...state,
        partnerId: response.data.data["id"],
      });
    } catch (e) {
      history.push("/notFound");
    }
  };
  console.log(history);
  const data = state.data;
  const selectedLang =
    history.state === null ? "en" : history.location.state.state.selectedLang;
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
  const closeModal = () => {
    setState({ ...state, slotBooking: false });
  };
  return (
    <>
      <div>
        <Typography variant="h5" id="modal-title">
          Student Status
          <br />
        </Typography>
        <MUIDataTable
          title={
            pendingInterviewStage
              ? `${firstName.concat(" ", middleName, " ", lastName)}
            ${message.testFailedMessage[selectedLang]}`
              : `${firstName.concat(" ", middleName, " ", lastName)}
               ${message.stageMessage[selectedLang]}`
          }
          columns={columns}
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
      {state.slotBooking ? (
        <SlotBooking
          slotBookingData={state.slotBookingData}
          name={firstName.concat(" ", middleName, " ", lastName)}
          closeModal={closeModal}
        />
      ) : (
        <></>
      )}
    </>
  );
};

// const mapDispatchToProps = (dispatch) => ({
//   fetchingStart: () => dispatch(changeFetching(true)),
//   fetchingFinish: () => dispatch(changeFetching(false)),
// });

// export default withSnackbar(
//   withRouter(
//     withStyles(useStyles)(
//       connect(undefined, mapDispatchToProps)(DuplicateStudents)
//     )
//   )
// );
export default DuplicateStudents;
