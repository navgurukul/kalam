import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeFetching } from "../store/slices/authSlice";
import SlotBooking from "./SlotBooking";

const baseUrl = import.meta.env.VITE_API_URL;

const { allStages } = require("../config");

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
  const navigate = useNavigate();
  const location = useLocation();
  const { name, number, stage } = useParams();
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

  const generateTestLink = async (studentId) => {
    try {
      const partnerId = state.partnerId ? state.partnerId : null;
      // const details = window.location.href.split("Name=")[1];
      // const mobileNumber = details.split("&Number=")[1].split("&Stage=")[0];
      const mobile = `0${number}`;
      fetchingStart();
      const dataURL = `${baseUrl}helpline/register_exotel_call`;
      const response = await axios.get(dataURL, {
        params: {
          ngCallType: "getEnrolmentKey",
          From: mobile,
          partner_id: partnerId,
          student_id: studentId,
        },
      });
      fetchingFinish();
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
      throw Error(e.message);
    }
  };
  const columns = [
    {
      name: "id",
      label: "Re-Test",
      options: {
        filter: false,
        customBodyRender: React.useCallback(
          (value, rowData) => (
            <Button
              disabled={rowData.rowData[1] === "pendingEnglishInterview"}
              variant="contained"
              color="primary"
              style={{ fontSize: "10px" }}
              onClick={async () => {
                const response = await generateTestLink(value);
                const [firstName, middleName, lastName] = name.split("_");
                navigate(`/test/instructions`, {
                  state: {
                    enrollmentKey: response.data.key,
                    studentId: value,
                    number,
                    firstName,
                    middleName,
                    lastName,
                    mobileNumber: number,
                  },
                });
                fetchingFinish();
              }}
            >
              {/* {console.log(value)} */}
              Re-Test
            </Button>
          ),
          []
        ),
      },
    },
    {
      name: "stage",
      label: "Stage",
      options: {
        filter: false,
        customBodyRender: (value) => allStages[value],
      },
    },
    {
      name: "stage",
      label: "Book Slot",
      options: {
        filter: false,
        customBodyRender: React.useCallback(
          (_, rowData) => (
            <Button
              disabled={rowData.rowData[1] !== "pendingEnglishInterview"}
              variant="contained"
              color="primary"
              style={{ fontSize: "10px" }}
              onClick={() => {
                navigate({
                  pathname: `/bookSlot/${rowData.rowData[0]}`,
                });
              }}
            >
              Book Slot
            </Button>
          ),
          []
        ),
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

  const isDuplicate = () => {
    // const details = window.location.href.split("Name=")[1];
    // const mobileNumber = details.split("&Number=")[1].split("&Stage=")[0];
    const mobileNumber = number;
    // const name = details.split("&Number=")[0];
    axios
      .get(`${baseUrl}check_duplicate`, {
        params: {
          Name: name.split("_").join(""),
          Number: mobileNumber,
        },
      })
      .then(async (data) => {
        const response = data.data.data;

        if (response.alreadyGivenTest) {
          setState({ ...state, response, data: response.data });
        } else {
          setState({
            ...state,
            response,
          });
        }

        return response;
      });
  };
  const partnerFetch = async (slug) => {
    try {
      const response = await axios.get(`${baseUrl}partners/slug/${slug}`, {});
      setState({
        ...state,
        partnerId: response.data.data.id,
      });
    } catch (e) {
      navigate("/notFound");
    }
  };

  useEffect(() => {
    const slug = window.location.href.split("partnerLanding/")[1];
    if (slug) {
      partnerFetch(slug);
    }
    isDuplicate();
  }, []);

  const { data } = state;
  const selectedLang =
    location.state === null ? "en" : location.state.selectedLang;
  let firstName;
  let middleName = "";
  let lastName;
  // const splitedName = name.match(/[A-Z][a-z]+/g);
  const splittedName = name.split("_");
  const pendingInterviewStage = stage;
  if (splittedName.length === 3) {
    [firstName, middleName, lastName] = splittedName;
  } else {
    [firstName, lastName] = splittedName;
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
              : `${firstName.concat(" ", middleName, "", lastName)}${
                  message.stageMessage[selectedLang]
                }`
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
            responsive: "vertical",
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
        // eslint-disable-next-line prettier/prettier
        <div />
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
