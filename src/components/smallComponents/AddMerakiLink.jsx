import React from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Tooltip from "@mui/material/Tooltip";
import { makeStyles } from "@mui/styles";
import { Button, IconButton } from "@mui/material";
import CopyToClipboard from "react-copy-to-clipboard";

const baseUrl = import.meta.env.VITE_API_URL;
// done
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "#f05f40",
    padding: theme.spacing(3, 1),
  },
}));

const AddMerakiLink = ({ isValue, studentId, updateValue }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const creatMerakiLink = async () => {
    axios({
      method: "put",
      url: `${baseUrl}partners/${studentId}/merakiLink`,
      headers: {
        platform: "android",
      },
    })
      .then((response) => {
        enqueueSnackbar("Meraki link successfully created", {
          variant: "success",
        });
        //console.log(response, "response");
        const data = response.data.data.meraki_link;
        //console.log(data, "data");
        updateValue(data);
        //console.log(this.props.updateValue, "updateValue");
      })
      .catch(() => {
        enqueueSnackbar(`Something went wrong`, {
          variant: "error",
        });
      });
  };

  if (isValue)
    return (
      <div className={classes.container}>
        <CopyToClipboard
          text={isValue}
          onCopy={(text, result) => {
            if (result) enqueueSnackbar("Link Copied!", { variant: "success" });
          }}
        >
          <Tooltip title="Copy Meraki Link" style={{ background: "#f05f40" }}>
            <IconButton>
              <FileCopyIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </CopyToClipboard>

        <a
          className={classes.link}
          href={isValue}
          target="_blank"
          rel="noreferrer noopener"
        >
          Get Link
        </a>
      </div>
    );
  return (
    <Button
      variant="contained"
      color="primary"
      // style={{ fontSize: "10px" }}
      onClick={() => creatMerakiLink(studentId)}
    >
      Create
    </Button>
  );
};

export default AddMerakiLink;
