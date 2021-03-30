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
      flag : false,
      payload : {
        receiverEmail : "",
        name : "",
        campus : "",
        cc : "anand@navgurukul.org saquib@navgurukul.org"
      }
    }
  }

  

  ConnectMerakiApi = () => {
    axios.post(`https://connect.merakilearn.org/api/offerLetter/admissions`, this.state.payload
    // {
    //   "receiverEmail": "poonam@navgurukul.org",
    //   "name": "Poonam",
    //   "campus": "Pune",
    //   "cc": "anand@navgurukul.org saquib@navgurukul.org"
  // } 
  )
    .then(res => {
      console.log("response", res)
      console.log("Campus In", this.state.payload)
      this.props.enqueueSnackbar("Email sent successfully!", {
        variant: "success",
      });
    })
    .catch(err => {
      console.log('Error', err)
      console.log("Campus In error", this.state.payload)
      this.setState({
        flag : true
      })
    })
  }

  handleChange = (selectedValue) => {
    // const { value, label } = selectedValue;
    if (selectedValue.value == "selectedPune") {
      this.setState({
        flag : false,
        payload : {
          receiverEmail : "",
          name : "",
          campus : "Pune",
          cc : "komala@navgurukul.org saquib@navgurukul.org"
        }
      })
      console.log("campus",this.state.payload)
      this.ConnectMerakiApi()
    }
    else if (selectedValue.value == "selectedBangalore") {
      this.setState({
        flag : false,
        payload : {
          receiverEmail : "",
          name : "",
          campus : "Bangalore",
          cc : "komala@navgurukul.org saquib@navgurukul.org"
        }
      })
      console.log("campus",this.state.payload)
      this.ConnectMerakiApi()
    }
    else if (selectedValue.value == "selectedSarjapura") {
      this.setState({
        flag : false,
        payload : {
          receiverEmail : "",
          name : "",
          campus : "Sarjapura",
          cc : "anand@navgurukul.org saquib@navgurukul.org"
        }
      })
      console.log("campus",this.state.payload)
      this.ConnectMerakiApi()
    }
    else if (selectedValue.value == "selectedDharamshala") {
      this.setState({
        flag : false,
        payload : {
          receiverEmail : "",
          name : "",
          campus : "Dharamshala",
          cc : "anand@navgurukul.org saquib@navgurukul.org"
        }
      })
      console.log("campus",this.state.payload)
      this.ConnectMerakiApi()
    }
        // selectedValue.value == "selectedBangalore" || 
        // selectedValue.value == "selectedSarjapura" ||
        // selectedValue.value == "selectedDharamshala") {
          // console.log("value", value)
          // console.log("campus",this.state.payload)
          // this.ConnectMerakiApi()
    
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
    console.log(this.props)
    console.log("punnu",this.state)
    const flag = this.state.flag
    const { allStages, stage } = this.props;
    // console.log("allStages", allStages, "stage",stage)
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
      
        {
          flag ? <EmailSentFailed /> : null
        }
      </div>
    );
  };
}

export default withSnackbar(StageSelect);
