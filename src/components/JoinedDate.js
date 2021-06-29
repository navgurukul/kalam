import React, { Component } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";
import Moment from "react-moment";
import { withSnackbar } from "notistack";
const baseURL = process.env.API_URL;
import axios from "axios";

class JoinedDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: this.props.value,
      isShowDatePicker: false,
    };
  }
  changeDate = (date) => {
    const { transitionId } = this.props;
    const formateddate = moment(date).format("YYYY-MM-DD");
    axios
      .put(`${baseURL}students/transition/${transitionId}`, {
        when: formateddate,
      })
      .then((res) => {
        this.props.enqueueSnackbar(`Joining successfully updated !`, {
          variant: "success",
        });
      })
      .catch((err) => {
        this.props.enqueueSnackbar(`Something went wrong`, {
          variant: "unsuccess!",
        });
      });
    this.setState({
      currentDate: date,
      isShowDatePicker: !this.state.isShowDatePicker,
    });
  };

  showDatePicker = () => {
    this.setState({ isShowDatePicker: !this.state.isShowDatePicker });
  };
  render() {
    const { currentDate, isShowDatePicker } = this.state;
    if (isShowDatePicker) {
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="dense"
            style={{ marginLeft: 16 }}
            value={currentDate}
            id="date-picker-dialog"
            label="Joining Date"
            format="MM/dd/yyyy"
            onChange={this.changeDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      );
    }
    return (
      <div>
        <Moment format="D MMM YYYY" withTitle style={{ marginRight: 10 }}>
          {currentDate}
        </Moment>
        <EditIcon onClick={this.showDatePicker} style={{ cursor: "pointer" }} />
      </div>
    );
  }
}

export default withSnackbar(JoinedDate);
