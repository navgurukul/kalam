import React from "react";
import { Link } from "react-router-dom";

const PartnerLink = (props) => {
  const { text, url } = props;
  return (
    <div>
      <Link
        target="_blank"
        style={{ color: "#f05f40" }}
        to={{
          pathname: url,
        }}
      >
        {text}
      </Link>
    </div>
  );
};

export default PartnerLink;
