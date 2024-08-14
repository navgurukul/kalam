import React from "react";
import { Link } from "react-router-dom";

const PartnerLink = ({ text, url }) => (
  <Link
    target="_blank"
    style={{ color: "#f05f40" }}
    to={{
      pathname: url,
    }}
  >
    {text}
  </Link>
);

export default PartnerLink;
