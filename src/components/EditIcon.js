import React, { Component, Fragment } from "react";
import EditIcon from "@material-ui/icons/Edit";
import { Dialog } from "@material-ui/core";
import AddPartner from "./AddPartner";
import DialogContent from "@material-ui/core/DialogContent";

class EditPartnerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
    };
  }
  handleClose = () => {
    this.setState({
      dialogOpen: false,
    });
  };
  handleOpen = () => {
    this.setState({
      dialogOpen: true,
    });
  };

  render() {
    const { value } = this.props;
    return (
      <Fragment>
        <EditIcon onClick={this.handleOpen} style={{ cursor: "pointer" }} />
        <Dialog
          scroll="paper"
          open={this.state.dialogOpen}
          onClose={this.handleClose}
        >
          <DialogContent dividers={true}>
            <AddPartner value={value} />
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

export default EditPartnerDetails;
