import React, { Fragment } from "react";

import axios from "axios";
import { withSnackbar } from "notistack";

import EditIcon from "@material-ui/icons/Edit";

import { Box } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Avatar from "@material-ui/core/Avatar";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Tooltip from "@material-ui/core/Tooltip";

const baseUrl = process.env.API_URL;
import { Button } from "@material-ui/core";

export class AddMerakiLink extends React.Component {
  render = () => {
    const { isValue } = this.props;

    if (isValue) {
      return (
        <div>
          <Tooltip title="Copy Details" style={{ background: "#f05f40" }}>
            <CopyToClipboard
              text={"komal bhatt"}
              onCopy={() => this.setState({ copied: true })}
            >
              <Avatar alt="Remy Sharp">
                <FileCopyIcon style={{ cursor: "pointer" }} />
              </Avatar>
            </CopyToClipboard>
          </Tooltip>
        </div>
      );
    }
    return (
      <Button
        variant="contained"
        color="primary"
        // onClick={this.addOrUpdateMobile}
      >
        Create Meraki Link
      </Button>
    );
  };
}

export default withSnackbar(AddMerakiLink);
