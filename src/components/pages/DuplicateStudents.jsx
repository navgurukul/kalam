import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeFetching } from "../../store/slices/uiSlice";
import { allStages } from "../../utils/constants";
import {
  setEnrollmentKey,
  setStudentData,
  setStudentId,
} from "../../store/slices/onlineTestSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const DuplicateStudents = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const { lang } = useSelector((state) => state.ui);
  const [partnerId, setPartnerId] = React.useState(null);
  const [test, setTest] = React.useState({
    data: [],
    pendingInterviewStage: "checking",
  });
  const { search } = useLocation();

  const name = search.split("=")[1].split("&")[0];
  const number = search.split("=")[2].split("&")[0];

  const generateTestLink = async (studentId) => {
    try {
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
          (value, rowMeta) => (
            <Button
              disabled={
                rowMeta.rowData[1] === "pendingEnglishInterview" ||
                rowMeta.rowData[1] === "pendingCultureFitInterview" ||
                rowMeta.rowData[1] === "pendingAlgebraInterview"
              }
              variant="contained"
              color="primary"
              style={{ fontSize: "10px" }}
              onClick={async () => {
                const response = await generateTestLink(value);
                const [firstName, middleName, lastName] = name.split("_");
                dispatch(
                  setStudentData({
                    firstName,
                    middleName,
                    lastName,
                    mobileNumber: number,
                  })
                );
                dispatch(setEnrollmentKey(response.data.key));
                dispatch(setStudentId(value));
                navigate(`/test/instructions`);
                fetchingFinish();
              }}
            >
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
          (_, rowMeta) => (
            <Button
              disabled={rowMeta.rowData[1] !== "pendingEnglishInterview"
                && rowMeta.rowData[1] !== "pendingCultureFitInterview"
                && rowMeta.rowData[1] !== "pendingAlgebraInterview"
              }
              variant="contained"
              color="primary"
              style={{ fontSize: "10px" }}
              onClick={() => {
                navigate({
                  pathname: `/bookSlot/${rowMeta.rowData[0]}`,
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
        customBodyRender: (value, rowMeta) =>
          rowMeta.rowData[1] === "enrolmentKeyGenerated" && value === null
            ? "Last Test Not Submitted"
            : value,
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
      en: `Your  ${allStages[test.pendingInterviewStage]
        } is still pending. You’re not required to give the online test now. We will soon complete your admission process.`,
      hi: `आपका  ${allStages[test.pendingInterviewStage]
        }  अभी भी चल रहा हैं। अभी आपको ऑनलाइन परीक्षा देने की आवश्यकता नहीं है। हम जल्द ही आपकी प्रवेश प्रक्रिया (एडमिशन प्रोसेस) पूरी कर देंगे।`,
    },
    testFailedMessage: {
      en: `, Your previous attempts were unsuccessful/test failed, please give the 1st stage of the online test again.`,
      hi: `, आपके पिछले टेस्ट असफल रहे या आप पास नहीं हो पाए, कृपया ऑनलाइन टेस्ट वापस से दे।`,
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
          setTest({
            ...test,
            data: response.data,
            pendingInterviewStage: response.data[0].stage,
          });
        }
      });
  };
  const partnerFetch = async (slug) => {
    try {
      const response = await axios.get(`${baseUrl}partners/slug/${slug}`, {});
      setPartnerId(response.data.data.id);
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

  const { data } = test;
  const selectedLang = lang;
  let firstName;
  let middleName = "";
  let lastName;
  // const splitedName = name.match(/[A-Z][a-z]+/g);
  const splittedName = name.split("_");
  const { pendingInterviewStage } = test;
  if (splittedName.length === 3) {
    [firstName, middleName, lastName] = splittedName;
    console.log("Middle name", middleName);
  } else {
    [firstName, lastName] = splittedName;
  }
  console.log("Is this page is coming?");

  return (
    <>
      <Typography variant="h5" id="modal-title">
        Student Status
        <br />
      </Typography>
      <MUIDataTable
        title={
          pendingInterviewStage === "enrolmentKeyGenerated" ||
            pendingInterviewStage === "testFailed"
            ? `${firstName.concat(" ", middleName, " ", lastName)}
            ${message.testFailedMessage[selectedLang]}`
            : `${firstName.concat(" ", middleName, " ", lastName)}${message.stageMessage[selectedLang]
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
