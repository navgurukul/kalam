import React from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { Dialog, Box } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";

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
  const { comment } = props;
  const [state, setState] = React.useState({
    redflag: "",
    dialogOpen: false,
    flagComment: comment,
    flagColorToggle: comment,
  });

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
    <>
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
    </>
  );
};

export default RedFlag;
