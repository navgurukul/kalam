import React, { Fragment } from "react";

import axios from "axios";
import { withSnackbar } from "notistack";

import { CopyToClipboard } from "react-copy-to-clipboard";
import Avatar from "@material-ui/core/Avatar";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

const baseUrl = process.env.API_URL;
import { Button } from "@material-ui/core";

const styles = (theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "#f05f40",
    padding: theme.spacing(3, 1),
  },
});

export class AddMerakiLink extends React.Component {
  creatMerakiLink = async (studentId) => {
    const { updateValue } = this.props;
    // const response = await axios
    //   .put(`${baseUrl}partners/${studentId}/merakiLink`, {
    //     headers: {
    //       platform: "web",
    //     },
    //   })
    //   .then((response) => {
    //     this.props.enqueueSnackbar("Meraki link successfully created", {
    //       variant: "success",
    //     });
    //     console.log(response, "response");
    //     const data = response.data.data[0].meraki_link;
    //     updateValue(data);
    //     console.log(this.props.updateValue, "updateValue");
    //   })
    //   .catch((e) => {
    //     this.props.enqueueSnackbar(`Something went wrong`, {
    //       variant: "error",
    //     });
    //   });
    try {
      const { data } = await axios({
        method: "put",
        url: `${baseUrl}partners/${studentId}/merakiLink`,
        headers: {
          platform: "android",
        },
      });

      console.log(data.data.meraki_link);
      this.props.enqueueSnackbar("Meraki link successfully created", {
        variant: "success",
      });

      const updatedData = data.data.meraki_link;
      updateValue(updatedData);
      console.log(this.props.updateValue, "updateValue");
    } catch (err) {
      this.props.enqueueSnackbar(`Something went wrong`, {
        variant: "error",
      });
    }
  };
  render = () => {
    const { isValue, studentId } = this.props;
    const { classes } = this.props;

    if (isValue) {
      return (
        <div className={classes.container}>
          <Tooltip title="Copy Meraki Link" style={{ background: "#f05f40" }}>
            <CopyToClipboard text={isValue}>
              <Avatar alt="Remy Sharp">
                <FileCopyIcon style={{ cursor: "pointer" }} />
              </Avatar>
            </CopyToClipboard>
          </Tooltip>

          <a className={classes.link} href={isValue} target="_blank">
            Get Link
          </a>
        </div>
      );
    }
    return (
      <Button
        variant="contained"
        color="primary"
        // style={{ fontSize: "10px" }}
        onClick={() => this.creatMerakiLink(studentId)}
      >
        Create
      </Button>
    );
  };
}

export default withSnackbar(withStyles(styles)(AddMerakiLink));
