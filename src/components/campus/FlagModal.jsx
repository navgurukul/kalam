import React from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { Dialog, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
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

const RedFlag = ({ comment }) => {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [flagComment, setFlagComment] = React.useState(comment);

  const handleChange = (event) =>
    setFlagComment(event.target.value.length === 0 ? event.target.value : "");

  const toggleDialog = () => {
    setDialogOpen((prev) => !prev);
  };

  return (
    <>
      <IconButton onClick={toggleDialog}>
        <FlagIcon
          sx={{
            color: `${comment ? "red" : "green"}`,
          }}
        />
      </IconButton>
      <Dialog open={dialogOpen} onClose={toggleDialog}>
        <Box sx={{ py: "0.6rem", px: "0.2rem" }}>
          <Typography
            variant="h4"
            fontWeight="medium"
            color="primary"
            textAlign="center"
            sx={{
              my: "0.2rem",
            }}
          >
            Raised Flag
          </Typography>
          <TextField
            focused
            id="outlined-multiline-static"
            label="Raised Flag Comments"
            placeholder="No Red Flag Raised"
            multiline
            readOnly
            rows="4"
            name="redFlag"
            defaultValue={flagComment ?? "No Red Flag Raised"}
            onChange={handleChange}
            className={classes.textField}
            margin="normal"
            variant="outlined"
            inputProps={{ readOnly: true }}
          />
        </Box>
      </Dialog>
    </>
  );
};

export default RedFlag;
