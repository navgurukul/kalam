import { EmailRule } from "devextreme-react/data-grid";
import React from "react";
import { Link } from "react-router-dom";
var hash = require("object-hash");

const formColor = [
  {
    name: "Form A",
    color: "#FFC478",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfwJ-wBjATx2AjpwqBSlWM0rv0FFKP7or1Jx3PqoijbU_tj_A/viewform?usp=pp_url&entry.1892909192=",
  },
  {
    name: "Form B",
    color: "#75CFB8",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSd3f9XiYVkzGV7ZggLAlTSg-rDM4HqsdtafCzNJSXyVKFp24A/viewform?usp=pp_url&entry.824382679=",
  },
  {
    name: "Form C",
    color: "#EFB7B7",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSetOkINBkhw4DKDAW81HajHvSr4vAGKa6epcFKN-4CmvUhsyA/viewform?usp=pp_url&entry.1823157052=",
  },
];
class SurveyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
    };
  }
  check = (a) => {
    const { data } = this.props;
    let hashValue = hash(data);
    this.setState({
      url: `${a}${hashValue}`,
    });
  };
  render() {
    const { url } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {formColor.map((element) => {
          return (
            <a
              href={url}
              target="_blank"
              style={{
                backgroundColor: element.color,
                textAlign: "center",
                borderRadius: "75px",
                margin: "10px",
              }}
              onClick={() => this.check(element.link)}
            >
              {element.name}
            </a>
          );
        })}
      </div>
    );
  }
}

export default SurveyForm;
