import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { withSnackbar } from "notistack";
import EmailSentFailed from "./EmailSentFailed";

const _ = require("underscore");
const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

export class StageSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      payload: {
        receiverEmail: "",
        name: "",
        campus: "",
        cc: "",
      },
    };
  }

  ConnectMerakiApi = () => {
    axios
      .post(
        `https://connect.merakilearn.org/api/offerLetter/admissions`,
        this.state.payload
      )
      .then((res) => {
        this.props.enqueueSnackbar("Email sent successfully!", {
          variant: "success",
        });
      })
      .catch((err) => {
        this.props.enqueueSnackbar("Email has not sent successfully!", {
          variant: "unsuccess!",
        });
      });
  };

  getParnetId = async (id) => {
    const response = await axios.get(
      `https://join.navgurukul.org/api/partners/studentId/${id}`
    );
    return response.data.data;
  };

  handleChange = async (selectedValue) => {
    let id = this.props.rowMetatable.rowData[0];
    let isEmail = await this.getParnetId(id);

    if (this.props.rowMetatable.rowData[7] != null) {
      await this.setState({
        payload: {
          receiverEmail: this.props.rowMetatable.rowData[7],
          name: this.props.rowMetatable.rowData[2],
          campus: selectedValue.value.substr(8, selectedValue.value.length - 1),
          cc:
            isEmail === null ? "" : isEmail.email === null ? "" : isEmail.email,
        },
      });
      this.ConnectMerakiApi();
    } else {
      this.setState({
        flag: true,
      });
    }

    try {
      const { rowMetatable, change } = this.props;
      const studentId = rowMetatable.rowData[0];
      const columnIndex = rowMetatable.columnIndex;
      const { value, label } = selectedValue;
      axios
        .post(`${baseUrl}students/chnageStage/${studentId}`, { stage: value })
        .then(() => {
          this.props.enqueueSnackbar("stage is successfully changed!", {
            variant: "success",
          });
          change(label, columnIndex);
        })
        .catch(() => {
          this.props.enqueueSnackbar(
            "Something is wrong with previous stage!",
            { variant: "error" }
          );
        });
    } catch (e) {
      this.props.enqueueSnackbar(e, { variant: "error" });
    }
  };

  render = () => {
    const { allStages, stage } = this.props;
    const allStagesOptions = Object.keys(allStages).map((x) => {
      return { value: x, label: allStages[x] };
    });

    const selectedValue = { value: _.invert(allStages)[stage], label: stage };
    return (
      <div>
        <Select
          className={"filterSelectStage"}
          // defaultValue={selectedValue}
          value={selectedValue}
          onChange={this.handleChange}
          options={allStagesOptions}
          // placeholder={"Select "+this.props.filter.name+" ..."}
          isClearable={false}
          components={animatedComponents}
          closeMenuOnSelect={true}
        />
        {this.state.flag ? <EmailSentFailed /> : null}
      </div>
    );
  };
}

export default withSnackbar(StageSelect);
