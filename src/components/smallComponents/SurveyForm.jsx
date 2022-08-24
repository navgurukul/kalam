import React from "react";

import hash from "object-hash";

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

const SurveyForm = ({ data }) => {
  const [url, setUrl] = React.useState("");

  const check = (a) => {
    const hashValue = hash(data);
    setUrl(`${a}${hashValue}`);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {formColor.map((element) => (
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            backgroundColor: element.color,
            textAlign: "center",
            borderRadius: "75px",
            margin: "10px",
          }}
          onClick={() => check(element.link)}
          key={element.name}
        >
          {element.name}
        </a>
      ))}
    </div>
  );
};

export default SurveyForm;
