import React from "react";

import axios from "axios";
import { useSnackbar } from "notistack";

import { CopyToClipboard } from "react-copy-to-clipboard";
import Avatar from "@material-ui/core/Avatar";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const baseUrl = process.env.API_URL;
import { Button } from "@material-ui/core";

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

const AddMerakiLink = (props) => {
  const { isValue, studentId } = props;
  const classes = useStyles();
  const snackbar = useSnackbar();
  const creatMerakiLink = async (studentId) => {
    const { updateValue } = this.props;
    axios({
      method: "put",
      url: `${baseUrl}partners/${studentId}/merakiLink`,
      headers: {
        platform: "android",
      },
    })
      .then((response) => {
        snackbar.enqueueSnackbar("Meraki link successfully created", {
          variant: "success",
        });
        //console.log(response, "response");
        const data = response.data.data.meraki_link;
        //console.log(data, "data");
        updateValue(data);
        //console.log(this.props.updateValue, "updateValue");
      })
      .catch(() => {
        snackbar.enqueueSnackbar(`Something went wrong`, {
          variant: "error",
        });
      });
  };

  if (isValue)
    return (
      <div className={classes.container}>
        <Tooltip title="Copy Meraki Link" style={{ background: "#f05f40" }}>
          <CopyToClipboard text={isValue}>
            <Avatar alt="Remy Sharp">
              <FileCopyIcon style={{ cursor: "pointer" }} />
            </Avatar>
          </CopyToClipboard>
        </Tooltip>

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
