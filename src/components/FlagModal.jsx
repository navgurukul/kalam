import React from "react";
// import { useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
// import axios from "axios";
// import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import { Dialog, Box } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
// import { changeFetching } from "../store/actions/auth";

// const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    maxWidth: 400,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
  },
  btn: {
    marginTop: theme.spacing(4),
  },
}));

const RedFlag = (props) => {
  const classes = useStyles();
  // const { enqueueSnackbar } = useSnackbar();
  // const dispatch = useDispatch();
  // const fetchingStart = () => dispatch(changeFetching(true));
  // const fetchingFinish = () => dispatch(changeFetching(false));
  const { comment } = props;
  const [state, setState] = React.useState({
    redflag: "",
    dialogOpen: false,
    flagComment: comment,
    flagColorToggle: comment,
  });

  // const addFlagComment = async () => {
  //   try {
  //     fetchingStart();
  //     const { change, rowMetaTable } = props;
  //     const { columnIndex } = rowMetaTable;
  //     const { studentId } = props;

  //     await axios
  //       .put(`${baseUrl}students/redflag/${studentId}`, {
  //         flag: state.flagComment,
  //       })
  //       .then(() => {
  //         //console.log(response);
  //         setState((prevState) => ({
  //           ...prevState,
  //           dialogOpen: false,
  //           flagColorToggle: state.flagComment,
  //         }));
  //         if (state.flagComment === "") {
  //           enqueueSnackbar("Cleared Flag!", {
  //             variant: "success",
  //           });
  //         } else {
  //           enqueueSnackbar("Flag Raised successfully!", {
  //             variant: "success",
  //           });
  //         }
  //         change(state.redflag, columnIndex);
  //       });
  //     fetchingFinish();
  //   } catch (e) {
  //     //console.log(e);
  //     enqueueSnackbar("Please select student Status", {
  //       variant: "error",
  //     });
  //     fetchingFinish();
  //   }
  // };

  // const onSubmit = () => {
  //   setState({
  //     ...state,
  //     loading: true,
  //   });
  //   addFlagComment();
  // };

  const handleChange = () => (event) => {
    if (event.target.value.length === 0) {
      setState({ ...state, flagComment: "" });
    } else {
      setState({ ...state, flagComment: event.target.value });
    }
  };

  const handleClose = () => {
    setState({
      ...state,
      dialogOpen: false,
    });
  };

  const handleOpen = () => {
    setState({
      ...state,
      dialogOpen: true,
    });
  };

  return (
    <fragment>
      <Box onClick={handleOpen}>
        {state.flagColorToggle ? (
          <FlagIcon
            style={{
              cursor: "pointer",
              color: "red",
            }}
          />
        ) : (
          <FlagIcon
            style={{
              cursor: "pointer",
              color: "green",
            }}
          />
        )}
      </Box>
      <Dialog open={state.dialogOpen} onClose={handleClose}>
        <form className={classes.container}>
          <h1
            style={{
              color: "#f05f40",
              textAlign: "center",
              marginTop: "0px",
              position: "relative",
              bottom: "20px",
            }}
          >
            Raised Flag
          </h1>
          <TextField
            style={{
              position: "relative",
              bottom: "20px",
            }}
            id="outlined-multiline-static"
            label="raised flag"
            placeholder="no red flag raised"
            multiline
            readOnly="true"
            rows="4"
            name="redFlag"
            defaultValue={
              state.flagComment === null
                ? "no red flag raised"
                : state.flagComment
            }
            onChange={handleChange()}
            className={classes.textField}
            margin="normal"
            variant="outlined"
            inputProps={{ readOnly: true }}
          />
        </form>
      </Dialog>
    </fragment>
  );
};

export default RedFlag;
